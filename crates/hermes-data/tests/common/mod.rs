use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use tracing::Level;
use tracing_subscriber::layer::SubscriberExt;

/// A guard that tracks warnings during a test and asserts none were emitted when dropped
pub struct NoWarningsGuard {
    warning_count: Arc<AtomicUsize>,
    _subscriber_guard: tracing::subscriber::DefaultGuard,
}

impl NoWarningsGuard {
    /// Assert that no warnings have been emitted so far
    pub fn assert_no_warnings(&self) {
        let count = self.warning_count.load(Ordering::Relaxed);
        assert_eq!(
            count, 0,
            "Expected no warnings during test, but {} warning(s) were emitted",
            count
        );
    }
}

impl Drop for NoWarningsGuard {
    fn drop(&mut self) {
        // Only assert if we're not already panicking
        if !std::thread::panicking() {
            self.assert_no_warnings();
        }
    }
}

/// A custom layer that counts warnings
struct WarningCounterLayer {
    counter: Arc<AtomicUsize>,
}

impl<S> tracing_subscriber::Layer<S> for WarningCounterLayer
where
    S: tracing::Subscriber,
{
    fn on_event(
        &self,
        event: &tracing::Event<'_>,
        _ctx: tracing_subscriber::layer::Context<'_, S>,
    ) {
        if *event.metadata().level() == Level::WARN {
            self.counter.fetch_add(1, Ordering::Relaxed);
        }
    }
}

/// Sets up a tracing subscriber that counts warnings and returns a guard
/// that will assert no warnings were emitted when dropped.
///
/// # Example
/// ```
/// let _guard = assert_no_warnings();
/// // ... test code that should not emit warnings ...
/// // Guard automatically checks on drop
/// ```
pub fn assert_no_warnings() -> NoWarningsGuard {
    let warning_count = Arc::new(AtomicUsize::new(0));

    let counter_layer = WarningCounterLayer {
        counter: warning_count.clone(),
    };

    let fmt_layer = tracing_subscriber::fmt::layer()
        .with_test_writer()
        .with_target(false);

    let subscriber = tracing_subscriber::registry()
        .with(counter_layer)
        .with(fmt_layer);

    // Set as default for this test and keep the guard
    let guard = tracing::subscriber::set_default(subscriber);

    NoWarningsGuard {
        warning_count,
        _subscriber_guard: guard,
    }
}
