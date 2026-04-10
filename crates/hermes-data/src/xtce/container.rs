use crate::de::{
    ContainerRef, EntryKind, EntryType, LocationInContainerInBits, ReferenceLocation, Repeat,
};
use crate::Parameter;

use crate::{Error, IntegerValue, ParameterInstanceRef, ParameterRef};

use std::sync::Arc;

fn convert_location_in_bits(
    loc: Option<hermes_xtce::LocationInContainerInBitsType>,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, Arc<Parameter>>,
) -> crate::Result<LocationInContainerInBits> {
    Ok(loc
        .as_ref()
        .map(|l| convert_location_in_container_in_bits(l, space_system_path, parameters))
        .transpose()?
        .unwrap_or_else(|| LocationInContainerInBits {
            reference: ReferenceLocation::PreviousEntry,
            location: IntegerValue::FixedValue(0),
        }))
}

pub(crate) fn convert_entry(
    xml: hermes_xtce::EntryListType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, Arc<Parameter>>,
    containers: &std::collections::HashMap<String, crate::xtce::UnresolvedContainer>,
) -> crate::Result<EntryType> {
    use hermes_xtce::EntryListType as X;

    match xml {
        X::ParameterRefEntry(param_entry) => {
            let repeat = param_entry
                .repeat_entry
                .as_ref()
                .map(|r| convert_repeat(r, space_system_path, parameters))
                .transpose()?;

            // if param_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if param_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            // Resolve parameter ref to fully qualified name
            let (resolved_param_ref, member_path) = crate::xtce::resolve_parameter_ref(
                space_system_path,
                &param_entry.parameter_ref,
                parameters,
            )?;

            // Entry parameter refs should not have member paths
            if member_path.is_some() {
                return Err(Error::InvalidXtce(format!(
                    "Parameter entry '{}' contains member path, which is not supported in container entries",
                    param_entry.parameter_ref
                )));
            }

            Ok(EntryType {
                kind: EntryKind::ParameterRefEntry(ParameterRef {
                    name: resolved_param_ref,
                    member_path: None,
                }),
                repeat,
                include_condition: param_entry.include_condition.clone(),
                location: convert_location_in_bits(
                    param_entry.location_in_container_in_bits,
                    space_system_path,
                    parameters,
                )?,
            })
        }
        X::ContainerRefEntry(container_entry) => {
            let repeat = container_entry
                .repeat_entry
                .as_ref()
                .map(|r| convert_repeat(r, space_system_path, parameters))
                .transpose()?;

            // if container_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if container_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            // Resolve container reference to fully qualified name
            let resolved_container_ref = crate::xtce::resolve_container_reference(
                space_system_path,
                &container_entry.container_ref,
                containers,
            )?;

            Ok(EntryType {
                kind: EntryKind::ContainerRefEntry(ContainerRef(resolved_container_ref)),
                repeat,
                include_condition: container_entry.include_condition.clone(),
                location: convert_location_in_bits(
                    container_entry.location_in_container_in_bits,
                    space_system_path,
                    parameters,
                )?,
            })
        }
        X::ParameterSegmentRefEntry(_) => Err(Error::NotImplemented("ParameterSegmentRefEntry")),
        X::ContainerSegmentRefEntry(_) => Err(Error::NotImplemented("ContainerSegmentRefEntry")),
        X::StreamSegmentEntry(_) => Err(Error::NotImplemented("StreamSegmentEntry")),
        X::IndirectParameterRefEntry(_) => Err(Error::NotImplemented("IndirectParameterRefEntry")),
        X::ArrayParameterRefEntry(_) => Err(Error::NotImplemented("ArrayParameterRefEntry")),
    }
}

fn convert_location_in_container_in_bits(
    xml: &hermes_xtce::LocationInContainerInBitsType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, Arc<Parameter>>,
) -> crate::Result<LocationInContainerInBits> {
    use hermes_xtce::{LocationInContainerInBitsTypeContent as C, ReferenceLocationType as R};

    let reference = match xml.reference_location {
        R::ContainerStart => ReferenceLocation::ContainerStart,
        R::PreviousEntry => ReferenceLocation::PreviousEntry,
        R::ContainerEnd => {
            return Err(Error::NotImplemented("ReferenceLocation::ContainerEnd"));
        }
        R::NextEntry => {
            return Err(Error::NotImplemented("ReferenceLocation::NextEntry"));
        }
    };

    let location = match &xml.content {
        C::FixedValue(val) => IntegerValue::FixedValue(*val),
        C::DynamicValue(dyn_val) => {
            // Resolve the parameter reference to fully qualified name
            let (resolved_param_ref, member_path) = crate::xtce::resolve_parameter_ref(
                space_system_path,
                &dyn_val.parameter_instance_ref.parameter_ref,
                parameters,
            )?;

            let parameter = ParameterInstanceRef {
                parameter: ParameterRef {
                    name: resolved_param_ref,
                    member_path,
                },
                use_calibrated_value: dyn_val.parameter_instance_ref.use_calibrated_value,
            };
            let linear_adjustment =
                dyn_val
                    .linear_adjustment
                    .as_ref()
                    .map(|adj| crate::LinearAdjustment {
                        slope: adj.slope,
                        intercept: adj.intercept,
                    });

            IntegerValue::DynamicValueParameter {
                ref_: parameter,
                linear_adjustment,
            }
        }
        C::DiscreteLookupList(_) => {
            return Err(Error::NotImplemented(
                "DiscreteLookupList in LocationInContainerInBits",
            ));
        }
    };

    Ok(LocationInContainerInBits {
        reference,
        location,
    })
}

fn convert_repeat(
    xml: &hermes_xtce::RepeatType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, Arc<Parameter>>,
) -> crate::Result<Repeat> {
    let count = crate::xtce::convert_integer_value(&xml.count, space_system_path, parameters)?;
    let offset = xml
        .offset
        .as_ref()
        .map(|iv| crate::xtce::convert_integer_value(iv, space_system_path, parameters))
        .transpose()?
        .unwrap_or(IntegerValue::FixedValue(0));

    Ok(Repeat { count, offset })
}
