use crate::ui::SelectedBits;
use hermes_data::de::{Entry, ParameterValue, SequenceContainer};
use hermes_data::{FloatSize, Type};
use ratatui::buffer::Buffer;
use ratatui::layout::Rect;
use ratatui::prelude::{Color, Line, Span, StatefulWidget, Style, Text};
use ratatui::widgets::{List, ListState};
use std::sync::Arc;

pub struct StructureWidget<'a> {
    root: &'a Arc<SequenceContainer>,
}

#[derive(Default)]
pub struct StructureWidgetState {
    // scrollbar_state: ScrollbarState,
    pub list_state: ListState,
    pub selected_bits: Option<SelectedBits>,
}

enum StructureEntry {
    Container {
        depth: u16,
        namespace: String,
        name: String,
        start_bit: usize,
        end_bit: usize,
    },
    Parameter {
        depth: u16,
        namespace: String,
        name: String,
        type_name: String,
        value: String,
        start_bit: usize,
        end_bit: usize,
    },
}

impl StructureEntry {
    fn bits(&self) -> SelectedBits {
        match self {
            StructureEntry::Container {
                start_bit, end_bit, ..
            } => SelectedBits {
                start_bit: *start_bit,
                end_bit: *end_bit,
            },
            StructureEntry::Parameter {
                start_bit, end_bit, ..
            } => SelectedBits {
                start_bit: *start_bit,
                end_bit: *end_bit,
            },
        }
    }

    // fn len(&self) -> usize {
    //     match self {
    //         StructureEntry::Container { .. } => 1,
    //         StructureEntry::Parameter { .. } => 2,
    //     }
    // }
}

enum DepthSpan {
    Container(u16),
    Parameter(u16),
    ParameterContinue(u16),
}

impl<'a> From<DepthSpan> for Span<'a> {
    fn from(other: DepthSpan) -> Span<'a> {
        match other {
            DepthSpan::Container(depth) => Span::raw(" ".repeat(depth as usize) + "┌"),
            DepthSpan::Parameter(depth) => Span::raw(" ".repeat(depth as usize) + "├ "),
            DepthSpan::ParameterContinue(depth) => Span::raw(" ".repeat(depth as usize) + "│   "),
        }
    }
}

impl<'a> From<StructureEntry> for Text<'a> {
    fn from(other: StructureEntry) -> Text<'a> {
        match other {
            StructureEntry::Container {
                namespace,
                name,
                depth,
                ..
            } => Line::from(vec![
                DepthSpan::Container(depth).into(),
                Span::styled(namespace, Style::default().fg(Color::DarkGray)),
                Span::styled(name, Style::default().bold()),
                Span::styled(": ", Style::default().fg(Color::DarkGray).italic()),
            ])
            .into(),
            StructureEntry::Parameter {
                namespace,
                name,
                type_name,
                value,
                depth,
                ..
            } => Text::from(vec![
                Line::from(vec![
                    DepthSpan::Parameter(depth).into(),
                    Span::styled(namespace, Style::default().fg(Color::DarkGray)),
                    Span::styled(name, Style::default().bold()),
                    Span::styled(": ", Style::default().fg(Color::DarkGray).italic()),
                    Span::styled(type_name, Style::default().fg(Color::DarkGray).italic()),
                ]),
                Line::from(vec![
                    DepthSpan::ParameterContinue(depth).into(),
                    Span::raw(value),
                ]),
            ]),
        }
    }
}

fn namespace_of(s: &str) -> &str {
    let second_slash = s[1..].find('/').unwrap_or(0);
    let final_slash = s.rfind('/').unwrap_or(s.len() - 1);

    &s[second_slash + 1..final_slash + 1]
}

impl<'a> StructureWidget<'a> {
    pub fn new(root: &'a Arc<SequenceContainer>) -> Self {
        Self { root }
    }

    fn render_container(container: &Arc<SequenceContainer>, depth: u16) -> Vec<StructureEntry> {
        let qual_name = &container.container.head.qualified_name;
        let name = &container.container.head.name;
        let namespace = namespace_of(qual_name);

        let mut entries = Vec::new();
        entries.push(StructureEntry::Container {
            namespace: namespace.to_string(),
            name: name.clone(),
            depth,
            start_bit: container.start_bit,
            end_bit: container.end_bit,
        });

        for entry in &container.entries {
            match entry {
                Entry::Container(container) => {
                    entries.extend(StructureWidget::render_container(container, depth + 1))
                }
                Entry::Parameter(parameter) => {
                    entries.push(Self::render_parameter(parameter, depth));
                }
            }
        }

        entries
    }

    fn render_parameter(parameter: &Arc<ParameterValue>, depth: u16) -> StructureEntry {
        let qual_name = &parameter.parameter.head.qualified_name;
        let name = &parameter.parameter.head.name;
        let namespace = namespace_of(qual_name);

        let type_name = match parameter.parameter.type_.as_ref() {
            Type::Integer(ty) => {
                format!("{}{}", if ty.signed { "i" } else { "u" }, ty.size_in_bits)
            }
            Type::Float(ty) => match ty.size_in_bits {
                FloatSize::F32 => "f32",
                FloatSize::F64 => "f64",
            }
            .to_string(),
            Type::String(_) => {
                format!("str({})", parameter.end_bit - parameter.start_bit)
            }
            Type::Boolean(_) => {
                format!("bool({})", parameter.end_bit - parameter.start_bit)
            }
            Type::Binary(_) => {
                format!("binary({})", parameter.end_bit - parameter.start_bit)
            }
            Type::Enumerated(_) => "enum".to_string(),
            Type::AbsoluteTime(_) => "Absolute Time".to_string(),
            Type::RelativeTime(_) => "Relative Time".to_string(),
            Type::Array(_) => "Array".to_string(),
            Type::Aggregate(_) => "Aggregate".to_string(),
        };

        StructureEntry::Parameter {
            namespace: namespace.to_string(),
            name: name.clone(),
            type_name,
            value: format!("{}", parameter.raw_value),
            start_bit: parameter.start_bit,
            end_bit: parameter.end_bit,
            depth,
        }
    }
}

impl<'a> StatefulWidget for StructureWidget<'a> {
    type State = StructureWidgetState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        let out = Self::render_container(self.root, 0);

        if let Some(entry) = state.list_state.selected().and_then(|index| out.get(index)) {
            state.selected_bits = Some(entry.bits())
        } else {
            state.selected_bits = None
        }

        StatefulWidget::render(
            List::new(out).highlight_symbol("*"),
            area,
            buf,
            &mut state.list_state,
        );
    }
}
