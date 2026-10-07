package main

import (
	"bytes"
	"log/slog"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/nasa/hermes/internal/recorder/store"
)

func TestRecordedParametersExcludesTopLevel(t *testing.T) {
	// recordedParameters filters in place, so each call gets a fresh slice.
	names := func() []string {
		return []string{
			"/Dep/FPrimeTime",
			"/Dep/CdhCore/version/FrameworkVersion",
			"/Dep/systemResources/CPU",
			"/P",
		}
	}

	kept, excluded := recordedParameters(names(), false)
	assert.Equal(t, []string{"/Dep/CdhCore/version/FrameworkVersion", "/Dep/systemResources/CPU", "/P"}, kept)
	assert.Equal(t, 1, excluded)

	kept, excluded = recordedParameters(names(), true)
	assert.Equal(t, names(), kept)
	assert.Zero(t, excluded)
}

func TestDropStoredKeepsNewerRows(t *testing.T) {
	cutoff := time.Date(2026, 9, 29, 12, 0, 0, 0, time.UTC)
	version := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/CdhCore/version", Name: "FrameworkVersion"}
	health := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/CdhCore/health", Name: "PingLateWarnings"}
	noHistory := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/Ref/systemResources", Name: "CPU"}

	row := func(p store.Parameter, member string, offset time.Duration) store.Row {
		return store.Row{Parameter: p, MemberPath: member, GenerationTime: cutoff.Add(offset)}
	}
	rows := []store.Row{
		row(version, "", -time.Hour),
		row(version, "", 0),
		row(version, "", time.Millisecond),
		row(health, ".a", 0),
		row(health, ".b", 0),
		row(health, ".a", time.Second),
		row(noHistory, "", -24*time.Hour),
		row(noHistory, "", 0),
	}
	want := []store.Row{rows[2], rows[5], rows[6], rows[7]}

	stored := map[store.Parameter]time.Time{version: cutoff, health: cutoff}
	kept, alreadyStored := dropStored(rows, stored)
	assert.Equal(t, want, kept)
	assert.Equal(t, 4, alreadyStored)

	// Only the first message with a parameter is checked, so a clock that
	// restarts behind the stored data does not drop later values.
	older := row(version, "", -time.Hour)
	kept, alreadyStored = dropStored([]store.Row{older}, stored)
	assert.Equal(t, []store.Row{older}, kept)
	assert.Zero(t, alreadyStored)
}

func TestStatsLineNamesEachCount(t *testing.T) {
	var st stats
	st.incomplete.Add(3)
	st.alreadyStored.Add(2)
	var logs bytes.Buffer
	st.log(slog.New(slog.NewTextHandler(&logs, nil)))
	assert.Contains(t, logs.String(), "unmapped=0 incomplete=3 already_stored=2 insert_errors=0")
}
