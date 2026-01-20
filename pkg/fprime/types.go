package fprime

import (
	"fmt"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/serial"
)

type TimeBaseStoreType int64

func rDictionaryIntType(
	r *serial.Reader,
	dict *host.DictionaryNamespace,
	name string,
	def pb.IntKind,
) (int64, error) {
	var kind pb.IntKind
	if dict != nil {
		ty := dict.Types[name]
		if ty != nil {
			iKind := ty.GetInt()
			if iKind != nil {
				kind = iKind.GetKind()
			} else {
				return 0, fmt.Errorf("expected '%s' to be a scalar integer", name)
			}
		} else {
			kind = def
		}
	} else {
		kind = def
	}

	return r.IntKind(kind)
}

func wDictionaryIntType(
	w *serial.Writer,
	dict *host.DictionaryNamespace,
	name string,
	def pb.IntKind,
	value int64,
) error {
	var kind pb.IntKind
	if dict != nil {
		ty := dict.Types[name]
		if ty != nil {
			ikind := ty.GetInt()
			if ikind != nil {
				kind = ikind.GetKind()
			} else {
				return fmt.Errorf("expected '%s' to be a scalar integer", name)
			}
		} else {
			kind = def
		}
	} else {
		kind = def
	}

	return w.IntKind(kind, value)
}

func (t *TimeBaseStoreType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	if !Config.UseTimeBase {
		*t = 0
		return nil
	}

	v, err := rDictionaryIntType(r, dict, "FwTimeBaseStoreType", Config.TimeBaseStoreType)
	if err != nil {
		return err
	}

	*t = TimeBaseStoreType(v)
	return nil
}

func (t TimeBaseStoreType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	if !Config.UseTimeBase {
		return nil
	}

	return wDictionaryIntType(w, dict, "FwTimeBaseStoreType", Config.TimeBaseStoreType, int64(t))
}

type TimeContextStoreType int64

func (t *TimeContextStoreType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	if !Config.UseTimeContext {
		*t = 0
		return nil
	}

	v, err := rDictionaryIntType(r, dict, "FwTimeContextStoreType", Config.TimeContextStoreType)
	if err != nil {
		return err
	}

	*t = TimeContextStoreType(v)
	return nil
}

func (t TimeContextStoreType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	if !Config.UseTimeContext {
		return nil
	}

	return wDictionaryIntType(w, dict, "FwTimeContextStoreType", Config.TimeContextStoreType, int64(t))
}

type EventIdType int64

func (t *EventIdType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	v, err := rDictionaryIntType(r, dict, "FwEventIdType", Config.EventIdType)
	if err != nil {
		return err
	}

	*t = EventIdType(v)
	return nil
}

func (t EventIdType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	return wDictionaryIntType(w, dict, "FwEventIdType", Config.EventIdType, int64(t))
}

type ChanIdType int64

func (t *ChanIdType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	v, err := rDictionaryIntType(r, dict, "FwChanIdType", Config.ChanIdType)
	if err != nil {
		return err
	}

	*t = ChanIdType(v)
	return nil
}

func (t ChanIdType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	return wDictionaryIntType(w, dict, "FwChanIdType", Config.ChanIdType, int64(t))
}

type PacketDescriptorType int64

func (t *PacketDescriptorType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	v, err := rDictionaryIntType(r, dict, "FwPacketDescriptorType", Config.PacketDescriptorType)
	if err != nil {
		return err
	}

	*t = PacketDescriptorType(v)
	return nil
}

func (t PacketDescriptorType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	return wDictionaryIntType(w, dict, "FwPacketDescriptorType", Config.PacketDescriptorType, int64(t))
}

type TlmPacketizeIdType int64

func (t *TlmPacketizeIdType) Unmarshal(r *serial.Reader, dict *host.DictionaryNamespace) error {
	v, err := rDictionaryIntType(r, dict, "FwTlmPacketizeIdType", Config.TlmPacketizeIdType)
	if err != nil {
		return err
	}

	*t = TlmPacketizeIdType(v)
	return nil
}

func (t TlmPacketizeIdType) Marshal(w *serial.Writer, dict *host.DictionaryNamespace) error {
	return wDictionaryIntType(w, dict, "FwTlmPacketizeIdType", Config.TlmPacketizeIdType, int64(t))
}
