use crate::deserialize::Context;
use crate::{EntryKind, EntryType, ReferenceLocation, SequenceContainerType};
use tracing::warn;

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
                    ctx.set_packet_name(child.head.name.clone());
                    break;
                }
            }
        } else {
        }

        Ok(())
    }
}
