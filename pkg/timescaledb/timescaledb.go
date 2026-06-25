package timescaledb

// imports

var (
	_ host.ProfileProvider[Params] = (*timescaledbProvider)(nil)
)

type Params struct {
	Url string `json:"url"`

	DefaultTags []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"defaultTags"`

	// TODO: Add more parameters
}

type timescaleDbProvider struct{}

// Default implements host.ProfileProvider.
func (i *timescaleDbProvider) Default() Params {
	return Params{}
}
