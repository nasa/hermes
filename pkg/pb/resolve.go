package pb

import (
	"errors"
	"fmt"
)

func (t *Type) Resolve(types map[string]*Type) error {
	switch ty := t.Value.(type) {
	case *Type_Ref:
		name := ty.Ref.GetName()
		if referencedType, ok := types[name]; ok {
			if !referencedType.ProtoReflect().IsValid() {
				return fmt.Errorf("type name '%s' invalid", name)
			}

			t.Value = referencedType.Value
			if !t.ProtoReflect().IsValid() {
				return fmt.Errorf("type name '%s' invalid", name)
			}
		} else {
			return fmt.Errorf("type name %s not found", name)
		}
	case *Type_Array:
		return ty.Array.GetElType().Resolve(types)
	case *Type_Object:
		errs := []error{}
		for _, field := range ty.Object.Fields {
			if err := field.Type.Resolve(types); err != nil {
				errs = append(errs, fmt.Errorf("%s: %w", field.Name, err))
			}
		}

		return errors.Join(errs...)
	}

	return nil
}
