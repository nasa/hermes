package influxdb

import (
	"context"
	"sync"
	"time"

	_ "embed"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
	protocol "github.com/influxdata/line-protocol"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
)

var (
	_ host.ProfileProvider[Params] = (*influxDbProvider)(nil)
)

//go:embed schema.json
var schema string

type Params struct {
	Url string `json:"url"`

	DefaultTags []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"defaultTags"`

	Token  string `json:"token"`
	OrgId  string `json:"orgId"`
	Bucket string `json:"bucket"`
	Ert    bool   `json:"ert"`
}

type influxDbProvider struct{}

// Default implements host.ProfileProvider.
func (i *influxDbProvider) Default() Params {
	return Params{}
}

func metricAsPoint(metric protocol.Metric) *write.Point {
	tags := map[string]string{}
	for _, tag := range metric.TagList() {
		tags[tag.Key] = tag.Value
	}

	fields := map[string]any{}
	for _, field := range metric.FieldList() {
		fields[field.Key] = field.Value
	}

	pt := write.NewPoint(
		metric.Name(),
		tags,
		fields,
		metric.Time(),
	)

	return pt
}

// Start implements host.ProfileProvider.
func (i *influxDbProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	session.Log().Info(
		"connecting to influxdb endpoint",
		"address",
		settings.Url,
	)

	opts := influxdb2.DefaultOptions()
	opts = opts.SetApplicationName("hermes")
	opts = opts.SetFlushInterval(500)
	for _, tag := range settings.DefaultTags {
		opts = opts.AddDefaultTag(tag.Key, tag.Value)
	}

	client := influxdb2.NewClientWithOptions(
		settings.Url,
		settings.Token,
		opts,
	)

	defer client.Close()

	writeAPI := client.WriteAPI(settings.OrgId, settings.Bucket)
	defer writeAPI.Flush()

	session.Started()

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()

		errs := writeAPI.Errors()
		for {
			select {
			case err := <-errs:
				session.Log().Error("influxdb write error", "err", err)
			case <-ctx.Done():
				return
			}
		}
	}()

	session.Log().Info("creating event bus listener to push to influxdb")
	host.Event.On(ctx, func(msg *pb.SourcedEvent) {
		mtr, err := SourcedEventAsMetric(msg)

		if settings.Ert {
			mtr.AddField("ert", time.Now().UnixMilli())
		}

		if err != nil {
			session.Log().Warn("failed to convert event to influxdb metric", "err", err)
		} else {
			writeAPI.WritePoint(metricAsPoint(mtr))
		}
	})

	session.Log().Info("creating telemetry bus listener to push to influxdb")
	host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
		mtr, err := SourcedTelemetryAsMetric(msg)

		if settings.Ert {
			mtr.AddField("ert", time.Now().UnixMilli())
		}

		if err != nil {
			session.Log().Warn("failed to convert telemetry to influxdb metric", "err", err)
		} else {
			writeAPI.WritePoint(metricAsPoint(mtr))
		}
	})

	wg.Wait()
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"InfluxDB",
		&influxDbProvider{},
		schema,
		`{"ui:order": ["url", "token", "orgId", "bucket", "defaultTags", "ert"]}`,
	)

	if err != nil {
		return err
	}

	return nil
}
