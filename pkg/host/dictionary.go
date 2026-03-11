package host

import (
	"context"
	"fmt"
	"maps"
	"sync"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
	"google.golang.org/protobuf/proto"
)

type dualKeyMap[T any] struct {
	c1 map[string]T
	c2 map[int32]T
}

type DictionaryNamespace struct {
	Commands   dualKeyMap[*pb.CommandDef]
	Events     dualKeyMap[*pb.EventDef]
	Telemetry  dualKeyMap[*pb.TelemetryDef]
	Parameters dualKeyMap[*pb.ParameterDef]
	Types      map[string]*pb.Type
}

type Dictionary struct {
	Head     *pb.DictionaryHead
	Content  map[string]*DictionaryNamespace
	Metadata map[string]string
}

func (d *Dictionary) Namespace(ns string) *DictionaryNamespace {
	if c, ok := d.Content[ns]; ok {
		return c
	} else {
		return nil
	}
}

func newDualKeyMap[T any](
	values map[string]T,
	getKey2 func(v T) int32,
) dualKeyMap[T] {
	out := dualKeyMap[T]{
		c1: make(map[string]T),
		c2: make(map[int32]T),
	}

	for key, v := range values {
		out.c1[key] = v
		out.c2[getKey2(v)] = v
	}

	return out
}

// Get value using first (string) key
func (m *dualKeyMap[T]) Get1(name string) T {
	return m.c1[name]
}

// Get value using second (int) key
func (m *dualKeyMap[T]) Get2(name int32) T {
	return m.c2[name]
}

func NewDictionaryNamespace(in *pb.DictionaryNamespace) (*DictionaryNamespace, error) {
	in = proto.Clone(in).(*pb.DictionaryNamespace)

	for _, ty := range in.GetTypes() {
		if err := ty.Resolve(in.GetTypes()); err != nil {
			return nil, fmt.Errorf("failed to resolve type %v: %w", ty, err)
		}
	}

	for _, cmd := range in.GetCommands() {
		for _, field := range cmd.Arguments {
			if err := field.Type.Resolve(in.GetTypes()); err != nil {
				return nil, fmt.Errorf("failed to resolve field %s in command %s.%s: %w", field.Name, cmd.Component, cmd.Mnemonic, err)
			}
		}
	}

	for _, evr := range in.GetEvents() {
		for _, field := range evr.GetArguments() {
			if err := field.Type.Resolve(in.GetTypes()); err != nil {
				return nil, fmt.Errorf("failed to resolve field %s in event %s.%s: %w", field.Name, evr.Component, evr.Name, err)
			}
		}
	}

	for _, tlm := range in.GetTelemetry() {
		if err := tlm.Type.Resolve(in.GetTypes()); err != nil {
			return nil, fmt.Errorf("failed to resolve type in telemetry %s.%s: %w", tlm.Component, tlm.Name, err)
		}
	}

	for _, prm := range in.GetParameters() {
		if err := prm.Type.Resolve(in.GetTypes()); err != nil {
			return nil, fmt.Errorf("failed to resolve type in parameter %s.%s: %w", prm.Component, prm.Name, err)
		}
	}

	ns := &DictionaryNamespace{
		Commands:   newDualKeyMap(in.GetCommands(), func(v *pb.CommandDef) int32 { return v.Opcode }),
		Events:     newDualKeyMap(in.GetEvents(), func(v *pb.EventDef) int32 { return v.Id }),
		Telemetry:  newDualKeyMap(in.GetTelemetry(), func(v *pb.TelemetryDef) int32 { return v.Id }),
		Parameters: newDualKeyMap(in.GetParameters(), func(v *pb.ParameterDef) int32 { return v.Id }),
		Types:      in.GetTypes(),
	}

	return ns, nil
}

func DictionaryFromProto(in *pb.Dictionary) (*Dictionary, error) {
	var err error
	out := &Dictionary{
		Head:     proto.Clone(in.Head).(*pb.DictionaryHead),
		Content:  make(map[string]*DictionaryNamespace),
		Metadata: maps.Clone(in.Metadata),
	}

	for key, value := range in.Content {
		out.Content[key], err = NewDictionaryNamespace(value)
		if err != nil {
			return nil, fmt.Errorf("failed loading namespace '%s': %w", key, err)
		}
	}

	return out, nil
}

type dictionaryRegistry struct {
	statefulImpl[*pb.DictionaryList]

	mux     sync.RWMutex
	logger  log.Logger
	content map[string]*pb.Dictionary
}

func newDictionaryRegistry() *dictionaryRegistry {
	return &dictionaryRegistry{
		mux:     sync.RWMutex{},
		logger:  log.GetLogger(context.TODO()),
		content: map[string]*pb.Dictionary{},
	}
}

func (r *dictionaryRegistry) Add(dict *pb.Dictionary) string {
	// Create a new ID for this dictionary
	var id string
	if dict.Id != "" {
		// Remove any old dictionary
		r.Remove(dict.Id) // ignore error return

		r.logger.Info("adding non-persistent dictionary",
			"id", id,
			"name", dict.Head.GetName(),
			"type", dict.Head.GetType(),
			"version", dict.Head.GetVersion(),
		)

		id = dict.Id
	} else {
		id = util.GenerateShortUID()
		r.logger.Info("adding dictionary",
			"id", id,
			"name", dict.Head.GetName(),
			"type", dict.Head.GetType(),
			"version", dict.Head.GetVersion(),
		)
	}

	r.mux.Lock()
	defer r.mux.Unlock()
	r.content[id] = dict
	r.update()

	return id
}

func (r *dictionaryRegistry) Get(id string) *pb.Dictionary {
	r.mux.RLock()
	defer r.mux.RUnlock()

	return r.content[id]
}

func (r *dictionaryRegistry) All() map[string]*pb.Dictionary {
	r.mux.RLock()
	defer r.mux.RUnlock()

	out := make(map[string]*pb.Dictionary)
	maps.Copy(out, r.content)

	return out
}

func (r *dictionaryRegistry) Load(dicts map[string]*pb.Dictionary) error {
	r.mux.Lock()
	defer r.mux.Unlock()

	r.content = dicts
	r.update()
	return nil
}

func (r *dictionaryRegistry) Remove(id string) error {
	r.mux.Lock()
	defer r.mux.Unlock()

	if dict, ok := r.content[id]; ok {
		r.logger.Info("removing dictionary",
			"id", id,
			"name", dict.Head.GetName(),
			"type", dict.Head.GetType(),
			"version", dict.Head.GetVersion(),
		)

		delete(r.content, id)

		r.update()

		return nil
	} else {
		return fmt.Errorf("dictionary not found: '%s'", id)
	}
}

func (r *dictionaryRegistry) update() {
	ev := &pb.DictionaryList{
		All: map[string]*pb.DictionaryHead{},
	}

	for id, dict := range r.content {
		ev.All[id] = dict.Head
	}

	r.PushUpdate(ev)
}
