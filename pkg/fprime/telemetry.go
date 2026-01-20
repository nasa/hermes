package fprime

import (
	"fmt"
	"strings"
	"time"

	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func timeToTimestamp(t *Time) *pb.Time {
	sec := int64(t.Seconds)
	ns := int64(t.USeconds * 1000)

	sec = sec + (ns / 1e9)
	ns %= 1e9

	var gt time.Time
	if ts, ok := TimeBases[int(t.Base)]; ok {
		gt = ts.Convert(sec, ns)
	} else {
		// Fallback to UTC if timebase is not registered
		gt = time.Unix(sec, ns)
	}

	out := &pb.Time{
		Unix: timestamppb.New(gt),
		Sclk: float64(sec) + (float64(ns) / 1e9),
	}

	return out
}

func (p *TelemValue) ToTelemetry() (*pb.Telemetry, error) {
	return &pb.Telemetry{
		Ref:   p.Def.ToRef(),
		Time:  timeToTimestamp(p.Time),
		Value: p.Value,
	}, nil
}

func (p *LogValue) ToEvent() (*pb.Event, error) {
	args := []*pb.Value{}
	argsAny := []any{}

	fmtString := p.Def.FormatString

	for i, argDef := range p.Def.Arguments {
		arg := p.Args[i]
		if argDef.Name == "Opcode" || argDef.Name == "opCode" {
			cmd := p.Dictionary.Commands.Get2(int32(arg.GetU()))
			if cmd == nil {
				cmd = p.Dictionary.Commands.Get2(int32(arg.GetI()))
			}

			if cmd != nil {
				fmtString = strings.Replace(fmtString, "0x%x", "%x", 1)

				arg = &pb.Value{
					Value: &pb.Value_E{
						E: &pb.EnumValue{
							Formatted: fmt.Sprintf("%s.%s", cmd.Component, cmd.Mnemonic),
							Raw:       int64(cmd.Opcode),
						},
					},
				}
			}
		}

		args = append(args, arg)
		argsAny = append(argsAny, arg)
	}

	return &pb.Event{
		Ref:     p.Def.ToRef(),
		Time:    timeToTimestamp(p.Time),
		Message: fmt.Sprintf(fmtString, argsAny...),
		Args:    args,
	}, nil
}
