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
    use syn::__private::quote::quote;
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

                        if attr.is_option {
                            attr.extra_attributes.push(quote! {
                                serde(skip_serializing_if = "Option::is_none")
                            })
                        }
                        // if attr.ident == "base_type" {
                        //
                        //     eprintln!("{:?}", attr);
                        //     std::process::exit(1);
                        // }
                    }
                }
                _ => {}
            }
        }
    }

    /// Fix deserialization of enum content fields.
    ///
    /// When FLATTEN_ENUM_CONTENT is enabled, enums are generated without the wrapper
    /// struct pattern that quick-xml expects. This function adds custom deserialize_with
    /// attributes to struct fields that contain enum types, using the helpers from
    /// the serde_helpers module.
    // Note: This function is no longer used. We post-process the parsed files instead.
    // Keeping it here for reference.
    #[allow(dead_code)]
    fn _fix_enum_content_deserialization(_data_types: &mut DataTypes) {
        // This approach doesn't work because $value fields are not in the attributes collection
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

    /// Add deserialize_with and skip_serializing_if attributes to generated code.
    fn fix_enum_content_in_parsed_file(file: &mut syn::File) {
        use quote::ToTokens;
        use syn::visit_mut::{self, VisitMut};
        use syn::{Field, ItemEnum, ItemStruct};
        use std::collections::HashSet;

        // XSD container types that require children when present
        const EMPTY_CONTAINER_TYPES: &[&str] = &[
            "AncillaryDataSetType",
            "ErrorDetectCorrectType",
            "CalibratorType",
            "ContextCalibratorListType",
            "ParameterSetType",
            "ContainerSetType",
            "MessageSetType",
            "StreamSetType",
            "AlgorithmSetType",
            "EnumerationListType",
            "RangeEnumerationType",
            "ArgumentAssignmentListType",
            "ArgumentListType",
            "MetaCommandStepListType",
            "ParameterToSetListType",
            "ParameterToSuspendAlarmsListType",
        ];

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

                if EMPTY_CONTAINER_TYPES.contains(&base_type) {
                    let already_has_skip = field.attrs.iter().any(|attr| {
                        if attr.path().is_ident("serde") {
                            let tokens = attr.meta.to_token_stream().to_string();
                            tokens.contains("skip_serializing_if")
                        } else {
                            false
                        }
                    });

                    if !already_has_skip {
                        let skip_condition = if base_type == "CalibratorType" && is_option {
                            "crate::serde_helpers::is_empty_calibrator"
                        } else if is_option {
                            "Option::is_none"
                        } else if is_vec {
                            "Vec::is_empty"
                        } else {
                            return;
                        };

                        let attr: syn::Attribute = syn::parse_quote! {
                            #[serde(skip_serializing_if = #skip_condition)]
                        };
                        field.attrs.push(attr);
                    }
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
                            IdentPath::from_ident(proc_macro2::Ident::new(
                                "Serialize_enum_str",
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
                        "serde_enum_str::Serialize_enum_str",
                    ]);
                }
            }
        }
    }
}
