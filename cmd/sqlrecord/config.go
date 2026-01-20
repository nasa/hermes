package main

import (
	"errors"
	"fmt"
	"os"

	flag "github.com/spf13/pflag"

	"github.com/nasa/hermes/pkg/client"
	"github.com/nasa/hermes/pkg/log"
)

type Driver int

const (
	DriverSQLite3 Driver = iota
	DriverTimeScale
)

type Config struct {
	Verbose       bool
	NoEvrs        bool
	NoTlm         bool
	Sqlite        string
	Postgresql    string
	Driver        Driver
	ExtraColumn   *ExtraColumn
	BufferSize    int
	BatchSize     int
	FlushInterval float64
}

func parse_config(log log.Logger) Config {
	helpMessage := `
	Record events and channelized telemetry from Hermes into a SQLite database
	` + client.EnvironmentHelp
	flag.ErrHelp = errors.New(helpMessage)
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, `Record events and channelized telemetry from Hermes into a SQLite database
Usage:
%s

`, os.Args[0])
		flag.PrintDefaults()
	}

	config := Config{
		Verbose:       false,
		NoEvrs:        false,
		NoTlm:         false,
		Sqlite:        "",
		Postgresql:    "",
		Driver:        DriverTimeScale,
		ExtraColumn:   nil,
		BufferSize:    2048,
		BatchSize:     1024,
		FlushInterval: 500.0,
	}

	flag.BoolVarP(&config.Verbose, "verbose", "v", config.Verbose, "Print debug logs to the console")
	flag.BoolVar(&config.NoEvrs, "disable-events", config.NoEvrs, "Disable event (EVR) logging to the database")
	flag.BoolVar(&config.NoTlm, "disable-telemetry", config.NoTlm, "Disable telemetry (EHA) logging to the database")
	flag.StringVar(&config.Sqlite, "sqlite", "", "Record telemetry to a sqlite3 database file")
	flag.StringVar(&config.Postgresql, "postgresql", "", "Record telemetry to a postgresql connection")
	extraColumnStr := flag.StringP("extra-column", "e", "", "Additional column with fixed value to include in database, in format [NAME] [TYPE] [VALUE]")
	flag.IntVarP(&config.BufferSize, "buffer-size", "b", config.BufferSize, "Size of the input buffer cache")
	flag.IntVarP(&config.BatchSize, "batch-size", "c", config.BatchSize, "Size of each batch flushed to the database")
	flag.Float64VarP(&config.FlushInterval, "flush-interval", "i", config.FlushInterval, "Maximum interval at which to flush the cache to disk (in ms)")

	flag.Parse()

	if config.Sqlite != "" && config.Postgresql != "" {
		log.Error("cannot log to both sqlite and postgres at the same time")
		os.Exit(1)
	} else if config.Sqlite == "" && config.Postgresql == "" {
		log.Error("--sqlite or --postgres must be specified")
		os.Exit(1)
	}

	if config.Sqlite != "" {
		config.Driver = DriverSQLite3
	} else if config.Postgresql != "" {
		config.Driver = DriverTimeScale
	}

	if extraColumnStr != nil && *extraColumnStr != "" {
		extraColumn, err := ExtraColumnFromString(*extraColumnStr)
		if err != nil {
			log.Error("Failed to parse extra column: %s", err)
			os.Exit(1)
		}
		config.ExtraColumn = extraColumn
	}

	return config
}
