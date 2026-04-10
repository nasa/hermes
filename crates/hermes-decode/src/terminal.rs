use crate::app::App;
use crate::ui;
use anyhow::Result;
use hermes_data::de::Packet;
use ratatui::backend::{Backend, CrosstermBackend};
use ratatui::crossterm::event::{KeyCode, KeyModifiers};
use ratatui::crossterm::terminal::{
    disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen,
};
use ratatui::crossterm::{event, execute};
use ratatui::Terminal;
use std::error::Error;
use std::sync::mpsc::Receiver;
use std::time::{Duration, Instant};
use std::{io, panic};

pub fn run(packets: Receiver<Packet>) -> Result<()> {
    // setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let default_panic_hook = panic::take_hook();
    panic::set_hook(Box::new(move |panic_info| {
        // Restore terminal state before printing the panic message
        let mut stdout = io::stdout();
        execute!(stdout, LeaveAlternateScreen).unwrap();
        disable_raw_mode().unwrap();

        // Call the default hook to print the standard panic message/stack trace
        default_panic_hook(panic_info);
    }));

    // create app and run it
    let app = App::new(packets);
    let app_result = run_app(&mut terminal, app);

    // restore terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;

    if let Err(err) = app_result {
        println!("{err:?}");
    }

    Ok(())
}

fn run_app<B: Backend>(terminal: &mut Terminal<B>, mut app: App) -> Result<(), Box<dyn Error>>
where
    B::Error: 'static,
{
    let tick_rate = Duration::from_millis(250);
    let mut last_tick = Instant::now();
    loop {
        terminal.draw(|frame| ui::render(frame, &mut app))?;

        let timeout = tick_rate.saturating_sub(last_tick.elapsed());
        if !event::poll(timeout)? {
            app.on_tick();
            last_tick = Instant::now();
            continue;
        }
        if let Some(key) = event::read()?.as_key_press_event() {
            match key.code {
                KeyCode::Char('h') | KeyCode::Left => app.on_left(),
                KeyCode::Char('j') | KeyCode::Down => app.on_down(),
                KeyCode::Char('k') | KeyCode::Up => app.on_up(),
                KeyCode::Char('l') | KeyCode::Right => app.on_right(),
                KeyCode::Tab if key.modifiers.contains(KeyModifiers::SHIFT) => app.on_prev_tab(),
                KeyCode::Tab if !key.modifiers.contains(KeyModifiers::SHIFT) => app.on_next_tab(),
                KeyCode::Char(c) => app.on_key(c),
                _ => {}
            }
        }
        if app.should_quit {
            return Ok(());
        }
    }
}
