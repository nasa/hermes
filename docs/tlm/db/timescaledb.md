---
icon: brands/timescaledb
---

# TimescaleDB

## Manual Local Connection

Hermes offers utilities to manually connect a local hermes backend to a TimescaleDB. In this example, we connect a local hermes backend to a local TimescaleDB instance. First, we start a local TimescaleDB instance via docker at `localhost:5432` with password `password`. Then, we can [start the Hermes backend in local mode](../../getting-started/quick-start.md#starting-the-hermes-backend) with `hermes.host.bind` set to:

```
"hermes.host.bind": {
    "bindType": "tcp"
}
```

Now, we can run the Hermes utility to connect the backend to the database. Compile and execute the code found in [`hermes/cmd/sqlrecord`](https://github.com/nasa/hermes/tree/main/cmd/sqlrecord) with the following command:

```
go run . --postgresql="postgres://postgre@localhost:5432/hermes_db?sslmode=disable"
```

!!! warning "Documentation In Progress"

    This documentation is incomplete while we are migrating from our internal documentation store to the public GitHub.
