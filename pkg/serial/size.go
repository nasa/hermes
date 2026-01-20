package serial

import "github.com/nasa/hermes/pkg/pb"

func SizeOfUintKind(kind pb.UIntKind) int64 {
	switch kind {
	case pb.UIntKind_UINT_U8:
		return 1
	case pb.UIntKind_UINT_U16:
		return 2
	case pb.UIntKind_UINT_U32:
		return 4
	case pb.UIntKind_UINT_U64:
		return 8
	}

	return -1
}

func SizeOfIntKind(kind pb.IntKind) int64 {
	switch kind {
	case pb.IntKind_INT_U8:
		return 1
	case pb.IntKind_INT_I8:
		return 1
	case pb.IntKind_INT_U16:
		return 2
	case pb.IntKind_INT_I16:
		return 2
	case pb.IntKind_INT_U32:
		return 4
	case pb.IntKind_INT_I32:
		return 4
	case pb.IntKind_INT_U64:
		return 8
	case pb.IntKind_INT_I64:
		return 8
	}

	return -1
}

func SizeOfFloatKind(kind pb.FloatKind) int64 {
	switch kind {
	case pb.FloatKind_F_F32:
		return 4
	case pb.FloatKind_F_F64:
		return 8
	}

	return -1
}

func SizeOfNumberKind(kind pb.NumberKind) int64 {
	switch kind {
	case pb.NumberKind_NUMBER_I8, pb.NumberKind_NUMBER_U8:
		return 1
	case pb.NumberKind_NUMBER_U16, pb.NumberKind_NUMBER_I16:
		return 2
	case pb.NumberKind_NUMBER_U32, pb.NumberKind_NUMBER_I32, pb.NumberKind_NUMBER_F32:
		return 4
	case pb.NumberKind_NUMBER_U64, pb.NumberKind_NUMBER_I64, pb.NumberKind_NUMBER_F64:
		return 8
	}

	return -1
}

func SizeOfObject(ty *pb.ObjectType) int64 {
	out := int64(0)
	for _, fieldDef := range ty.Fields {
		fs := SizeOf(fieldDef.Type)
		if fs < 0 {
			return -1
		}

		out += fs
	}

	return out
}

func SizeOfArray(ty *pb.ArrayType) int64 {
	switch size := ty.Size.(type) {
	case *pb.ArrayType_Dynamic:
		return -1
	case *pb.ArrayType_Static:
		elSize := SizeOf(ty.ElType)
		if elSize < 0 {
			return -1
		}

		return elSize * int64(size.Static)
	}

	return -1
}

// Attempt to compute the size of a type.
// If the type is dynamic in size such as string or dynamic arrays
// this function will return -1.
func SizeOf(ta *pb.Type) int64 {
	switch ty := ta.Value.(type) {
	case *pb.Type_Bool:
		return SizeOfUintKind(ty.Bool.EncodeType)
	case *pb.Type_Int:
		return SizeOfIntKind(ty.Int.Kind)
	case *pb.Type_Float:
		return SizeOfFloatKind(ty.Float.Kind)
	case *pb.Type_String_:
		// Dynamic size
		return -1
	case *pb.Type_Enum:
		return SizeOfIntKind(ty.Enum.EncodeType)
	case *pb.Type_Bitmask:
		return SizeOfIntKind(ty.Bitmask.EncodeType)
	case *pb.Type_Object:
		return SizeOfObject(ty.Object)
	case *pb.Type_Array:
		return SizeOfArray(ty.Array)
	case *pb.Type_Void:
		return int64(ty.Void.Size)
	}

	// invalid type
	return -1
}
