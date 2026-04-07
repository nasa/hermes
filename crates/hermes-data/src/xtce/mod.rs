/// XTCE (XML Telemetric and Command Exchange) loading and conversion module
///
/// This module handles the multi-pass loading of XTCE XML into hermes_data structures.
/// The loading process follows these passes:
///
/// 1. Collection: Traverse SpaceSystem tree and collect all items
/// 2. Resolution: Resolve name references with upward search semantics
/// 3. Construction: Build data structures in dependency order
/// 4. Conversion: Convert XTCE XML types to internal representations
mod collection;
mod construction;
mod container;
mod conversion;
mod resolution;
mod types;
mod utils;

// Re-export public types and functions
pub(crate) use collection::{
    collect_containers, collect_parameter_types, collect_parameters, UnresolvedContainer,
};
pub(crate) use construction::{
    build_dependency_graph, construct_containers, construct_parameter_types_pass1,
    construct_parameter_types_pass2_aggregates, construct_parameter_types_pass3_binary_array,
    construct_parameters, construct_remaining_parameters,
};
pub(crate) use conversion::convert_integer_value;
pub(crate) use resolution::{
    resolve_container_reference, resolve_parameter_ref, resolve_parameter_type_name,
};
