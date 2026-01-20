package fprime_test

import (
	"strings"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/fprime"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/serial"
	"github.com/nasa/hermes/pkg/spice"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var testMux sync.Mutex
var dict *host.DictionaryNamespace
var test1Telem = &pb.TelemetryDef{
	Id:        0x01020304,
	Component: "Test",
	Name:      "1",
	Type: &pb.Type{
		Value: &pb.Type_String_{
			String_: &pb.StringType{
				LengthType: pb.UIntKind_UINT_U8,
			},
		},
	},
}

var test2Telem = &pb.TelemetryDef{
	Id:        0x02030405,
	Component: "Test",
	Name:      "2",
	Type: &pb.Type{
		Value: &pb.Type_Int{
			Int: &pb.IntType{
				Kind: pb.IntKind_INT_U16,
			},
		},
	},
}

var test3Telem = &pb.TelemetryDef{
	Id:        0x03040506,
	Component: "Test",
	Name:      "3",
	Type: &pb.Type{
		Value: &pb.Type_Int{
			Int: &pb.IntType{
				Kind: pb.IntKind_INT_U8,
			},
		},
	},
}

func init() {
	var err error

	dict, _ = host.NewDictionaryNamespace(&pb.DictionaryNamespace{
		Telemetry: map[string]*pb.TelemetryDef{
			"1": test1Telem,
			"2": test2Telem,
			"3": test3Telem,
		},
	})

	err = host.LoadConfiguration(strings.NewReader(`
[fprime]
[fprime.time-bases]
[fprime.time-bases.0]
time-system = 'utc'
epoch = '1970-01-01T00:00:00Z'

[fprime.time-bases.1]
time-system = 'terrestrial'
epoch = '2000-01-01T12:00:00.000Z'
`))

	if err != nil {
		panic(err)
	}
}

func TestTelemPacket(t *testing.T) {
	t.Run("with time context and base", func(t *testing.T) {
		testMux.Lock()
		defer testMux.Unlock()
		fprime.Config.UseTimeBase = true
		fprime.Config.UseTimeContext = true

		data := []byte{
			0x00, 0x00, 0x00, 0x01, // telem type
			0x01, 0x02, 0x03, 0x04, // id

			// Time with time base and context
			0xAA, 0xBB, // base
			0xCC,                   // context
			0x67, 0xa8, 0xde, 0xee, // seconds
			0x00, 0x01, 0x1d, 0x33, // useconds

			6, 'C', 'U', 'S', 'T', 'O', 'M',
		}

		var pkt fprime.Packet
		pkt.Unmarshal(
			serial.NewReader(data),
			dict,
			nil,
		)

		assert.EqualValues(t, &fprime.Packet{
			Type: fprime.PacketType_TELEM,
			Payload: []*fprime.TelemValue{
				{
					Id: 0x01020304,
					Time: &fprime.Time{
						Base:     0xAABB,
						Context:  0xCC,
						Seconds:  0x67a8deee,
						USeconds: 0x00011d33,
					},
					Def: test1Telem,
					Value: &pb.Value{
						Value: &pb.Value_S{
							S: "CUSTOM",
						},
					},
				},
			},
		}, &pkt)
	})
	t.Run("with multi values", func(t *testing.T) {
		testMux.Lock()
		defer testMux.Unlock()

		fprime.Config.UseTimeBase = true
		fprime.Config.UseTimeContext = true

		data := []byte{
			0x00, 0x00, 0x00, 0x01, // telem type
			0x01, 0x02, 0x03, 0x04, // id

			// Time with time base and context
			0xAA, 0xBB, // base
			0xCC,                   // context
			0x67, 0xa8, 0xde, 0xee, // seconds
			0x00, 0x01, 0x1d, 0x33, // useconds

			6, 'C', 'U', 'S', 'T', 'O', 'M',

			0x01, 0x02, 0x03, 0x04, // id

			// Time with time base and context
			0xAA, 0xBB, // base
			0xCC,                   // context
			0x67, 0xa8, 0xde, 0xef, // seconds
			0x00, 0x01, 0x1d, 0x33, // useconds

			3, 'C', 'U', 'S',
		}

		var pkt fprime.Packet
		err := pkt.Unmarshal(
			serial.NewReader(data),
			dict,
			nil,
		)

		assert.NoError(t, err)

		assert.EqualValues(t, &fprime.Packet{
			Type: fprime.PacketType_TELEM,
			Payload: []*fprime.TelemValue{
				{
					Id: 0x01020304,
					Time: &fprime.Time{
						Base:     0xAABB,
						Context:  0xCC,
						Seconds:  0x67a8deee,
						USeconds: 0x00011d33,
					},
					Def: test1Telem,
					Value: &pb.Value{
						Value: &pb.Value_S{
							S: "CUSTOM",
						},
					},
				},
				{
					Id: 0x01020304,
					Time: &fprime.Time{
						Base:     0xAABB,
						Context:  0xCC,
						Seconds:  0x67a8deef,
						USeconds: 0x00011d33,
					},
					Def: test1Telem,
					Value: &pb.Value{
						Value: &pb.Value_S{
							S: "CUS",
						},
					},
				},
			},
		}, &pkt)
	})

	t.Run("with time context", func(t *testing.T) {
		testMux.Lock()
		defer testMux.Unlock()

		fprime.Config.UseTimeBase = false
		fprime.Config.UseTimeContext = true

		data := []byte{
			0x00, 0x00, 0x00, 0x01, // telem type
			0x02, 0x03, 0x04, 0x05, // id

			// Time with time context
			0xCC,                   // context
			0x67, 0xa8, 0xde, 0xee, // seconds
			0x00, 0x01, 0x1d, 0x33, // useconds

			0x01, 0x02,
		}

		var pkt fprime.Packet
		err := pkt.Unmarshal(
			serial.NewReader(data),
			dict,
			nil,
		)

		assert.NoError(t, err)

		assert.EqualValues(t, &fprime.Packet{
			Type: fprime.PacketType_TELEM,
			Payload: []*fprime.TelemValue{
				{
					Id: 0x02030405,
					Time: &fprime.Time{
						Base:     0,
						Context:  0xCC,
						Seconds:  0x67a8deee,
						USeconds: 0x00011d33,
					},
					Def: test2Telem,
					Value: &pb.Value{
						Value: &pb.Value_U{
							U: 0x0102,
						},
					},
				},
			},
		}, &pkt)
	})

	t.Run("with simple time", func(t *testing.T) {
		testMux.Lock()
		defer testMux.Unlock()

		fprime.Config.UseTimeBase = false
		fprime.Config.UseTimeContext = false

		data := []byte{
			0x00, 0x00, 0x00, 0x01, // telem type
			0x03, 0x04, 0x05, 0x06, // id

			// Simple time
			0x67, 0xa8, 0xde, 0xee, // seconds
			0x00, 0x01, 0x1d, 0x33, // useconds

			0xEF,
		}

		var pkt fprime.Packet
		err := pkt.Unmarshal(
			serial.NewReader(data),
			dict,
			nil,
		)

		assert.NoError(t, err)

		assert.EqualValues(t, &fprime.Packet{
			Type: fprime.PacketType_TELEM,
			Payload: []*fprime.TelemValue{
				{
					Id: 0x03040506,
					Time: &fprime.Time{
						Base:     0,
						Context:  0,
						Seconds:  0x67a8deee,
						USeconds: 0x00011d33,
					},
					Def: test3Telem,
					Value: &pb.Value{
						Value: &pb.Value_U{
							U: 0xEF,
						},
					},
				},
			},
		}, &pkt)
	})
	t.Run("with time j2000", func(t *testing.T) {
		testMux.Lock()
		defer testMux.Unlock()

		fprime.Config.UseTimeBase = true
		fprime.Config.UseTimeContext = true

		data := []byte{
			0x00, 0x00, 0x00, 0x01, // telem type
			0x01, 0x02, 0x03, 0x04, // id

			// Time with time base and context
			0x0, 0x1, // base
			0xCC,                   // context
			0x28, 0xCA, 0xAC, 0xDA, // seconds
			0x00, 0x0E, 0x2E, 0x66, // useconds

			6, 'C', 'U', 'S', 'T', 'O', 'M',
		}

		var pkt fprime.Packet
		err := pkt.Unmarshal(
			serial.NewReader(data),
			dict,
			nil,
		)

		assert.NoError(t, err)

		tlms := []*pb.Telemetry{}
		for _, v := range pkt.Payload.([]*fprime.TelemValue) {
			tlm, err := v.ToTelemetry()
			assert.NoError(t, err)
			tlms = append(tlms, tlm)
		}

		assert.EqualValues(t,
			[]*pb.Telemetry{
				{
					Value: &pb.Value{
						Value: &pb.Value_S{
							S: "CUSTOM",
						},
					},
					Time: &pb.Time{
						Unix: &timestamppb.Timestamp{
							Seconds: 684371162 /* TT -> TAI */ - 32 + /* TAI -> UTC */ -37 + /* UTC unix time */ spice.UtcAtJ2000,
							Nanos:   929381951 - /* TT -> TAI */ 184000000,
						},
						Sclk: 684371162.929382,
					},
					Ref: test1Telem.ToRef(),
				},
			},
			tlms,
		)
	})
}

func TestFileStartPacket(t *testing.T) {
	pkt := (&fprime.FileStartPacket{
		Size:        23,
		Source:      "/src",
		Destination: "/dest",
	}).AsFilePacket(1).AsPacket()

	fprime.Config.UplinkTruncateSourcePath = true
	w := fprime.NewWriter()
	err := pkt.Marshal(w, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	enc1 := w.Get()

	assert.EqualValues(t,
		[]byte{
			0, 0, 0, 3, // file packet type
			0,          // start packet
			0, 0, 0, 1, // sequence index
			0, 0, 0, 23, // size,
			4, '/', 's', 'r', 'c', // source
			5, '/', 'd', 'e', 's', 't',
		},
		enc1,
	)

	var pkt1 fprime.Packet
	err = pkt1.Unmarshal(serial.NewReader(enc1), dict, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	assert.EqualValues(
		t,
		pkt,
		&pkt1,
	)
}

func TestFileDataPacket(t *testing.T) {
	pkt := (&fprime.FileDataPacket{
		Offset: 31,
		Data:   []byte("some random data"),
	}).AsFilePacket(3).AsPacket()

	w := fprime.NewWriter()
	err := pkt.Marshal(w, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	enc := w.Get()

	assert.EqualValues(t,
		[]byte{
			0, 0, 0, 3, // file packet type
			1,          // data packet
			0, 0, 0, 3, // sequence index
			0, 0, 0, 31, // offset,
			0, 16,
			's', 'o', 'm', 'e', ' ', 'r', 'a', 'n', 'd', 'o', 'm', ' ', 'd', 'a', 't', 'a',
		},
		enc,
	)

	var pkt1 fprime.Packet
	err = pkt1.Unmarshal(serial.NewReader(enc), dict, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	assert.EqualValues(t, pkt, &pkt1)
}

func TestFileEndPacket(t *testing.T) {
	pkt := (&fprime.FileEndPacket{
		CRC: 0x01020304,
	}).AsFilePacket(4).AsPacket()

	w := fprime.NewWriter()
	err := pkt.Marshal(w, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	enc := w.Get()

	assert.EqualValues(t,
		[]byte{
			0, 0, 0, 3, // file packet type
			2,          // end packet
			0, 0, 0, 4, // sequence index
			1, 2, 3, 4, // crc
		},
		enc,
	)

	var pkt1 fprime.Packet
	err = pkt1.Unmarshal(serial.NewReader(enc), dict, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	assert.EqualValues(t, pkt, &pkt1)
}

func TestFileCancelPacket(t *testing.T) {
	pkt := (&fprime.FileCancelPacket{}).AsFilePacket(4).AsPacket()

	w := fprime.NewWriter()
	err := pkt.Marshal(w, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	enc := w.Get()

	assert.EqualValues(t,
		[]byte{
			0, 0, 0, 3, // file packet type
			3,          // cancel packet
			0, 0, 0, 4, // sequence index
		},
		enc,
	)

	var pkt1 fprime.Packet
	err = pkt1.Unmarshal(serial.NewReader(enc), dict, nil)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	assert.EqualValues(t, pkt, &pkt1)
}
