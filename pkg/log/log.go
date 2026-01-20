package log

import (
	"context"
	"io"
	"log/slog"
	"os"
	"runtime"
	"time"

	"go.opentelemetry.io/contrib/bridges/otelslog"
)

type Lvl int

const (
	LvlCrit Lvl = iota
	LvlError
	LvlWarn
	LvlInfo
	LvlDebug
)

var (
	// _ Logger       = (*concreteLogger)(nil)
	_ slog.Handler = (*combinedHandler)(nil)
	_ slog.Leveler = consoleLeveler{}

	// Global settings that should be set by the running context (CLI)
	ConsoleWriter io.Writer  = os.Stderr
	ConsoleLevel  slog.Level = slog.LevelInfo
	ConsoleColor  bool       = true
)

type Logger interface {
	// Debug logs a message with debug level and key/value pairs, if any.
	Debug(msg string, args ...any)

	// Info logs a message with info level and key/value pairs, if any.
	Info(msg string, args ...any)

	// Warn logs a message with warning level and key/value pairs, if any.
	Warn(msg string, args ...any)

	// Error logs a message with error level and key/value pairs, if any.
	Error(msg string, args ...any)

	// Adds additional key-value pairs to the logger
	With(attrs ...any) Logger

	// WithContext returns a new contextual Logger that has this logger's context plus the given context.
	WithContext(ctx context.Context) Logger

	Context() context.Context

	WithGroup(name string) Logger
}

type ctxLogger struct {
	*slog.Logger
	ctx context.Context
}

func (l *ctxLogger) Debug(msg string, args ...any) {
	l.Logger.DebugContext(l.ctx, msg, args...)
}

func (l *ctxLogger) Info(msg string, args ...any) {
	l.Logger.InfoContext(l.ctx, msg, args...)
}

func (l *ctxLogger) Warn(msg string, args ...any) {
	l.Logger.WarnContext(l.ctx, msg, args...)
}

func (l *ctxLogger) Error(msg string, args ...any) {
	l.Logger.ErrorContext(l.ctx, msg, args...)
}

func (l *ctxLogger) With(attr ...any) Logger {
	return &ctxLogger{
		Logger: l.Logger.With(attr...),
		ctx:    l.ctx,
	}
}

func (l *ctxLogger) WithContext(ctx context.Context) Logger {
	return &ctxLogger{
		Logger: l.Logger,
		ctx:    ctx,
	}
}

func (l *ctxLogger) Context() context.Context {
	return l.ctx
}

func (l *ctxLogger) WithGroup(name string) Logger {
	return &ctxLogger{
		Logger: l.Logger.WithGroup(name),
		ctx:    l.ctx,
	}
}

// type concreteLogger struct{ *slog.Logger }
type consoleLeveler struct{}

func (consoleLeveler) Level() slog.Level {
	return ConsoleLevel
}

type combinedHandler struct {
	otelHandler    slog.Handler
	consoleHandler slog.Handler
}

// Enabled implements slog.Handler.
func (c *combinedHandler) Enabled(ctx context.Context, lvl slog.Level) bool {
	return c.otelHandler.Enabled(ctx, lvl) || c.consoleHandler.Enabled(ctx, lvl)
}

// Handle implements slog.Handler.
func (c *combinedHandler) Handle(ctx context.Context, record slog.Record) error {
	pc, _, _, _ := runtime.Caller(4)
	pkg := funcNameToPkg(runtime.FuncForPC(pc).Name())
	record.AddAttrs(slog.String("pkg", pkg))

	if c.consoleHandler.Enabled(ctx, record.Level) {
		if err := c.consoleHandler.Handle(ctx, record); err != nil {
			return err
		}
	}

	if c.otelHandler.Enabled(ctx, record.Level) {
		return c.otelHandler.Handle(ctx, record)
	}

	return nil
}

// WithAttrs implements slog.Handler.
func (c *combinedHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &combinedHandler{
		otelHandler:    c.otelHandler.WithAttrs(attrs),
		consoleHandler: c.consoleHandler.WithAttrs(attrs),
	}
}

// WithGroup implements slog.Handler.
func (c *combinedHandler) WithGroup(name string) slog.Handler {
	return &combinedHandler{
		otelHandler:    c.otelHandler.WithGroup(name),
		consoleHandler: c.consoleHandler.WithGroup(name),
	}
}

func GetLogger(ctx context.Context) Logger {
	if ctx == nil {
		ctx = context.Background()
	}

	parentPkg := getCallerPackage()

	return &ctxLogger{
		Logger: slog.New(&combinedHandler{
			otelHandler: otelslog.NewHandler(parentPkg),
			consoleHandler: newConsoleHandler(
				ConsoleWriter, &options{
					Level:      consoleLeveler{},
					TimeFormat: time.RFC3339,
					NoColor:    !ConsoleColor,
				},
			),
		}),

		ctx: ctx,
	}
}
