use crate::widgets::StructureWidgetState;
use hermes_data::Value;
use hermes_data::de::Packet;
use ratatui::widgets::ListState;
use std::collections::HashMap;
use std::sync::mpsc::{Receiver, TryRecvError};

#[derive(Debug, Eq, PartialEq)]
pub enum Tab {
    Packets,
    Structure,
    Data,
}

pub struct App {
    in_queue: Receiver<Packet>,

    pub packets: Vec<Packet>,
    pub parameters: HashMap<String, Value>,

    pub selected_packet: ListState,
    pub follow_latest: bool,
    pub should_quit: bool,
    pub structure_state: StructureWidgetState,
    pub current_tab: Tab,
}

impl App {
    pub fn new(in_queue: Receiver<Packet>) -> Self {
        Self {
            in_queue,
            parameters: Default::default(),
            packets: Default::default(),
            selected_packet: Default::default(),
            follow_latest: true,
            should_quit: false,
            structure_state: Default::default(),
            current_tab: Tab::Packets,
        }
    }

    pub fn on_left(&mut self) {
        self.current_tab = match self.current_tab {
            Tab::Packets => {
                self.follow_latest = false;
                Tab::Data
            }
            Tab::Structure => Tab::Packets,
            Tab::Data => Tab::Structure,
        }
    }

    pub fn on_right(&mut self) {
        self.current_tab = match self.current_tab {
            Tab::Packets => {
                self.follow_latest = false;
                Tab::Structure
            }
            Tab::Structure => Tab::Data,
            Tab::Data => Tab::Packets,
        }
    }

    pub fn on_down(&mut self) {
        match self.current_tab {
            Tab::Packets => {
                self.follow_latest = false;
                self.selected_packet.select_next();
            }
            Tab::Structure => {
                self.structure_state.list_state.select_next();
            }
            Tab::Data => {}
        }
    }

    pub fn on_up(&mut self) {
        match self.current_tab {
            Tab::Packets => {
                self.follow_latest = false;
                self.selected_packet.select_previous();
            }
            Tab::Structure => {
                self.structure_state.list_state.select_previous();
            }
            Tab::Data => {}
        }
    }

    pub fn on_key(&mut self, c: char) {
        if c == 'q' {
            self.should_quit = true;
        }

        if c == 'f' {
            self.follow_latest = !self.follow_latest;
            if self.follow_latest {
                self.selected_packet.select(Some(0))
            }
        }
    }

    pub fn on_prev_tab(&mut self) {}

    pub fn on_next_tab(&mut self) {}

    pub fn on_tick(&mut self) {
        // Pull in packets off the queue
        let processed_packets = self.packets.len();
        loop {
            let packet = match self.in_queue.try_recv() {
                Ok(v) => v,
                Err(TryRecvError::Empty) => break,
                Err(TryRecvError::Disconnected) => {
                    self.should_quit = true;
                    return;
                }
            };

            self.packets.push(packet);
        }

        if self.follow_latest && self.packets.len() > 0 {
            self.selected_packet.select(Some(self.packets.len() - 1));
        }

        // Update the telemetry table with the latest channel values
        for packet in &self.packets[processed_packets..] {
            for (name, params) in &packet.parameters {
                for param in params {
                    if let Some(calibrated_value) = param.calibrated_value {
                        self.parameters
                            .insert(name.clone(), Value::Float(calibrated_value));
                    } else {
                        self.parameters
                            .insert(name.clone(), param.raw_value.clone());
                    }
                }
            }
        }
    }
}
