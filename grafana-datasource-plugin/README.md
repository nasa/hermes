# Hermes-Datasource

A [Grafana](https://grafana.com/) backend datasource plugin that connects to [TimescaleDB](https://www.timescale.com/) to query and visualize **telemetry** and **event** data from NASA's Hermes flight software system.

For end-user documentation (configuration, query editor usage, etc.), see the [plugin catalog README](src/README.md).

## Prerequisites

| Tool                    | Version              |
| ----------------------- | -------------------- |
| Node.js                 | >= 22 (see `.nvmrc`) |
| Go                      | >= 1.26              |
| Mage                    | latest               |
| Docker & Docker Compose | latest               |

## Local Development

### 1. Start the dev environment

Docker Compose starts Grafana and a TimescaleDB instance with the plugin auto-provisioned:

```bash
npm run server
```

Grafana will be available at [http://localhost:3000](http://localhost:3000) (default login: `admin` / `admin`). The datasource is pre-configured to connect to the TimescaleDB container (`timescaledb:5432`, database `hermes`).

### 2. Build the frontend

```bash
npm install
npm run dev       # watch mode
```

### 3. Build the backend

```bash
mage -v
```

### 4. Run tests

```bash
# Frontend (Jest, watch mode)
npm run test

# Frontend (CI, single run)
npm run test:ci

# Backend (Go)
go test ./pkg/...

# E2E (Playwright — requires the dev server to be running)
npm run e2e
```

### 5. Lint

```bash
npm run lint
npm run lint:fix
```

## Release

The Grafana plugin is released together with the VSCode extensions as part of the unified release process. Releasing a tag with the `v*` prefix (e.g., `v4.1.0`) will trigger a release build that includes both the VSCode extensions and the Grafana plugin. The workflow creates a release with all artifacts attached.

## Project Structure

```
pkg/
  main.go                  # Plugin entrypoint
  models/                  # Settings types and parsing
  plugin/
    datasource.go          # Instance lifecycle, health check
    query.go               # Telemetry & event query execution
    resources.go           # REST resource handlers (components, channels, etc.)
provisioning/
  datasources/
    datasources.yml        # Auto-provisioned datasource for local dev
src/
  components/
    ConfigEditor.tsx       # Datasource configuration form
    QueryEditor.tsx        # Query editor UI
  datasource.ts            # Frontend datasource class
  query.ts                 # SQL query builder (frontend)
  types.ts                 # Shared TypeScript types
  plugin.json              # Plugin metadata
  README.md                # Plugin catalog README (user-facing)
```

## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) — see [LICENSE](LICENSE) for details.
