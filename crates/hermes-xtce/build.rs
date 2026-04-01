#[cfg(not(feature = "codegen"))]
fn main() {
    // Codegen is disabled, we do nothing
}

#[cfg(feature = "codegen")]
fn main() -> Result<(), anyhow::Error> {
    // Codegen is enabled, run the code generation
    codegen::main()
}

#[cfg(feature = "codegen")]
mod codegen {
    use proc_macro2::TokenStream;
    use std::env::var;
    use std::fs::write;
    use std::path::{Path, PathBuf};
    use xsd_parser::config::{RenderStepConfig, RendererFlags};
    use xsd_parser::models::code::IdentPath;
    use xsd_parser::models::data::{ComplexData, DataTypeVariant};
    use xsd_parser::models::Naming as NamingImpl;
    use xsd_parser::traits::Naming;
    use xsd_parser::SubModules;
    use xsd_parser::{
        exec_generator_with_ident_cache, exec_interpreter_with_ident_cache, exec_optimizer, exec_parser,
        exec_render, Config, DataTypes,
    };

    use anyhow::{Context, Error};
    use xsd_parser::config::{GeneratorFlags, InterpreterFlags, OptimizerFlags, Schema};
    use xsd_parser::models::schema::xs::AttributeUseType;

    pub(crate) fn main() -> Result<(), Error> {
        let cargo_dir = var("CARGO_MANIFEST_DIR")
            .context("Missing `CARGO_MANIFEST_DIR` environment variable!")?;
        let cargo_dir = PathBuf::from(cargo_dir)
            .canonicalize()
            .context("Missing environment variable `CARGO_MANIFEST_DIR`")?;
        let schema_file = cargo_dir
            .join("schema/xtce-v1.3.xsd")
            .canonicalize()
            .context("Missing or invalid schema file!")?;

        // This is almost the starting point defined in the main `[README.md]`.
        let mut config = Config::default()
            .with_schema(Schema::File(schema_file))
            .with_interpreter_flags(
                InterpreterFlags::all()
                    - InterpreterFlags::WITH_XS_ANY_TYPE
                    - InterpreterFlags::WITH_NUM_BIG_INT,
            )
            .with_naming(XtceNamingFix::default())
            .with_optimizer_flags(OptimizerFlags::SERDE)
            .with_generator_flags(
                GeneratorFlags::all()
                    - GeneratorFlags::ANY_TYPE_SUPPORT
                    - GeneratorFlags::NILLABLE_TYPE_SUPPORT,
            )
            .with_renderer_flags(RendererFlags::all())
            .with_render_step(XtceRenderAddOtherUsingsConfig)
            .with_serde_quick_xml();

        config.generator.text_type = "::std::string::String".to_string();

        let schemas = exec_parser(config.parser)?;
        let (meta_types, ident_cache) =
            exec_interpreter_with_ident_cache(config.interpreter, &schemas)?;
        let meta_types = exec_optimizer(config.optimizer, meta_types)?;
        let mut data_types = exec_generator_with_ident_cache(
            config.generator,
            &schemas,
            Some(&ident_cache),
            &meta_types,
        )?;

        // Modify the output to work around some issues with the code generation
        fix_other_unit_variant(&mut data_types);
        fix_non_optional_attributes(&mut data_types);
        // Note: fix_enum_content_deserialization is commented out because $value fields
        // are not in the attributes collection. We'll handle this during file writing instead.

        let modules = exec_render(config.renderer, &data_types)?;

        // Write the generated code to the module directory specified by Cargo.
        let target_dir = cargo_dir.join("src/schema");
        let directory: &Path = &target_dir.as_ref();
        modules
            .write_to_files_with(|module, path: &Path| -> Result<(), Error> {
                let filename = if module.modules.is_empty() {
                    directory.join(path).with_extension("rs")
                } else {
                    directory.join(path).join("mod.rs")
                };

                let mut code = TokenStream::new();
                module.to_code(&mut code, SubModules::Files);
                let unformatted_code = code.to_string();

                match syn::parse_file(&unformatted_code) {
                    Ok(mut parsed) => {
                        // Post-process to add deserialize_with for enum content fields
                        fix_enum_content_in_parsed_file(&mut parsed);
                        // Optimize single-field wrapper structs by replacing Option<Wrapper> with Vec<Content>
                        optimize_single_field_wrappers(&mut parsed);
                        // Remove Serialize derives to disable serialization functionality
                        remove_serialize_derives(&mut parsed);
                        write(filename, prettyplease::unparse(&parsed))?
                    }
                    Err(_) => write(filename, &unformatted_code)?,
                }

                Ok(())
            })
            .context("Error while writing generated code")?;

        Ok(())
    }

    fn fix_non_optional_attributes(data_types: &mut DataTypes) {
        for (_, type_) in &mut data_types.items {
            match &mut type_.variant {
                DataTypeVariant::Complex(ComplexData::Struct {
                    type_: struct_type, ..
                }) => {
                    for attr in &mut struct_type.attributes {
                        if attr.meta.use_ == AttributeUseType::Required {
                            attr.is_option = false;
                        }
                        // Note: skip_serializing_if attributes are no longer added
                        // since serialization support has been removed
                    }
                }
                _ => {}
            }
        }
    }

    /// Extract the base type name from a potentially wrapped type like Option<T> or Vec<T>
    fn extract_base_type(type_string: &str) -> &str {
        // Handle patterns like ":: core :: option :: Option < BaseType >"
        // or ":: std :: vec :: Vec < BaseType >"
        let trimmed = type_string.trim();

        // Find the last occurrence of '<' and first occurrence of '>' after it
        if let Some(start) = trimmed.rfind('<') {
            if let Some(end) = trimmed[start..].find('>') {
                return trimmed[start + 1..start + end].trim();
            }
        }

        // If no angle brackets, return the whole string
        trimmed
    }

    /// Add deserialize_with attributes to generated code for proper enum deserialization.
    fn fix_enum_content_in_parsed_file(file: &mut syn::File) {
        use quote::ToTokens;
        use syn::visit_mut::{self, VisitMut};
        use syn::{Field, ItemEnum, ItemStruct};
        use std::collections::HashSet;

        struct EnumCollector {
            enum_names: HashSet<String>,
        }

        impl VisitMut for EnumCollector {
            fn visit_item_enum_mut(&mut self, node: &mut ItemEnum) {
                self.enum_names.insert(node.ident.to_string());
                visit_mut::visit_item_enum_mut(self, node);
            }
        }

        struct FieldFixer {
            enum_names: HashSet<String>,
        }

        impl VisitMut for FieldFixer {
            fn visit_item_struct_mut(&mut self, node: &mut ItemStruct) {
                if let syn::Fields::Named(ref mut fields) = node.fields {
                    for field in &mut fields.named {
                        self.fix_field(field);
                    }
                }
                visit_mut::visit_item_struct_mut(self, node);
            }
        }

        impl FieldFixer {
            fn fix_field(&self, field: &mut Field) {
                let type_string = field.ty.to_token_stream().to_string();
                let base_type = extract_base_type(&type_string);
                let is_vec = type_string.contains("Vec");
                let is_option = type_string.contains("Option");

                let mut has_value_rename = false;
                let mut has_attribute_rename = false;

                for attr in &field.attrs {
                    if attr.path().is_ident("serde") {
                        let tokens = attr.meta.to_token_stream().to_string();
                        if tokens.contains("rename") {
                            if tokens.contains("$value") {
                                has_value_rename = true;
                            } else if tokens.contains("@") {
                                has_attribute_rename = true;
                            }
                        }
                    }
                }

                // Add custom deserializers for enum content fields
                if self.enum_names.contains(base_type) && !has_value_rename && !has_attribute_rename {
                    let helper_path = if is_option {
                        "crate::serde_helpers::deserialize_optional_enum_content"
                    } else if is_vec {
                        "crate::serde_helpers::deserialize_vec_enum_content"
                    } else {
                        "crate::serde_helpers::deserialize_enum_content"
                    };

                    let attr: syn::Attribute = syn::parse_quote! {
                        #[serde(deserialize_with = #helper_path)]
                    };
                    field.attrs.push(attr);
                }
            }
        }

        let mut collector = EnumCollector {
            enum_names: HashSet::new(),
        };
        collector.visit_file_mut(file);

        let mut fixer = FieldFixer {
            enum_names: collector.enum_names,
        };
        fixer.visit_file_mut(file);
    }

    /// Optimize single-field wrapper structs by replacing Option<Wrapper> with Vec<Content>
    /// This removes unnecessary indirection for structs that only contain a Vec in a "content" field
    fn optimize_single_field_wrappers(file: &mut syn::File) {
        use quote::ToTokens;
        use syn::visit_mut::{self, VisitMut};
        use syn::{Field, Item, ItemStruct, Type, TypePath};
        use std::collections::HashMap;

        /// Collect all single-field wrapper structs
        struct WrapperCollector {
            wrappers: HashMap<String, Type>,
        }

        impl WrapperCollector {
            fn is_vec_type(&self, ty: &Type) -> Option<Type> {
                if let Type::Path(TypePath { path, .. }) = ty {
                    if path.segments.len() >= 2 {
                        let last = &path.segments.last()?;
                        if last.ident == "Vec" {
                            if let syn::PathArguments::AngleBracketed(args) = &last.arguments {
                                if let Some(syn::GenericArgument::Type(inner)) = args.args.first() {
                                    return Some(inner.clone());
                                }
                            }
                        }
                    }
                }
                None
            }

            fn has_value_rename(&self, field: &Field) -> bool {
                field.attrs.iter().any(|attr| {
                    if attr.path().is_ident("serde") {
                        let tokens = attr.meta.to_token_stream().to_string();
                        tokens.contains("rename") && tokens.contains("$value")
                    } else {
                        false
                    }
                })
            }
        }

        impl VisitMut for WrapperCollector {
            fn visit_item_struct_mut(&mut self, node: &mut ItemStruct) {
                if let syn::Fields::Named(ref fields) = node.fields {
                    // Check if this is a single-field struct
                    if fields.named.len() == 1 {
                        let field = fields.named.first().unwrap();
                        // Check if field is named "content" and is a Vec
                        if field.ident.as_ref().map(|i| i == "content").unwrap_or(false) {
                            if let Some(_inner_type) = self.is_vec_type(&field.ty) {
                                // Check if it has the $value rename attribute
                                if self.has_value_rename(field) {
                                    let struct_name = node.ident.to_string();
                                    // Store the full Vec type
                                    self.wrappers.insert(struct_name, field.ty.clone());
                                }
                            }
                        }
                    }
                }
                visit_mut::visit_item_struct_mut(self, node);
            }
        }

        /// Replace Option<Wrapper> with Vec<Content> in all struct fields
        struct FieldReplacer {
            wrappers: HashMap<String, Type>,
        }

        impl FieldReplacer {
            fn extract_option_inner(&self, ty: &Type) -> Option<String> {
                if let Type::Path(TypePath { path, .. }) = ty {
                    if let Some(last) = path.segments.last() {
                        if last.ident == "Option" {
                            if let syn::PathArguments::AngleBracketed(args) = &last.arguments {
                                if let Some(syn::GenericArgument::Type(Type::Path(inner_path))) = args.args.first() {
                                    if let Some(inner_seg) = inner_path.path.segments.last() {
                                        return Some(inner_seg.ident.to_string());
                                    }
                                }
                            }
                        }
                    }
                }
                None
            }

            fn update_serde_attributes(&self, field: &mut Field) {
                // Update skip_serializing_if from Option::is_none to Vec::is_empty
                // Add custom deserializer for container Vec pattern
                let mut new_attrs = Vec::new();

                for attr in field.attrs.drain(..) {
                    if attr.path().is_ident("serde") {
                        let tokens = attr.meta.to_token_stream().to_string();
                        if tokens.contains("skip_serializing_if") && tokens.contains("is_none") {
                            // Replace with Vec::is_empty
                            new_attrs.push(syn::parse_quote! {
                                #[serde(skip_serializing_if = "Vec::is_empty")]
                            });
                        } else {
                            // Keep other attributes
                            new_attrs.push(attr);
                        }
                    } else {
                        // Keep non-serde attributes
                        new_attrs.push(attr);
                    }
                }

                // Add custom deserializer for container vec pattern
                // This handles the XML container element wrapping the vec elements
                new_attrs.push(syn::parse_quote! {
                    #[serde(deserialize_with = "crate::serde_helpers::deserialize_container_vec")]
                });

                field.attrs = new_attrs;
            }
        }

        impl VisitMut for FieldReplacer {
            fn visit_field_mut(&mut self, field: &mut Field) {
                let mut replaced = false;

                // Check if this field is Option<WrapperType>
                if let Some(wrapper_name) = self.extract_option_inner(&field.ty) {
                    if let Some(vec_type) = self.wrappers.get(&wrapper_name) {
                        // Replace the type
                        field.ty = vec_type.clone();
                        replaced = true;
                    }
                } else if let Type::Path(TypePath { path, .. }) = &field.ty {
                    // Check if this is a direct WrapperType reference (not in Option)
                    if let Some(last) = path.segments.last() {
                        let type_name = last.ident.to_string();
                        if let Some(vec_type) = self.wrappers.get(&type_name) {
                            // Replace direct wrapper type with Vec
                            field.ty = vec_type.clone();
                            replaced = true;
                        }
                    }
                }

                if replaced {
                    // Update serde attributes for the replaced field
                    self.update_serde_attributes(field);
                }

                visit_mut::visit_field_mut(self, field);
            }

            fn visit_type_mut(&mut self, ty: &mut Type) {
                // Also check for direct type references (e.g., in enum variants)
                if let Type::Path(TypePath { path, .. }) = ty {
                    if let Some(last) = path.segments.last() {
                        let type_name = last.ident.to_string();
                        if let Some(vec_type) = self.wrappers.get(&type_name) {
                            // Replace direct wrapper type reference with Vec type
                            *ty = vec_type.clone();
                            return; // Don't recurse after replacement
                        }
                    }
                }
                visit_mut::visit_type_mut(self, ty);
            }
        }

        /// Remove wrapper struct definitions
        struct WrapperRemover {
            wrappers: HashMap<String, Type>,
        }

        impl VisitMut for WrapperRemover {
            fn visit_file_mut(&mut self, file: &mut syn::File) {
                file.items.retain(|item| {
                    if let Item::Struct(item_struct) = item {
                        let struct_name = item_struct.ident.to_string();
                        // Keep the item if it's NOT a wrapper struct
                        !self.wrappers.contains_key(&struct_name)
                    } else {
                        true
                    }
                });
                visit_mut::visit_file_mut(self, file);
            }
        }

        /// Rename *TypeContent enums to *Type for removed wrapper structs
        struct ContentEnumRenamer {
            wrappers: HashMap<String, Type>,
        }

        impl VisitMut for ContentEnumRenamer {
            fn visit_item_enum_mut(&mut self, node: &mut syn::ItemEnum) {
                let enum_name = node.ident.to_string();
                // Check if this enum is a *TypeContent for a removed wrapper
                if enum_name.ends_with("Content") {
                    let base_name = &enum_name[..enum_name.len() - 7]; // Remove "Content"
                    if self.wrappers.contains_key(base_name) {
                        // Rename enum from FooTypeContent to FooType
                        node.ident = syn::Ident::new(base_name, node.ident.span());
                    }
                }
                visit_mut::visit_item_enum_mut(self, node);
            }

            fn visit_type_path_mut(&mut self, node: &mut syn::TypePath) {
                // Update type references from FooTypeContent to FooType
                if let Some(last_segment) = node.path.segments.last_mut() {
                    let type_name = last_segment.ident.to_string();
                    if type_name.ends_with("Content") {
                        let base_name = &type_name[..type_name.len() - 7];
                        if self.wrappers.contains_key(base_name) {
                            last_segment.ident = syn::Ident::new(base_name, last_segment.ident.span());
                        }
                    }
                }
                visit_mut::visit_type_path_mut(self, node);
            }
        }

        // Execute optimization phases
        let mut collector = WrapperCollector {
            wrappers: HashMap::new(),
        };
        collector.visit_file_mut(file);

        if !collector.wrappers.is_empty() {
            let mut replacer = FieldReplacer {
                wrappers: collector.wrappers.clone(),
            };
            replacer.visit_file_mut(file);

            let mut remover = WrapperRemover {
                wrappers: collector.wrappers.clone(),
            };
            remover.visit_file_mut(file);

            // Rename *TypeContent enums to *Type now that wrappers are removed
            let mut renamer = ContentEnumRenamer {
                wrappers: collector.wrappers,
            };
            renamer.visit_file_mut(file);
        }
    }

    /// Remove all Serialize derives from generated code to disable serialization functionality
    fn remove_serialize_derives(file: &mut syn::File) {
        use syn::visit_mut::{self, VisitMut};
        use syn::{Attribute, ItemEnum, ItemStruct};

        struct SerializeRemover;

        impl SerializeRemover {
            fn filter_serialization_attrs(&self, attrs: &mut Vec<Attribute>) {
                use quote::ToTokens;

                attrs.retain(|attr| {
                    // Remove skip_serializing_if attributes (only needed for serialization)
                    if attr.path().is_ident("serde") {
                        let tokens = attr.meta.to_token_stream().to_string();
                        if tokens.contains("skip_serializing_if") {
                            return false;
                        }
                    }
                    true
                });
            }

            fn filter_derives(&self, attrs: &mut Vec<Attribute>) {
                use proc_macro2::TokenStream;
                use std::str::FromStr;

                let mut new_attrs = Vec::new();

                for attr in attrs.drain(..) {
                    if !attr.path().is_ident("derive") {
                        new_attrs.push(attr);
                        continue;
                    }

                    // Parse the derive tokens to filter out Serialize
                    if let syn::Meta::List(ref meta_list) = attr.meta {
                        let tokens_str = meta_list.tokens.to_string();

                        // Split by comma and filter out Serialize and Serialize_enum_str
                        let derives: Vec<&str> = tokens_str
                            .split(',')
                            .map(|s| s.trim())
                            .filter(|s| *s != "Serialize" && *s != "Serialize_enum_str")
                            .collect();

                        // Only add back the derive attribute if there are remaining derives
                        if !derives.is_empty() {
                            let derives_joined = derives.join(", ");
                            // Parse as a token stream and create attribute
                            if let Ok(tokens) = TokenStream::from_str(&derives_joined) {
                                new_attrs.push(syn::parse_quote! { #[derive(#tokens)] });
                            }
                        }
                    } else {
                        new_attrs.push(attr);
                    }
                }

                *attrs = new_attrs;
            }
        }

        impl VisitMut for SerializeRemover {
            fn visit_field_mut(&mut self, node: &mut syn::Field) {
                self.filter_serialization_attrs(&mut node.attrs);
                visit_mut::visit_field_mut(self, node);
            }

            fn visit_item_enum_mut(&mut self, node: &mut ItemEnum) {
                self.filter_derives(&mut node.attrs);
                self.filter_serialization_attrs(&mut node.attrs);
                visit_mut::visit_item_enum_mut(self, node);
            }

            fn visit_item_struct_mut(&mut self, node: &mut ItemStruct) {
                self.filter_derives(&mut node.attrs);
                self.filter_serialization_attrs(&mut node.attrs);
                visit_mut::visit_item_struct_mut(self, node);
            }
        }

        let mut remover = SerializeRemover;
        remover.visit_file_mut(file);

        // Also remove the Serialize import from the serde use statement
        for item in &mut file.items {
            if let syn::Item::Use(use_item) = item {
                if let syn::UseTree::Path(use_path) = &mut use_item.tree {
                    // Remove Serialize from serde::{Deserialize, Serialize}
                    if use_path.ident == "serde" {
                        if let syn::UseTree::Group(ref mut group) = *use_path.tree {
                            // Filter out Serialize from the serde import group
                            group.items = group.items.clone().into_iter().filter(|item| {
                                if let syn::UseTree::Name(name) = item {
                                    name.ident != "Serialize"
                                } else {
                                    true
                                }
                            }).collect();
                        }
                    }
                }
            }
        }
    }

    #[derive(Default, Debug, Clone)]
    struct XtceNamingFix {
        default: NamingImpl,
    }

    impl Naming for XtceNamingFix {
        fn clone_boxed(&self) -> Box<dyn Naming> {
            Box::new(self.clone())
        }

        fn builder(&self) -> Box<dyn xsd_parser::traits::NameBuilder> {
            self.default.builder()
        }

        fn unify(&self, s: &str) -> String {
            self.default.unify(s)
        }

        fn make_type_name(
            &self,
            postfixes: &[String],
            ty: &xsd_parser::config::MetaType,
            ident: &xsd_parser::TypeIdent,
        ) -> xsd_parser::Name {
            self.default.make_type_name(postfixes, ty, ident)
        }

        fn make_unknown_variant(&self, id: usize) -> syn::Ident {
            self.default.make_unknown_variant(id)
        }

        fn format_module_name(&self, s: &str) -> String {
            self.default.format_module_name(s)
        }

        fn format_type_name(&self, s: &str) -> String {
            self.default.format_type_name(s)
        }

        fn format_field_name(&self, s: &str) -> String {
            self.default.format_field_name(s)
        }

        fn format_variant_name(&self, s: &str) -> String {
            let out = match s {
                "==" => "Eq".to_string(),
                "!=" => "Neq".to_string(),
                "<" => "Lt".to_string(),
                ">" => "Gt".to_string(),
                "<=" => "Lte".to_string(),
                ">=" => "Gte".to_string(),
                "+" => "Plus".to_string(),
                "-" => "Minus".to_string(),
                "*" => "Multiply".to_string(),
                "/" => "Divide".to_string(),
                "%" => "Modulo".to_string(),
                "^" => "Pow".to_string(),
                "<<" => "BitwiseLShift".to_string(),
                ">>" => "BitwiseRShift".to_string(),
                "&" => "BitwiseAnd".to_string(),
                "|" => "BitwiseOr".to_string(),
                "&&" => "And".to_string(),
                "||" => "Or".to_string(),
                "!" => "Not".to_string(),
                "~" => "BitwiseNot".to_string(),
                _ => self.default.format_variant_name(s),
            };

            if out == "_" || out == "__" {
                eprintln!("failed to format: {s}");
            }

            out
        }

        fn format_constant_name(&self, s: &str) -> String {
            self.default.format_constant_name(s)
        }
    }

    fn fix_other_unit_variant(data_types: &mut DataTypes<'_>) -> bool {
        let mut found_other_variant = false;
        for (_, item) in &mut data_types.items {
            match &mut item.variant {
                DataTypeVariant::Enumeration(enumeration_data) => {
                    // Check if there is an 'other' variant in this enum
                    // The 'other' variant needs to be placed at the end of the variant list
                    let mut variants: Vec<_> =
                        std::mem::replace(&mut enumeration_data.variants, vec![]);

                    if let Some(other_variant_idx) =
                        variants.iter().position(|v| v.meta.type_.is_some())
                    {
                        let other_variant = variants.remove(other_variant_idx);
                        variants.push(other_variant);

                        // To support this type of enum we need to use a different serde derive
                        // The standard derive doesn't support putting the rest of the string into the 'other' variant
                        item.derive = xsd_parser::models::data::ConfigValue::Overwrite(vec![
                            IdentPath::from_ident(proc_macro2::Ident::new(
                                "Debug",
                                proc_macro2::Span::call_site(),
                            )),
                            IdentPath::from_ident(proc_macro2::Ident::new(
                                "Deserialize_enum_str",
                                proc_macro2::Span::call_site(),
                            )),
                        ]);

                        // We are using a custom derive, we must include it
                        found_other_variant = true;
                    }

                    enumeration_data.variants = variants;
                }
                _ => {}
            }
        }

        found_other_variant
    }

    #[derive(Debug, Clone)]
    struct XtceRenderAddOtherUsingsConfig;

    impl RenderStepConfig for XtceRenderAddOtherUsingsConfig {
        fn boxed_clone(&self) -> Box<dyn RenderStepConfig> {
            Box::new(self.clone())
        }

        fn into_render_step(self: Box<Self>) -> Box<dyn xsd_parser::RenderStep> {
            Box::new(XtceRenderAddOtherUsings)
        }
    }

    #[derive(Debug)]
    struct XtceRenderAddOtherUsings;

    impl xsd_parser::pipeline::renderer::RenderStep for XtceRenderAddOtherUsings {
        fn render_step_type(&self) -> xsd_parser::pipeline::renderer::RenderStepType {
            xsd_parser::pipeline::renderer::RenderStepType::ExtraImpls
        }

        fn render_type(&mut self, ctx: &mut xsd_parser::pipeline::renderer::Context<'_, '_>) {
            if let DataTypeVariant::Enumeration(enumeration_data) = &ctx.data.variant {
                // Check if there is an 'other' variant in this enum
                // We need to add a using statement for their traits
                if let Some(_) = enumeration_data
                    .variants
                    .iter()
                    .find(|v| v.meta.type_.is_some())
                {
                    ctx.add_usings(vec![
                        "serde_enum_str::Deserialize_enum_str",
                    ]);
                }
            }
        }
    }
}
