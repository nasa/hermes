package convert

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"math"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/encoding/protojson"

	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/yamcspb/protobuf"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
)

const bd = "/BigData_YamcsDeployment"

// readMessages parses a capture of concatenated SubscribeParametersData JSON
// objects, as grpcurl prints them.
func readMessages(t *testing.T, path string) []*processing.SubscribeParametersData {
	t.Helper()
	raw, err := os.ReadFile(path)
	require.NoError(t, err)
	dec := json.NewDecoder(bytes.NewReader(raw))
	var out []*processing.SubscribeParametersData
	for {
		var obj json.RawMessage
		if err := dec.Decode(&obj); errors.Is(err, io.EOF) {
			return out
		} else {
			require.NoError(t, err)
		}
		msg := &processing.SubscribeParametersData{}
		require.NoError(t, protojson.Unmarshal(obj, msg))
		out = append(out, msg)
	}
}

func parseMessage(t *testing.T, s string) *processing.SubscribeParametersData {
	t.Helper()
	msg := &processing.SubscribeParametersData{}
	require.NoError(t, protojson.Unmarshal([]byte(s), msg))
	return msg
}

func newConverter() *Converter {
	return New("fprime-project", slog.New(slog.DiscardHandler))
}

// byPath keys rows by name and member path, failing on duplicates.
func byPath(t *testing.T, rows []store.Row) map[string]store.Row {
	t.Helper()
	out := make(map[string]store.Row)
	for _, r := range rows {
		key := r.Parameter.Name + r.MemberPath
		require.NotContains(t, out, key)
		out[key] = r
	}
	return out
}

func utc(s string) time.Time {
	t, err := time.Parse(time.RFC3339Nano, s)
	if err != nil {
		panic(err)
	}
	return t
}

func acquired(s string) sql.NullTime {
	return sql.NullTime{Time: utc(s), Valid: true}
}

func TestSplitName(t *testing.T) {
	for _, tc := range []struct{ in, spaceSystem, name string }{
		{bd + "/ComCcsds/comQueue/comQueueDepth", bd + "/ComCcsds/comQueue", "comQueueDepth"},
		{bd + "/FPrimeTime", bd, "FPrimeTime"},
		{"/Param", "/", "Param"},
	} {
		spaceSystem, name, ok := SplitName(tc.in)
		assert.True(t, ok, tc.in)
		assert.Equal(t, tc.spaceSystem, spaceSystem, tc.in)
		assert.Equal(t, tc.name, name, tc.in)
	}
	for _, bad := range []string{"", "/", "Param", "/A/", "alias"} {
		_, _, ok := SplitName(bad)
		assert.False(t, ok, bad)
	}
}

// Captured from BigData: CCSDS_Packet_ID is an aggregate with UINT32 and
// BOOLEAN members, comQueueDepth a UINT32 array. The first message carries
// the mapping and values together.
func TestAggregateAndArrayCapture(t *testing.T) {
	c := newConverter()
	msgs := readMessages(t, "testdata/member-sample.json")
	require.Len(t, msgs, 2)

	rows, unmapped := c.Rows(msgs[0])
	assert.Zero(t, unmapped)
	got := byPath(t, rows)
	require.Len(t, got, 6)

	packetID := store.Parameter{Instance: "fprime-project", SpaceSystem: bd, Name: "CCSDS_Packet_ID"}
	gen, acq := utc("2026-09-30T21:15:10.063Z"), acquired("2026-09-30T21:15:10.064Z")
	assert.Equal(t, store.Row{Parameter: packetID, MemberPath: ".Version", GenerationTime: gen, AcquisitionTime: acq,
		Value: store.Uint32Value(0)}, got["CCSDS_Packet_ID.Version"])
	assert.Equal(t, store.BooleanValue(false), got["CCSDS_Packet_ID.Type"].Value)
	assert.Equal(t, store.BooleanValue(false), got["CCSDS_Packet_ID.SecHdrFlag"].Value)
	assert.Equal(t, store.Uint32Value(4), got["CCSDS_Packet_ID.APID"].Value)

	depth := got["comQueueDepth[1]"]
	assert.Equal(t, bd+"/ComCcsds/comQueue", depth.Parameter.SpaceSystem)
	assert.Equal(t, store.Uint32Value(2), depth.Value)
	assert.Equal(t, store.Uint32Value(0), got["comQueueDepth[0]"].Value)
	assert.Equal(t, acquired("2026-09-30T21:15:10.063Z"), depth.AcquisitionTime)

	// Later messages carry no mapping; ids resolve from the first.
	rows, unmapped = c.Rows(msgs[1])
	assert.Zero(t, unmapped)
	assert.Len(t, rows, 6)
}

// Captured from BigData: the mapping arrives alone, then FPrimeTime (with an
// ENUMERATED member) and CPU (FLOAT).
func TestEnumeratedAndFloatCapture(t *testing.T) {
	c := newConverter()
	msgs := readMessages(t, "testdata/time-sample.json")
	require.Len(t, msgs, 3)

	rows, unmapped := c.Rows(msgs[0])
	assert.Empty(t, rows)
	assert.Zero(t, unmapped)

	assert.Len(t, must(c.Rows(msgs[1])), 4)

	got := byPath(t, must(c.Rows(msgs[2])))
	require.Len(t, got, 5)
	assert.Equal(t, store.EnumeratedValue(2, "TB_WORKSTATION_TIME"), got["FPrimeTime.timeBase"].Value)
	assert.Equal(t, store.Uint32Value(1790809518), got["FPrimeTime.seconds"].Value)
	assert.Equal(t, store.Uint32Value(668124), got["FPrimeTime.useconds"].Value)

	cpu := got["CPU"]
	assert.Equal(t, "", cpu.MemberPath)
	assert.Equal(t, bd+"/BigData/systemResources", cpu.Parameter.SpaceSystem)
	assert.Equal(t, store.TypeFloat, cpu.Value.Type)
	assert.Equal(t, 0.06188119, cpu.Value.Float.Float64)
	assert.Equal(t, utc("2026-09-30T23:05:19.668Z"), cpu.GenerationTime)
}

// Captured from the same server: a STRING and UINT64 from BigData plus
// SINT64, DOUBLE and ENUMERATED YAMCS system parameters.
func TestScalarCapture(t *testing.T) {
	c := newConverter()
	var rows []store.Row
	for _, msg := range readMessages(t, "testdata/mixed-sample.json") {
		rows = append(rows, must(c.Rows(msg))...)
	}
	got := byPath(t, rows)
	require.Len(t, got, 5)
	assert.Equal(t, store.StringValue("7d8f579"), got["FrameworkVersion"].Value)
	assert.Equal(t, store.Uint64Value(16173720), got["MEMORY_TOTAL"].Value)
	assert.Equal(t, store.Sint64Value(249244), got["memoryUsed"].Value)
	assert.Equal(t, store.DoubleValue(1300), got["dataInRate"].Value)
	assert.Equal(t, store.EnumeratedValue(0, "OK"), got["linkStatus"].Value)
	assert.Equal(t, "/yamcs/JosephLenovo/links/UDP_TM_IN", got["linkStatus"].Parameter.SpaceSystem)
}

// Synthetic values for the types the BigData captures do not contain.
func TestSyntheticScalars(t *testing.T) {
	rows, unmapped := newConverter().Rows(parseMessage(t, `{
		"mapping": {
			"1": {"name": "/Root"},
			"2": {"name": "/S/Float"},
			"3": {"name": "/S/Uint64"},
			"4": {"name": "/S/Binary"},
			"5": {"name": "/S/Timestamp"},
			"6": {"name": "/S/None"},
			"7": {"name": "/S/NoEng"},
			"8": {"name": "/S/Partial"}
		},
		"values": [
			{"numericId": 1, "engValue": {"type": "SINT32", "sint32Value": -5}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 2, "engValue": {"type": "FLOAT", "floatValue": 0.1}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 3, "engValue": {"type": "UINT64", "uint64Value": "18446744073709551615"}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 4, "engValue": {"type": "BINARY", "binaryValue": "AAH+/w=="}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 5, "engValue": {"type": "TIMESTAMP", "timestampValue": "1790809553668", "stringValue": "2026-09-30T23:05:16.668Z"}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 6, "engValue": {"type": "NONE"}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 7, "rawValue": {"type": "UINT32", "uint32Value": 1}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 8, "engValue": {"type": "AGGREGATE", "aggregateValue": {
				"name": ["kept", "none", "missing"],
				"value": [{"type": "UINT32", "uint32Value": 1}, {"type": "NONE"}, {"type": "UINT32"}]}},
				"generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 99, "engValue": {"type": "UINT32", "uint32Value": 1}, "generationTime": "2026-09-30T12:00:00Z"}
		]
	}`))
	assert.Equal(t, 1, unmapped)
	got := byPath(t, rows)
	require.Len(t, got, 6)

	root := got["Root"]
	assert.Equal(t, store.Parameter{Instance: "fprime-project", SpaceSystem: "/", Name: "Root"}, root.Parameter)
	assert.Equal(t, store.Sint32Value(-5), root.Value)
	assert.False(t, root.AcquisitionTime.Valid, "absent acquisitionTime must be NULL")

	assert.Equal(t, 0.1, got["Float"].Value.Float.Float64)
	assert.Equal(t, store.Uint64Value(math.MaxUint64), got["Uint64"].Value)
	assert.Equal(t, int64(-1), got["Uint64"].Value.Int.Int64, "UINT64 keeps its raw bits")
	assert.Equal(t, store.BinaryValue([]byte{0x00, 0x01, 0xfe, 0xff}), got["Binary"].Value)

	stamp := got["Timestamp"].Value
	assert.Equal(t, store.TypeTimestamp, stamp.Type)
	assert.Equal(t, sql.NullString{String: "2026-09-30T23:05:16.668Z", Valid: true}, stamp.String)
	assert.False(t, stamp.Int.Valid)

	assert.Equal(t, store.Uint32Value(1), got["Partial.kept"].Value)
	for _, skipped := range []string{"None", "NoEng", "Partial.none", "Partial.missing"} {
		assert.NotContains(t, got, skipped)
	}
}

// Synthetic, shaped like BigData's tlmSend GroupConfigs: aggregate[2][4] with
// ENUMERATED and integer members. No capture has a value for it.
func TestNestedArrayOfAggregates(t *testing.T) {
	enum := func(n int64, label string) *protobuf.Value {
		return &protobuf.Value{Type: protobuf.Value_ENUMERATED.Enum(), Sint64Value: &n, StringValue: &label}
	}
	u32 := func(n uint32) *protobuf.Value {
		return &protobuf.Value{Type: protobuf.Value_UINT32.Enum(), Uint32Value: &n}
	}
	var outer []*protobuf.Value
	for i := range 2 {
		var inner []*protobuf.Value
		for j := range 4 {
			inner = append(inner, &protobuf.Value{
				Type: protobuf.Value_AGGREGATE.Enum(),
				AggregateValue: &protobuf.AggregateValue{
					Name: []string{"enabled", "forceEnabled", "rateLogic", "min", "max"},
					Value: []*protobuf.Value{
						enum(1, "ENABLED"), enum(0, "DISABLED"), enum(int64(j%4), "label"),
						u32(uint32(10*i + j)), u32(uint32(100*i + j)),
					},
				},
			})
		}
		outer = append(outer, &protobuf.Value{Type: protobuf.Value_ARRAY.Enum(), ArrayValue: inner})
	}

	c := newConverter()
	msg := parseMessage(t, `{"mapping": {"1": {"name": "`+bd+`/CdhCore/tlmSend/GroupConfigs"}}}`)
	_, _ = c.Rows(msg)
	msg = parseMessage(t, `{"values": [{"numericId": 1, "generationTime": "2026-09-30T12:00:00Z"}]}`)
	msg.Values[0].EngValue = &protobuf.Value{Type: protobuf.Value_ARRAY.Enum(), ArrayValue: outer}

	got := byPath(t, must(c.Rows(msg)))
	assert.Len(t, got, 2*4*5)
	assert.Equal(t, store.EnumeratedValue(1, "ENABLED"), got["GroupConfigs[0][0].enabled"].Value)
	assert.Equal(t, store.EnumeratedValue(3, "label"), got["GroupConfigs[1][3].rateLogic"].Value)
	assert.Equal(t, store.Uint32Value(13), got["GroupConfigs[1][3].min"].Value)
	assert.Equal(t, store.Uint32Value(102), got["GroupConfigs[1][2].max"].Value)
}

func TestArrayInsideAggregate(t *testing.T) {
	c := newConverter()
	got := byPath(t, must(c.Rows(parseMessage(t, `{
		"mapping": {"1": {"name": "/S/Agg"}},
		"values": [{"numericId": 1, "generationTime": "2026-09-30T12:00:00Z", "engValue": {
			"type": "AGGREGATE", "aggregateValue": {"name": ["a"], "value": [
				{"type": "ARRAY", "arrayValue": [{"type": "STRING", "stringValue": "x"}, {"type": "STRING", "stringValue": "y"}]}
			]}}}]
	}`))))
	assert.Equal(t, store.StringValue("x"), got["Agg.a[0]"].Value)
	assert.Equal(t, store.StringValue("y"), got["Agg.a[1]"].Value)
}

func must(rows []store.Row, unmapped int) []store.Row {
	if unmapped != 0 {
		panic("unexpected unmapped values")
	}
	return rows
}
