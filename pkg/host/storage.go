package host

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
	"google.golang.org/protobuf/proto"
)

type updateKind int

const (
	storeBoth updateKind = iota
	storeProfiles
	storeDictionaries
)

type Storage struct {
	mux sync.Mutex

	root string

	msg chan updateKind
	wg  sync.WaitGroup

	closed atomic.Bool

	debouncerProfiles     func(func())
	debouncerDictionaries func(func())

	log log.Logger

	previousDictionaries []string
}

func NewStorage(root string) *Storage {
	out := &Storage{
		mux: sync.Mutex{},

		root:                  root,
		msg:                   make(chan updateKind),
		debouncerProfiles:     util.NewDebouncer(1 * time.Second),
		debouncerDictionaries: util.NewDebouncer(5 * time.Second),
		wg:                    sync.WaitGroup{},
		closed:                atomic.Bool{},
		log:                   log.GetLogger(context.TODO()),

		previousDictionaries: []string{},
	}

	out.wg.Add(1)
	go out.eventLoop()
	return out
}

func (s *Storage) Load() error {
	rootStat, err := os.Stat(s.root)
	if err != nil {
		return fmt.Errorf("failed to stat configuration root %s: %w", s.root, err)
	}

	if !rootStat.IsDir() {
		return fmt.Errorf("root path '%s' is not a directory", s.root)
	}

	var config []ProfileConfig

	configFile := path.Join(s.root, "hermes.json")
	_, err = os.Stat(configFile)
	if err != nil {
		if os.IsNotExist(err) {
			s.log.Debug("configuration does not exist, loading empty configuration")
		} else {
			return fmt.Errorf("failed to stat profile configuration file: %w", err)
		}
	} else {
		s.log.Debug("reading configuration file", "path", configFile)
		profileCfg, err := os.ReadFile(configFile)
		if err != nil {
			return fmt.Errorf("failed to read profile configuration (%s): %w", configFile, err)
		}

		err = json.Unmarshal(profileCfg, &config)
		if err != nil {
			return fmt.Errorf("failed to decode profile configuration: %w", err)
		}
	}

	entries, err := os.ReadDir(s.root)
	if err != nil {
		return fmt.Errorf("failed to read root directory: %w", err)
	}

	dictionaries := map[string]*pb.Dictionary{}
	s.previousDictionaries = []string{}

	for _, entry := range entries {
		dictId, isDict := strings.CutSuffix(entry.Name(), ".dictionary.pb")
		if isDict {
			s.log.Debug("reading dictionary file", "id", dictId)
			contents, err := os.ReadFile(path.Join(s.root, entry.Name()))
			if err != nil {
				return fmt.Errorf("failed to read dictionary (%s): %w", dictId, err)
			}

			s.log.Debug("unmarshalling dictionary", "id", dictId)
			var dict pb.Dictionary
			err = proto.Unmarshal(contents, &dict)
			if err != nil {
				return fmt.Errorf("failed to decode dictionary (%s): %w", dictId, err)
			}

			dictionaries[dictId] = &dict
			s.previousDictionaries = append(s.previousDictionaries, dictId)
		}
	}

	s.log.Debug("loading profile state into host state")

	// Load the state into the host state
	err = Profiles.Load(config)
	if err != nil {
		return fmt.Errorf("failed to load profile configuration: %w", err)
	}

	s.log.Debug("loading dictionary state into host state")

	err = Dictionaries.Load(dictionaries)
	if err != nil {
		return fmt.Errorf("failed to load dictionaries: %w", err)
	}

	return nil
}

func (s *Storage) storeProfiles() {
	s.mux.Lock()
	defer s.mux.Unlock()

	profiles := Profiles.Config()

	configFile := path.Join(s.root, "hermes.json")
	profileData, err := json.MarshalIndent(
		profiles,
		"",
		"    ",
	)

	if err != nil {
		s.log.Warn("failed to encode profile configuration json", "err", err)
		return
	}

	s.log.Debug("writing profile config to filesystem", "path", configFile)
	err = os.WriteFile(configFile, profileData, 0666)
	if err != nil {
		s.log.Warn("failed to write profile configuration to filesystem", "err", err, "path", configFile)
		return
	}
}

func (s *Storage) storeDictionaries() {
	s.mux.Lock()
	defer s.mux.Unlock()

	dictionaries := Dictionaries.All()

	// Write out dictionaries
	dicts := []string{}
	for id, dict := range dictionaries {
		dicts = append(dicts, id)

		dictFile := path.Join(s.root, fmt.Sprintf("%s.dictionary.pb", id))
		contents, err := proto.Marshal(dict)
		if err != nil {
			s.log.Warn("failed to encode dictionary", "id", id, "err", err)
			continue
		}

		s.log.Debug("writing dictionary to file", "id", id, "path", dictFile)
		err = os.WriteFile(dictFile, contents, 0666)
		if err != nil {
			s.log.Warn("failed to write dictionary to filesystem", "id", id, "path", dictFile, "err", err)
			return
		}

		dicts = append(dicts, id)
	}

	for _, prevId := range s.previousDictionaries {
		if dictionaries[prevId] == nil {
			dictFile := path.Join(s.root, fmt.Sprintf("%s.dictionary.pb", prevId))
			s.log.Debug("deleting dictionary from filesystem", "id", prevId, "path", dictFile)
			err := os.Remove(dictFile)
			if err != nil {
				s.log.Warn("failed to remove dictionary from filesystem", "id", prevId, "path", dictFile, "err", err)
				return
			}
		}
	}

	s.previousDictionaries = dicts
}

func (s *Storage) eventLoop() {
	defer s.wg.Done()

	for msg := range s.msg {
		switch msg {
		case storeProfiles:
			s.storeProfiles()
		case storeDictionaries:
			s.storeDictionaries()
		case storeBoth:
			s.storeProfiles()
			s.storeDictionaries()
		}
	}
}

func (s *Storage) PushDictionary() {

}

func (s *Storage) Finish() {
	s.closed.Store(true)

	// Force flush the state
	s.msg <- storeBoth
	close(s.msg)

	s.wg.Wait()
}

func (s *Storage) Listen(ctx context.Context) {
	Profiles.ProfileState.Subscribe(ctx, func(m map[string]*pb.StatefulProfile) {
		s.debouncerProfiles(func() {
			if !s.closed.Load() {
				s.msg <- storeProfiles
			}
		})
	})

	Dictionaries.Subscribe(ctx, func(dl *pb.DictionaryList) {
		s.debouncerDictionaries(func() {
			if !s.closed.Load() {
				s.msg <- storeDictionaries
			}
		})
	})
}
