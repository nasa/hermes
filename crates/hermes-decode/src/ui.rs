use crate::app::{App, Tab};
use hermes_data::de::Packet;
use ratatui::Frame;
use ratatui::layout::*;
use ratatui::prelude::Style;
use ratatui::style::Color;
use ratatui::text::{Line, Span, Text};
use ratatui::widgets::*;
use std::time::Instant;

use crate::widgets;
use crate::widgets::{DataWidgetState, StructureWidget};

struct Renderer {
    packet_list: Rect,
    raw: Rect,
    parameters: Rect,
}

fn style_tab_name(selected: bool) -> Style {
    Style::default()
        .bg(if selected { Color::White } else { Color::Reset })
        .fg(if selected { Color::Black } else { Color::Reset })
}

pub fn render(frame: &mut Frame, app: &mut App) {
    let horizontal = Layout::default()
        .direction(Direction::Horizontal)
        .constraints(vec![
            Constraint::Max(40),
            Constraint::Fill(1),
            Constraint::Fill(1),
        ])
        .split(frame.area());

    let layout = Renderer {
        packet_list: horizontal[0],
        raw: horizontal[2],
        parameters: horizontal[1],
    };

    let now = Instant::now();

    frame.render_stateful_widget(
        packet_list(&app.packets, app, now),
        layout.packet_list,
        &mut app.selected_packet,
    );

    if let Some(packet) = app
        .selected_packet
        .selected()
        .map(|index| app.packets.get(index))
        .flatten()
    {
        let structure_block = Block::bordered()
            .title(Line::styled(
                " Packet Structure ",
                style_tab_name(app.current_tab == Tab::Structure),
            ))
            .padding(Padding::horizontal(1));

        frame.render_stateful_widget(
            StructureWidget::new(&packet.root),
            structure_block.inner(layout.parameters),
            &mut app.structure_state,
        );

        frame.render_widget(structure_block, layout.parameters);

        let raw_block = Block::bordered()
            .title(Line::styled(
                " Packet Data ",
                style_tab_name(app.current_tab == Tab::Data),
            ))
            .padding(Padding::horizontal(2));

        let mut dws = DataWidgetState {
            scrollbar_state: Default::default(),
            selected_bits: app.structure_state.selected_bits.clone(),
        };

        frame.render_stateful_widget(
            widgets::DataWidget::new(&packet.raw),
            raw_block.inner(layout.raw),
            &mut dws,
        );

        frame.render_widget(raw_block, layout.raw);
    } else {
        frame.render_widget(
            Paragraph::new("Waiting for packet...").block(Block::new().borders(Borders::ALL)),
            layout.raw,
        );
    }
}

#[derive(Debug, Clone)]
pub struct SelectedBits {
    pub start_bit: usize,
    pub end_bit: usize,
}

fn packet_list<'a>(packets: &'a Vec<Packet>, app: &App, now: Instant) -> List<'a> {
    List::new(packets.iter().map(|packet| packet_list_item(packet, now)))
        .block(
            Block::bordered()
                .title(
                    Line::from(" Packets ")
                        .left_aligned()
                        .style(style_tab_name(app.current_tab == Tab::Packets)),
                )
                .title(
                    Line::from(vec![
                        if app.follow_latest {
                            Span::raw(" * ")
                        } else {
                            Span::raw("   ")
                        },
                        Span::raw("Latest "),
                    ])
                    .right_aligned(),
                ),
        )
        .highlight_style(Style::new().reversed())
        .highlight_symbol("* ")
        .repeat_highlight_symbol(true)
}

fn packet_list_item(packet: &'_ Packet, now: Instant) -> ListItem<'_> {
    let age = now - packet.ert;

    ListItem::new(Text::from(vec![
        Line::from(vec![
            Span::raw(packet.name.clone()),
            Span::raw("    "),
            Span::styled(
                format!("{}s ago", age.as_secs()),
                Style::default().fg(Color::DarkGray),
            ),
        ]),
        Line::from(vec![
            Span::raw(format!(
                "{} parameters",
                packet.parameters.iter().map(|s| s.1.len()).sum::<usize>()
            )),
            Span::raw("    "),
            Span::raw(format!("{} bytes", packet.raw.len())),
        ]),
    ]))
}
