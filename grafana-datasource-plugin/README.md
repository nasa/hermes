# Hermes datasource for Grafana

A Grafana datasource, with a Go backend and a TypeScript frontend, that charts the telemetry
[yamcs-recorder](../cmd/yamcs-recorder/README.md) writes to TimescaleDB. The user guide, which Grafana shows on the
plugin's page, is [src/README.md](src/README.md).

## Prerequisites

| Tool                                                        | Version                        |
| ----------------------------------------------------------- | ------------------------------ |
| Node.js                                                     | 22 or newer (see `.nvmrc`)     |
| Go                                                          | 1.26.5 or newer (see `go.mod`) |
| [Mage](https://magefile.org), a make-like build tool for Go | latest                         |
| Docker and Docker Compose                                   | latest                         |

## Develop

### 1. Build the frontend

```bash
npm install
npm run dev       # watch mode, leave it running in its own terminal
```

### 2. Build the backend

```bash
mage -v
```

### 3. Start Grafana and TimescaleDB

```bash
npm run server
```

Grafana runs at [http://localhost:3000](http://localhost:3000) with anonymous admin access. It loads the plugin from
`dist/` and comes with a datasource for the TimescaleDB container (`timescaledb:5432`, database `hermes`). Stop the
root `docker-compose.yml` stack first, since both use ports 3000 and 5432.

The database starts empty. The [yamcs-recorder](../cmd/yamcs-recorder/README.md#run) command fills it, since this
TimescaleDB has the same port, user, password and database as the root `docker-compose.yml`.

## Test and lint

| Command             | Runs                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run test`      | Frontend unit tests (Jest) for changed files, in watch mode                                                              |
| `npm run test:ci`   | All frontend unit tests once                                                                                             |
| `npm run typecheck` | TypeScript type check                                                                                                    |
| `go test ./pkg/...` | Backend tests                                                                                                            |
| `npm run e2e`       | Playwright end-to-end tests against the Grafana from `npm run server`. Run `npx playwright install chromium` once first. |
| `npm run lint`      | ESLint                                                                                                                   |
| `npm run lint:fix`  | ESLint and Prettier, fixing what they can                                                                                |

## Release

Publishing a GitHub release builds the plugin and attaches `nasa-hermes-datasource.zip` to it. A pull request
from a nasa/hermes branch (not a fork) that changes the plugin gets a pre-release tagged
`grafana-plugin-pr-<number>`, linked from a comment on the PR and deleted when the PR closes.

## Layout

| Folder          | Holds                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pkg/`          | Go backend: queries, the dropdown options for parameters, instances and members, and the Save & Test health check |
| `src/`          | Frontend: config and query editors, the SQL builder (`query.ts`), the user guide                                  |
| `provisioning/` | The datasource the dev Grafana starts with                                                                        |
| `tests/`        | Playwright end-to-end tests                                                                                       |

## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). See [LICENSE](LICENSE).
