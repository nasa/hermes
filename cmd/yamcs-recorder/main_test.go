package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/nasa/hermes/internal/recorder/store"
)

func TestDropStored(t *testing.T) {
	cutoff := time.Date(2026, 9, 29, 12, 0, 0, 0, time.UTC)
	version := store.Parameter{Instance: "fprime-project", SpaceSystem: "/BigData_YamcsDeployment/CdhCore/version", Name: "FrameworkVersion"}
	health := store.Parameter{Instance: "fprime-project", SpaceSystem: "/BigData_YamcsDeployment/CdhCore/health", Name: "Status"}
	noHistory := store.Parameter{Instance: "fprime-project", SpaceSystem: "/BigData_YamcsDeployment/Sensor", Name: "Temperature"}

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

	kept, skipped := dropStored(rows, map[store.Parameter]time.Time{version: cutoff, health: cutoff})
	assert.Equal(t, want, kept)
	assert.Equal(t, 4, skipped)

	kept, skipped = dropStored(nil, map[store.Parameter]time.Time{version: cutoff})
	assert.Empty(t, kept)
	assert.Zero(t, skipped)
}
