package store

import (
	"context"
	"database/sql"
	"math"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func simParam(name string) Parameter {
	return Parameter{Instance: "simulator", SpaceSystem: "/YSS/SIMULATOR", Name: name}
}

func readRows(t *testing.T, db *sql.DB) map[string]Row {
	t.Helper()
	rows, err := db.Query(`
		SELECT p.instance, p.space_system, p.name, v.member_path, v.generation_time, v.acquisition_time,
		       v.value_type, v.int_value, v.float_value, v.bool_value, v.string_value, v.binary_value
		FROM parameter_values v JOIN parameters p ON p.id = v.parameter_id`)
	require.NoError(t, err)
	defer rows.Close()

	out := make(map[string]Row)
	for rows.Next() {
		var r Row
		var valueType string
		require.NoError(t, rows.Scan(
			&r.Parameter.Instance, &r.Parameter.SpaceSystem, &r.Parameter.Name, &r.MemberPath,
			&r.GenerationTime, &r.AcquisitionTime, &valueType,
			&r.Value.Int, &r.Value.Float, &r.Value.Bool, &r.Value.String, &r.Value.Binary,
		))
		r.Value.Type = ValueType(valueType)
		r.GenerationTime = r.GenerationTime.UTC()
		if r.AcquisitionTime.Valid {
			r.AcquisitionTime.Time = r.AcquisitionTime.Time.UTC()
		}
		out[r.Parameter.Name+r.MemberPath] = r
	}
	require.NoError(t, rows.Err())
	return out
}

func TestInsertRoundTripsEveryType(t *testing.T) {
	db := migratedDB(t)
	ctx := context.Background()

	gen := time.Date(2026, 9, 30, 12, 0, 0, 123456000, time.UTC)
	acq := sql.NullTime{Time: gen.Add(250 * time.Millisecond), Valid: true}
	stamp := time.Date(2026, 9, 30, 11, 59, 59, 500_000_000, time.UTC)

	want := []Row{
		{Parameter: simParam("Float"), Value: FloatValue(3.1415927)},
		{Parameter: simParam("Double"), Value: DoubleValue(807761995.2324219)},
		{Parameter: simParam("NaN"), Value: DoubleValue(math.NaN())},
		{Parameter: simParam("Inf"), Value: DoubleValue(math.Inf(1))},
		{Parameter: simParam("NegInf"), Value: DoubleValue(math.Inf(-1))},
		{Parameter: simParam("Uint32"), Value: Uint32Value(math.MaxUint32)},
		{Parameter: simParam("Sint32"), Value: Sint32Value(math.MinInt32)},
		{Parameter: simParam("Uint64Max"), Value: Uint64Value(math.MaxUint64)},
		{Parameter: simParam("Uint64High"), Value: Uint64Value(1<<63 + 12345)},
		{Parameter: simParam("Uint64Low"), Value: Uint64Value(12345)},
		{Parameter: simParam("Sint64"), Value: Sint64Value(math.MinInt64)},
		{Parameter: simParam("Boolean"), Value: BooleanValue(true)},
		{Parameter: simParam("String"), Value: StringValue("tab\tnewline\nbackslash\\ é")},
		{Parameter: simParam("Binary"), Value: BinaryValue([]byte{0x00, 0x01, 0xfe, 0xff, '\\', '\n'})},
		{Parameter: simParam("EmptyBinary"), Value: BinaryValue(nil)},
		{Parameter: simParam("Enumerated"), Value: EnumeratedValue(2, "SAFE")},
		{Parameter: simParam("Timestamp"), Value: TimestampValue(stamp)},
		{Parameter: simParam("Struct"), MemberPath: ".voltage", Value: DoubleValue(28.5)},
		{Parameter: simParam("Array"), MemberPath: "[3]", Value: Sint32Value(-7)},
		{Parameter: simParam("ArrayOfStruct"), MemberPath: "[0].x", Value: Uint32Value(42)},
	}
	for i := range want {
		want[i].GenerationTime = gen
		if i%2 == 0 {
			want[i].AcquisitionTime = acq
		}
	}

	require.NoError(t, Insert(ctx, db, NewResolver(), want))

	got := readRows(t, db)
	require.Len(t, got, len(want))
	for _, w := range want {
		g, ok := got[w.Parameter.Name+w.MemberPath]
		require.True(t, ok, "missing %s%s", w.Parameter.Name, w.MemberPath)
		if w.Parameter.Name == "NaN" {
			assert.True(t, math.IsNaN(g.Value.Float.Float64))
			g.Value.Float.Float64, w.Value.Float.Float64 = 0, 0
		}
		assert.Equal(t, w, g, w.Parameter.Name+w.MemberPath)
	}

	assert.Equal(t, float32(3.1415927), float32(got["Float"].Value.Float.Float64))
	assert.Equal(t, "2026-09-30T11:59:59.5Z", got["Timestamp"].Value.String.String)
	assert.NotNil(t, got["EmptyBinary"].Value.Binary, "empty BINARY must not read back as NULL")

	sqlText := func(query, name string) string {
		var s string
		require.NoError(t, db.QueryRow(query+` FROM parameter_values v JOIN parameters p ON p.id = v.parameter_id
			WHERE p.name = $1`, name).Scan(&s))
		return s
	}
	assert.Equal(t, "807761995.2324219", sqlText(`SELECT v.float_value::text`, "Double"))
	assert.Equal(t, "0 6", sqlText(`SELECT get_byte(v.binary_value, 0) || ' ' || length(v.binary_value)`, "Binary"))

	const unsigned = `SELECT (CASE WHEN v.int_value < 0 THEN v.int_value::numeric + 18446744073709551616
		ELSE v.int_value::numeric END)::text`
	assert.Equal(t, strconv.FormatUint(math.MaxUint64, 10), sqlText(unsigned, "Uint64Max"))
	assert.Equal(t, strconv.FormatUint(1<<63+12345, 10), sqlText(unsigned, "Uint64High"))
	assert.Equal(t, "12345", sqlText(unsigned, "Uint64Low"))
}

func TestInsertRejectsUnknownValueType(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()
	gen := time.Date(2026, 9, 30, 12, 0, 0, 0, time.UTC)

	good := Row{Parameter: simParam("Good"), GenerationTime: gen, Value: DoubleValue(1)}
	bad := Row{Parameter: simParam("Bad"), GenerationTime: gen, Value: Value{
		Type: "VOID", Int: sql.NullInt64{Int64: 1, Valid: true},
	}}

	err := Insert(ctx, db, ids, []Row{good, bad})
	require.ErrorContains(t, err, "value_type_known")

	var values, params int
	require.NoError(t, db.QueryRow(`SELECT COUNT(*) FROM parameter_values`).Scan(&values))
	require.NoError(t, db.QueryRow(`SELECT COUNT(*) FROM parameters`).Scan(&params))
	assert.Zero(t, values, "the whole batch must roll back")
	assert.Zero(t, params)
	_, cached := ids.get(good.Parameter)
	assert.False(t, cached, "ids from a rolled back batch must not be cached")

	require.NoError(t, Insert(ctx, db, ids, []Row{good}))
	require.NoError(t, db.QueryRow(`SELECT COUNT(*) FROM parameter_values`).Scan(&values))
	assert.Equal(t, 1, values)
}

func TestInsertIntoCompressedChunk(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()
	day := time.Date(2026, 1, 15, 0, 0, 0, 0, time.UTC)

	batch := func(start time.Duration, n int) []Row {
		rows := make([]Row, n)
		for i := range rows {
			rows[i] = Row{
				Parameter:      simParam("BatteryVoltage1"),
				GenerationTime: day.Add(start + time.Duration(i)*time.Second),
				Value:          DoubleValue(float64(i)),
			}
		}
		return rows
	}

	require.NoError(t, Insert(ctx, db, ids, batch(0, 100)))

	var compressed int
	require.NoError(t, db.QueryRow(
		`SELECT COUNT(compress_chunk(c)) FROM show_chunks('parameter_values') c`).Scan(&compressed))
	require.Equal(t, 1, compressed)

	require.NoError(t, Insert(ctx, db, ids, batch(time.Hour, 50)))

	var chunks int
	var isCompressed bool
	require.NoError(t, db.QueryRow(`SELECT COUNT(*), bool_and(is_compressed) FROM timescaledb_information.chunks
		WHERE hypertable_name = 'parameter_values'`).Scan(&chunks, &isCompressed))
	assert.Equal(t, 1, chunks, "the second batch must land in the same, compressed chunk")
	assert.True(t, isCompressed)

	var count int
	var sum float64
	require.NoError(t, db.QueryRow(`SELECT COUNT(*), SUM(float_value) FROM parameter_values`).Scan(&count, &sum))
	assert.Equal(t, 150, count)
	assert.Equal(t, float64(4950+1225), sum)
}
