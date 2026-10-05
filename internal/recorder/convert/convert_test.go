package convert

import (
	"bytes"
	"database/sql"
	"encoding/json"
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

// The captures in testdata come from Ref, the reference deployment in F Prime's
// own repository, running under fprime-yamcs. ref is its deployment's top-level
// space system.
const ref = "/Ref_Ref"

// readMessages parses a capture of concatenated SubscribeParametersData JSON
// objects, as grpcurl prints them.
func readMessages(t *testing.T, path string) []*processing.SubscribeParametersData {
	t.Helper()
	raw, err := os.ReadFile(path)
	require.NoError(t, err)
	dec := json.NewDecoder(bytes.NewReader(raw))
	var out []*processing.SubscribeParametersData
	for dec.More() {
		var obj json.RawMessage
		require.NoError(t, dec.Decode(&obj))
		msg := &processing.SubscribeParametersData{}
		require.NoError(t, protojson.Unmarshal(obj, msg))
		out = append(out, msg)
	}
	return out
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

// must returns the rows of a Rows call that dropped nothing. It panics because
// Go won't let us pass t alongside the three results of Rows.
func must(rows []store.Row, unmapped, incomplete int) []store.Row {
	if unmapped != 0 || incomplete != 0 {
		panic("unexpected unmapped or incomplete values")
	}
	return rows
}

func TestSplitName(t *testing.T) {
	for _, tc := range []struct{ in, spaceSystem, name string }{
		{ref + "/ComCcsds/comQueue/comQueueDepth", ref + "/ComCcsds/comQueue", "comQueueDepth"},
		{ref + "/FPrimeTime", ref, "FPrimeTime"},
		{"/Param", "/", "Param"},
	} {
		spaceSystem, name, ok := splitName(tc.in)
		assert.True(t, ok, tc.in)
		assert.Equal(t, tc.spaceSystem, spaceSystem, tc.in)
		assert.Equal(t, tc.name, name, tc.in)
	}
	for _, bad := range []string{"", "/", "Param", "/A/", "alias"} {
		_, _, ok := splitName(bad)
		assert.False(t, ok, bad)
	}
}

// Captured from Ref: CCSDS_Packet_ID is an aggregate with UINT32 and
// BOOLEAN members, comQueueDepth a UINT32 array. The first message carries
// the mapping and values together.
func TestRowsFlattensCapturedAggregateAndArray(t *testing.T) {
	c := newConverter()
	msgs := readMessages(t, "testdata/member-sample.json")
	require.Len(t, msgs, 2)

	rows, unmapped, incomplete := c.Rows(msgs[0])
	assert.Zero(t, unmapped)
	assert.Zero(t, incomplete)
	got := byPath(t, rows)
	require.Len(t, got, 6)

	packetID := store.Parameter{Instance: "fprime-project", SpaceSystem: ref, Name: "CCSDS_Packet_ID"}
	gen, acq := utc("2026-10-06T23:08:52.699Z"), acquired("2026-10-06T23:08:52.706Z")
	assert.Equal(t, store.Row{Parameter: packetID, MemberPath: ".Version", GenerationTime: gen, AcquisitionTime: acq,
		Value: store.Uint32Value(0)}, got["CCSDS_Packet_ID.Version"])
	assert.Equal(t, store.BooleanValue(false), got["CCSDS_Packet_ID.Type"].Value)
	assert.Equal(t, store.BooleanValue(false), got["CCSDS_Packet_ID.SecHdrFlag"].Value)
	assert.Equal(t, store.Uint32Value(1), got["CCSDS_Packet_ID.APID"].Value)

	depth := got["comQueueDepth[1]"]
	assert.Equal(t, ref+"/ComCcsds/comQueue", depth.Parameter.SpaceSystem)
	assert.Equal(t, store.Uint32Value(1), depth.Value)
	assert.Equal(t, store.Uint32Value(0), got["comQueueDepth[0]"].Value)
	assert.Equal(t, acquired("2026-10-06T23:08:52.706Z"), depth.AcquisitionTime)

	// Later messages carry no mapping; ids resolve from the first.
	rows, unmapped, incomplete = c.Rows(msgs[1])
	assert.Zero(t, unmapped)
	assert.Zero(t, incomplete)
	assert.Len(t, rows, 6)
}

// Captured from Ref: the mapping arrives alone, then FPrimeTime (with an
// ENUMERATED member) and CPU (FLOAT).
func TestRowsUsesMappingFromEarlierMessage(t *testing.T) {
	c := newConverter()
	msgs := readMessages(t, "testdata/time-sample.json")
	require.Len(t, msgs, 3)

	assert.Empty(t, must(c.Rows(msgs[0])))

	assert.Len(t, must(c.Rows(msgs[1])), 4)

	got := byPath(t, must(c.Rows(msgs[2])))
	require.Len(t, got, 5)
	assert.Equal(t, store.EnumeratedValue(2, "TB_WORKSTATION_TIME"), got["FPrimeTime.timeBase"].Value)
	assert.Equal(t, store.Uint32Value(1791328138), got["FPrimeTime.seconds"].Value)
	assert.Equal(t, store.Uint32Value(699375), got["FPrimeTime.useconds"].Value)

	cpu := got["CPU"]
	assert.Equal(t, "", cpu.MemberPath)
	assert.Equal(t, ref+"/Ref/systemResources", cpu.Parameter.SpaceSystem)
	assert.Equal(t, store.FloatValue(0.37377486), cpu.Value)
	assert.Equal(t, utc("2026-10-06T23:08:59.699Z"), cpu.GenerationTime)
}

// Captured from Ref: a STRING and UINT64 from the deployment plus SINT64,
// DOUBLE and ENUMERATED YAMCS system parameters.
func TestRowsConvertsCapturedScalars(t *testing.T) {
	c := newConverter()
	var rows []store.Row
	for _, msg := range readMessages(t, "testdata/mixed-sample.json") {
		rows = append(rows, must(c.Rows(msg))...)
	}
	got := byPath(t, rows)
	require.Len(t, got, 5)
	assert.Equal(t, store.StringValue("7d8f579"), got["FrameworkVersion"].Value)
	assert.Equal(t, store.Uint64Value(16173720), got["MEMORY_TOTAL"].Value)
	assert.Equal(t, store.Sint64Value(44609), got["memoryUsed"].Value)
	assert.Equal(t, store.DoubleValue(1024), got["dataInRate"].Value)
	assert.Equal(t, store.EnumeratedValue(0, "OK"), got["linkStatus"].Value)
	assert.Equal(t, "/yamcs/yamcs-server/links/UDP_TM_IN", got["linkStatus"].Parameter.SpaceSystem)
}

// Synthetic values for the types the Ref captures do not contain.
func TestRowsConvertsUncapturedTypes(t *testing.T) {
	rows, unmapped, incomplete := newConverter().Rows(parseMessage(t, `{
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
	assert.Equal(t, 4, incomplete)
	got := byPath(t, rows)
	require.Len(t, got, 6)

	root := got["Root"]
	assert.Equal(t, store.Parameter{Instance: "fprime-project", SpaceSystem: "/", Name: "Root"}, root.Parameter)
	assert.Equal(t, store.Sint32Value(-5), root.Value)
	assert.False(t, root.AcquisitionTime.Valid, "absent acquisitionTime must be NULL")

	assert.Equal(t, store.FloatValue(0.1), got["Float"].Value)
	assert.Equal(t, store.Uint64Value(math.MaxUint64), got["Uint64"].Value)
	assert.Equal(t, store.BinaryValue([]byte{0x00, 0x01, 0xfe, 0xff}), got["Binary"].Value)
	assert.Equal(t, store.TimestampValue("2026-09-30T23:05:16.668Z"), got["Timestamp"].Value)

	assert.Equal(t, store.Uint32Value(1), got["Partial.kept"].Value)
	for _, skipped := range []string{"None", "NoEng", "Partial.none", "Partial.missing"} {
		assert.NotContains(t, got, skipped)
	}
}

// A missing BINARY is skipped like other types, while an empty one is a value.
func TestRowsCountsIncompleteValues(t *testing.T) {
	c := newConverter()
	rows, unmapped, incomplete := c.Rows(parseMessage(t, `{
		"mapping": {"1": {"name": "/S/NoTime"}, "2": {"name": "/S/Agg"}, "3": {"name": "/S/Binary"}, "4": {"name": "/S/EmptyBinary"}},
		"values": [
			{"numericId": 1, "engValue": {"type": "UINT32", "uint32Value": 1}},
			{"numericId": 2, "engValue": {"type": "AGGREGATE", "aggregateValue": {
				"name": ["a", "b", "c"], "value": [{"type": "UINT32", "uint32Value": 1}]}},
				"generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 3, "engValue": {"type": "BINARY"}, "generationTime": "2026-09-30T12:00:00Z"},
			{"numericId": 4, "engValue": {"type": "BINARY", "binaryValue": ""}, "generationTime": "2026-09-30T12:00:00Z"}
		]
	}`))
	assert.Zero(t, unmapped)
	assert.Equal(t, 1+2+1, incomplete, "no generationTime, members b and c, missing BINARY")
	got := byPath(t, rows)
	require.Len(t, got, 2)
	assert.Equal(t, store.Uint32Value(1), got["Agg.a"].Value)
	assert.Equal(t, store.BinaryValue([]byte{}), got["EmptyBinary"].Value)

	_, _, incomplete = c.Rows(parseMessage(t, `{"values": [
		{"numericId": 4, "engValue": {"type": "BINARY", "binaryValue": "AA=="}, "generationTime": "2026-09-30T12:00:00Z"}]}`))
	assert.Zero(t, incomplete, "counts are per call")
}

// Synthetic, shaped like the GroupConfigs channel of F Prime's TlmPacketizer:
// aggregate[2][4] with ENUMERATED and integer members. Ref doesn't use
// TlmPacketizer, so no capture has it.
func TestRowsFlattensNestedArrayOfAggregates(t *testing.T) {
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
						enum(1, "ENABLED"), enum(0, "DISABLED"), enum(int64(j), "label"),
						u32(uint32(10*i + j)), u32(uint32(100*i + j)),
					},
				},
			})
		}
		outer = append(outer, &protobuf.Value{Type: protobuf.Value_ARRAY.Enum(), ArrayValue: inner})
	}

	msg := parseMessage(t, `{"mapping": {"1": {"name": "`+ref+`/CdhCore/tlmSend/GroupConfigs"}},
		"values": [{"numericId": 1, "generationTime": "2026-09-30T12:00:00Z"}]}`)
	msg.Values[0].EngValue = &protobuf.Value{Type: protobuf.Value_ARRAY.Enum(), ArrayValue: outer}

	got := byPath(t, must(newConverter().Rows(msg)))
	assert.Len(t, got, 2*4*5)
	assert.Equal(t, store.EnumeratedValue(1, "ENABLED"), got["GroupConfigs[0][0].enabled"].Value)
	assert.Equal(t, store.EnumeratedValue(3, "label"), got["GroupConfigs[1][3].rateLogic"].Value)
	assert.Equal(t, store.Uint32Value(13), got["GroupConfigs[1][3].min"].Value)
	assert.Equal(t, store.Uint32Value(102), got["GroupConfigs[1][2].max"].Value)
}

func TestRowsFlattensArrayInsideAggregate(t *testing.T) {
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
