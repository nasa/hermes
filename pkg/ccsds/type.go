package ccsds

import "github.com/nasa/hermes/pkg/serial"

// CCSDS 4.1.3.5.3: The length count C shall be expressed as:
// C = (Total Number of Octets in the Packet Data Field) – 1
type PayloadLength uint16

func (p PayloadLength) Marshal(w *serial.Writer) error {
	w.U16(uint16(p) - 1)
	return nil
}

func (p *PayloadLength) Unmarshal(r *serial.Reader) error {
	tmp, err := r.U16()
	if err != nil {
		return err
	}

	*p = PayloadLength(tmp + 1)
	return nil
}
