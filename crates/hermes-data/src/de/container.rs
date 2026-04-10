use crate::de::{Context, RestrictionCriteria};
use crate::{IntegerValue, Item, ParameterInstanceRef, ParameterRef, Value};
use std::sync::Arc;
use tracing::warn;

#[derive(Clone, Debug)]
pub enum ParameterRefOrValue {
    ParameterInstanceRef(ParameterInstanceRef),
    Value(Value),
}

#[derive(Clone, Debug)]
pub enum ReferenceLocation {
    ContainerStart,
    PreviousEntry,
}

#[derive(Clone, Debug)]
pub struct LocationInContainerInBits {
    ///Defines the relative reference used to interpret the start bit position.  The default is 0 bits from the end of the previousEntry, which makes the entry contiguous.
    pub reference: ReferenceLocation,
    pub location: IntegerValue,
}

///Contains elements that describe how an Entry is identically repeated. This includes a Count of the number of appearances and an optional Offset in bits that may occur between appearances. A Count of 1 indicates no repetition. The Offset default is 0 when not specified.
#[derive(Clone, Debug)]
pub struct Repeat {
    ///Value (either fixed or dynamic) that contains the count of appearances for an Entry. The value must be positive where 1 is the same as not specifying a RepeatEntry element at all.
    pub count: IntegerValue,

    ///Value (either fixed or dynamic) that contains an optional offset in bits between repeats of the Entry. The default is 0, which is contiguous. The value must be 0 or positive. Empty offset after the last repeat count is not implicitly reserved, so the parent EntryList should consider if these are occupied bits when placing the next Entry.
    pub offset: IntegerValue,
}

#[derive(Clone, Debug)]
pub struct EntryType {
    pub kind: EntryKind,
    pub repeat: Option<Repeat>,
    pub include_condition: Option<hermes_xtce::MatchCriteriaType>,
    pub location: LocationInContainerInBits,
}

#[derive(Clone, Debug)]
pub enum EntryKind {
    ///Specify a Parameter to be a part of this container layout definition.
    ParameterRefEntry(ParameterRef),
    ///Specify the content of another Container to be a part of this container layout definition.
    ContainerRefEntry(ContainerRef),
}

#[derive(Clone, Debug)]
pub struct ContainerRef(pub String);

#[derive(Clone, Debug)]
pub struct SequenceContainerType {
    pub head: Item,
    pub abstract_: bool,

    ///Number of bits this container occupies on the stream being encoded/decoded.  This is only needed to "force" the bit length of the container to be a fixed value.  In most cases, the entry list would define the size of the container.
    pub size_in_bits: Option<IntegerValue>,

    ///List of item entries to pack/encode into this container definition.
    pub entry_list: Vec<EntryType>,

    /// References to child sequence containers
    pub children: Vec<(RestrictionCriteria, Arc<SequenceContainerType>)>,
}

impl EntryType {
    fn deserialize_once(&self, ctx: &mut Context) -> crate::Result<()> {
        match &self.kind {
            EntryKind::ParameterRefEntry(r) => {
                let prm = ctx.db.telemetry_parameters.get(&r.name).unwrap();

                ctx.start_parameter_entry();

                let raw_value = prm.type_.deserialize(ctx)?;

                let calibrated_value = match prm.type_.calibrate(&raw_value) {
                    Ok(v) => v,
                    Err(err) => {
                        warn!("Failed to calibrate parameter {}: {}", r.name, err);
                        None
                    }
                };

                ctx.finish_parameter_entry(raw_value, calibrated_value, prm.clone());

                Ok(())
            }
            EntryKind::ContainerRefEntry(r) => {
                let c = ctx.db.telemetry_containers.get(&r.0).unwrap();

                let parent = ctx.start_container_entry();
                let out = c.deserialize(ctx);
                ctx.finish_container_entry(parent, c.clone());
                out
            }
        }
    }

    fn deserialize(&self, ctx: &mut Context) -> crate::Result<()> {
        let start_location = (match &self.location.reference {
            ReferenceLocation::ContainerStart => 0,
            ReferenceLocation::PreviousEntry => ctx.get_position(),
        }) + (self.location.location.get(ctx)? as usize);

        ctx.set_position(start_location);

        if let Some(repeat) = &self.repeat {
            let count = repeat.count.get(ctx)?;
            for _ in 0..count {
                self.deserialize_once(ctx)?;
                ctx.set_position(ctx.get_position() + repeat.offset.get(ctx)? as usize);
            }

            Ok(())
        } else {
            self.deserialize_once(ctx)
        }
    }
}

impl SequenceContainerType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> crate::Result<()> {
        for entry in &self.entry_list {
            entry.deserialize(ctx)?;
        }

        if self.abstract_ {
            // This is not a real container
            // Look for a child container that fits the match criteria
            for (rc, child) in &self.children {
                if rc.evaluate(ctx) {
                    let parent = ctx.start_container_entry();

                    child.deserialize(ctx)?;

                    ctx.finish_container_entry(parent, child.clone());
                    break;
                }
            }
        } else {
        }

        Ok(())
    }
}
