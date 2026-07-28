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

func (e *EventDef) ToRef(dictId string, dictVersion string) *EventRef {
	return &EventRef{
		Id:         e.GetId(),
		Component:  e.GetComponent(),
		Name:       e.GetName(),
		Severity:   e.GetSeverity(),
		Arguments:  e.ArgNames(),
		Dictionary: dictId,
		Version:    dictVersion,
	}
}

func (e *TelemetryDef) ToRef(dictId string, dictVersion string) *TelemetryRef {
	return &TelemetryRef{
		Id:         e.GetId(),
		Component:  e.GetComponent(),
		Name:       e.GetName(),
		Dictionary: dictId,
		Version:    dictVersion,
	}
}
