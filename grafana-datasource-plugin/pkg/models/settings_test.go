package models

import (
	"encoding/json"
	"testing"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

func TestLoadPluginSettings(t *testing.T) {
	t.Run("unmarshals all fields correctly", func(t *testing.T) {
		jsonData, _ := json.Marshal(map[string]any{
			"host":     "localhost:5432",
			"user":     "postgres",
			"database": "hermes",
		})

		settings, err := LoadPluginSettings(backend.DataSourceInstanceSettings{
			JSONData: jsonData,
			DecryptedSecureJSONData: map[string]string{
				"password": "secret",
			},
		})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if settings.Host != "localhost:5432" {
			t.Errorf("expected Host 'localhost:5432', got '%s'", settings.Host)
		}
		if settings.User != "postgres" {
			t.Errorf("expected User 'postgres', got '%s'", settings.User)
		}
		if settings.Database != "hermes" {
			t.Errorf("expected Database 'hermes', got '%s'", settings.Database)
		}
		if settings.Secrets.Password != "secret" {
			t.Errorf("expected Password 'secret', got '%s'", settings.Secrets.Password)
		}
	})

	t.Run("handles empty optional fields", func(t *testing.T) {
		jsonData, _ := json.Marshal(map[string]any{
			"host":     "localhost:5432",
			"database": "hermes",
		})

		settings, err := LoadPluginSettings(backend.DataSourceInstanceSettings{
			JSONData:                jsonData,
			DecryptedSecureJSONData: map[string]string{},
		})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if settings.User != "" {
			t.Errorf("expected User '', got '%s'", settings.User)
		}
		if settings.Secrets.Password != "" {
			t.Errorf("expected Password '', got '%s'", settings.Secrets.Password)
		}
	})

	t.Run("returns error on invalid JSON", func(t *testing.T) {
		_, err := LoadPluginSettings(backend.DataSourceInstanceSettings{
			JSONData:                []byte("{invalid}"),
			DecryptedSecureJSONData: map[string]string{},
		})

		if err == nil {
			t.Fatal("expected error for invalid JSON, got nil")
		}
	})
}
