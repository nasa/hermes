use crate::ui::SelectedBits;
use ratatui::buffer::Buffer;
use ratatui::layout::{Rect, Size};
use ratatui::prelude::{Color, StatefulWidget, Style};
use std::cmp::min;
use tui_scrollview::{ScrollView, ScrollViewState};

pub struct DataWidget<'a>(DataWidgetInner<'a>);

#[derive(Default)]
pub struct DataWidgetState {
    pub scrollbar_state: ScrollViewState,
    pub selected_bits: Option<SelectedBits>,
}

struct DataWidgetInner<'a>(&'a [u8]);

impl DataWidget<'_> {
    pub fn new(data: &'_ [u8]) -> DataWidget<'_> {
        DataWidget(DataWidgetInner(data))
    }

    fn line_width(n_bytes: u16) -> u16 {
        let address_offset = 4;
        let colon = 2; // ": "
        let data_chars = n_bytes * 2; // two hex digits per byte
        let data_delim = n_bytes / 2 - 1; // group together by two byte sets

        address_offset + colon + data_chars + data_delim
    }
}

impl<'a> StatefulWidget for DataWidget<'a> {
    type State = DataWidgetState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State)
    where
        Self: Sized,
    {
        // Either render 16-bytes per line, or 8-bytes per line
        // This is determined by the width of the rect
        let per_line: usize = if DataWidget::line_width(16) > area.width {
            8
        } else {
            16
        };

        let column_n = DataWidget::line_width(per_line as u16);
        let line_n = min(self.0.0.len() / per_line + 1, area.height as usize);

        let content_size = Size::new(column_n, line_n as u16);
        let mut scroll_view = ScrollView::new(content_size);

        scroll_view.render_stateful_widget(
            self.0,
            Rect::new(0, 0, column_n, line_n as u16),
            &mut state.selected_bits,
        );

        scroll_view.render(area, buf, &mut state.scrollbar_state)
    }
}

impl<'a> StatefulWidget for DataWidgetInner<'a> {
    type State = Option<SelectedBits>;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        let per_line: usize = if DataWidget::line_width(16) > area.width {
            8
        } else {
            16
        };

        for line_no in 0..area.height as usize {
            let offset = line_no * per_line;
            let y = area.y + line_no as u16;

            let line = &self.0[offset..min(offset + per_line, self.0.len())];

            buf.set_string(
                area.x,
                y,
                format!("{:04x}", offset),
                Style::default().fg(Color::DarkGray),
            );

            buf.set_string(area.x + 4, y, ":", Style::default());

            let mut x = area.x + 6;
            let line_bit_start = line_no * per_line * 8;

            for (i, b) in line.iter().enumerate() {
                let style = if let Some(selected_bits) = state {
                    let start_bit = line_bit_start + i * 8;
                    let end_bit = line_bit_start + (i + 1) * 8;

                    if start_bit >= selected_bits.start_bit && end_bit <= selected_bits.end_bit {
                        // This byte is a full subset of the selected region
                        Style::default().fg(Color::White).bg(Color::LightMagenta)
                    } else if start_bit < selected_bits.end_bit && selected_bits.start_bit < end_bit
                    {
                        // There is _some_ overlap
                        Style::default().fg(Color::White).bg(Color::Magenta)
                    } else {
                        Style::default()
                    }
                } else {
                    Style::default()
                };

                if i % 2 == 0 {
                    buf.set_string(x, y, " ", Style::default());
                    x += 1;
                }

                buf.set_string(x, y, format!("{:02x}", b), style);
                x += 2;
            }
        }
    }
}
