package pb

func (x *EnumType) GetFromValue(value int32) *EnumItem {
	for _, item := range x.Items {
		if value == item.Value {
			return item
		}
	}

	return nil
}
