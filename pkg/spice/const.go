package spice

type KernelType string

const (
	// Binary Kernels:
	SPK   KernelType = "DAF/SPK"
	CK    KernelType = "DAF/CK"
	DSK   KernelType = "DAS/DSK"
	PCK_B KernelType = "DAF/PCK"
	EK    KernelType = "DAS/EK"

	// Text Kernels:
	FK    KernelType = "KPL/FK"
	IK    KernelType = "KPL/IK"
	LSK   KernelType = "KPL/LSK"
	MK    KernelType = "KPL/MK"
	PCK_T KernelType = "KPL/PCK"
	SCLK  KernelType = "KPL/SCLK"
)
