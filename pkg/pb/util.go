package pb

func (e *EventDef) ArgNames() []string {
	out := []string{}
	for _, field := range e.GetArguments() {
		out = append(out, field.Name)
	}

	return out
}

func (e *CommandDef) ArgNames() []string {
	out := []string{}
	for _, field := range e.GetArguments() {
		out = append(out, field.Name)
	}

	return out
}

func (e *EventDef) ToRef() *EventRef {
	return &EventRef{
		Id:         e.GetId(),
		Component:  e.GetComponent(),
		Name:       e.GetName(),
		Severity:   e.GetSeverity(),
		Arguments:  e.ArgNames(),
		Dictionary: "", // TODO(tumbar) Is there an easy way to fill this
	}
}

func (e *TelemetryDef) ToRef() *TelemetryRef {
	return &TelemetryRef{
		Id:         e.GetId(),
		Component:  e.GetComponent(),
		Name:       e.GetName(),
		Dictionary: "", // TODO(tumbar) Is there an easy way to fill this
	}
}
