package main

import (
	"slices"
	"strings"
	"testing"

	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/encoding/prototext"
)

type rowValue struct {
	key   string
	value any
}

func TestEdge(t *testing.T) {
	telString := "telemetry:{ref:{id:4061  name:\"MotTlmHstReqStart\"  component:\"mot\"}  time:{unix:{seconds:1754432124  nanos:164048350}  sclk:2.6544459530005646e+09}  value:{o:{o:{key:\"table\"  value:{o:{o:{key:\"csw_en\"  value:{u:3221225472}}  o:{key:\"csw_trigger\"  value:{u:15777792}}  o:{key:\"csw_trip_on_open\"  value:{u:3236954112}}  o:{key:\"nrti_skip\"  value:{i:0}}  o:{key:\"sc_time0\"  value:{f:8.077619952324219e+08}}  o:{key:\"servo_timeout_secs\"  value:{u:13}}  o:{key:\"type\"  value:{u:1}}}}}}}  labels:{key:\"apid\"  value:\"MotExerRing-456\"}}  source:\"m20-rce-a\""

	tel := &pb.SourcedTelemetry{}
	err := prototext.Unmarshal([]byte(telString), tel)
	assert.NoError(t, err)

	recorder, err := NewSQLiteRecorder(":memory:", nil)
	assert.NoError(t, err)

	err = recorder.Initialize()
	assert.NoError(t, err)

	tx, err := recorder.StartTransaction()
	assert.NoError(t, err)

	err = recorder.InsertTelemetry(tx, tel)
	assert.NoError(t, err)

	err = tx.Commit()
	assert.NoError(t, err)

	rows, err := recorder.db.Query("SELECT * FROM telemetry")
	assert.NoError(t, err)

	defer rows.Close()

	actualRows := []rowValue{}

	n := 0
	for rows.Next() {
		var (
			id        int64
			telDefId  int64
			time      float64
			timeSclk  float64
			source    string
			labels    string
			key       string
			valueType *string
			integral  *int64
			floating  *float64
			boolval   *int64
			str       *string
			bites     *[]byte
		)
		err = rows.Scan(&id, &telDefId, &time, &timeSclk, &source, &labels, &key, &valueType, &integral, &floating, &boolval, &str, &bites)
		assert.NoError(t, err)

		assert.Equal(t, int64(4061), telDefId)
		assert.Equal(t, "m20-rce-a", source)

		var value any
		if integral != nil {
			value = *integral
		} else if floating != nil {
			value = *floating
		}

		actualRows = append(actualRows, rowValue{
			key:   key,
			value: value,
		})

		n++
	}

	slices.SortFunc(actualRows, func(a rowValue, b rowValue) int {
		return strings.Compare(a.key, b.key)
	})

	assert.Equal(t, 7, n)
	assert.EqualValues(t, []rowValue{
		{
			key:   "value.table.csw_en",
			value: int64(3221225472),
		},
		{
			key:   "value.table.csw_trigger",
			value: int64(15777792),
		},
		{
			key:   "value.table.csw_trip_on_open",
			value: int64(3236954112),
		},
		{
			key:   "value.table.nrti_skip",
			value: int64(0),
		},
		{
			key:   "value.table.sc_time0",
			value: 8.077619952324219e+08,
		},
		{
			key:   "value.table.servo_timeout_secs",
			value: int64(13),
		},
		{
			key:   "value.table.type",
			value: int64(1),
		},
	}, actualRows)
}
