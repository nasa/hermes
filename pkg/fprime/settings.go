package fprime

import (
	"fmt"
	"time"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/hostutil"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
)

var TimeBases map[int]hostutil.TimeSystem

var Config = struct {
	DownlinkTimeout          util.Duration `toml:"downlink-timeout" comment:"Maximum duration to wait between downlink chunks before giving up on the downlink. Use 0s to wait forever"`
	UplinkChunkSize          uint32        `toml:"uplink-chunk-size" comment:"Size in bytes of the 'data' portion on file uplinks. Note packets will include additional overhead around the raw data."`
	UplinkTruncateSourcePath bool          `toml:"uplink-truncate-source-path" comment:"Save uplink bandwidth by sending '/' instead of the real source path of a file."`
	UplinkRateLimit          float64       `toml:"uplink-rate-limit" comment:"Uplink rate limit in bytes per second, use '0.0' to disable limiter."`

	PacketDescriptorType pb.IntKind `toml:"packet-descriptor-type"`
	OpcodeType           pb.IntKind `toml:"opcode-type"`
	ChanIdType           pb.IntKind `toml:"chan-id-type"`
	EventIdType          pb.IntKind `toml:"event-id-type"`
	PrmIdType            pb.IntKind `toml:"prm-id-type"`
	TlmPacketizeIdType   pb.IntKind `toml:"tlm-packetize-type"`
	BuffSizeType         pb.IntKind `toml:"buff-size-type"`
	EnumStoreType        pb.IntKind `toml:"enum-store-type"`

	TimeBaseStoreType    pb.IntKind `toml:"time-base-store-type"`
	TimeContextStoreType pb.IntKind `toml:"time-context-store-type"`
	UseTimeBase          bool       `toml:"use-time-base" comment:"Expect timebase to be encoded into timestamp values"`
	UseTimeContext       bool       `toml:"use-time-context" comment:"Expect time context to be encoded into timestamp values"`

	TimeBases map[int]hostutil.TimeSettings `toml:"time-bases" comment:"Time bases SCLK conversions. If no mapping is found UTC is assumed"`

	TrueValue  uint `toml:"true-value" comment:"Binary to encode 'true' boolean values as"`
	FalseValue uint `toml:"false-value" comment:"Binary to encode 'false' boolean values as"`
}{
	DownlinkTimeout:          util.Duration(10 * time.Second),
	UplinkChunkSize:          256,
	UplinkTruncateSourcePath: true,
	UplinkRateLimit:          0,

	PacketDescriptorType: pb.IntKind_INT_U32,
	OpcodeType:           pb.IntKind_INT_U32,
	ChanIdType:           pb.IntKind_INT_U32,
	EventIdType:          pb.IntKind_INT_U32,
	PrmIdType:            pb.IntKind_INT_U32,
	TlmPacketizeIdType:   pb.IntKind_INT_U16,
	BuffSizeType:         pb.IntKind_INT_U16,
	EnumStoreType:        pb.IntKind_INT_I32,
	TimeBaseStoreType:    pb.IntKind_INT_U16,
	TimeContextStoreType: pb.IntKind_INT_U8,
	UseTimeBase:          true,
	UseTimeContext:       true,
	TimeBases: map[int]hostutil.TimeSettings{
		0: hostutil.DefaultTimeSettings,
	},

	TrueValue:  0xFF,
	FalseValue: 0x00,
}

func init() {
	host.RegisterSettings(
		"fprime",
		&Config,
		host.WithCallback(func() error {
			TimeBases = map[int]hostutil.TimeSystem{}

			for timeBase, settings := range Config.TimeBases {
				system, err := settings.Load()
				if err != nil {
					return fmt.Errorf("failed to initialize timebase %d: %w", timeBase, err)
				}

				TimeBases[timeBase] = system
			}

			return nil
		}),
	)
}
