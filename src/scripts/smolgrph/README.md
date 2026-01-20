# Smolgrph

A small script to graph incoming telemetry from a SQLite database to the terminal, using either text blocks or inline images.

## Reqirements

- Python >= 3.6
- Pip
- POSIX compatible shell
- Terminal supporting ANSI escape codes

## Usage

Notes:
- On first startup (and any subsequent startups after a python version change) a python virtual environemnt will be automatically created.
- If a number of minutes is not specified, the default is all the data. This can be very slow.


### Help

``` shell
./smolgrph --help
usage: smolgrph.py [-h] [-i] [-c COMPONENT] [-n NAME] [-t MINUTES] [-r REFRESH] database

A minimal graphing tool for visualizing FSW telemetry

positional arguments:
  database              path to the sqlite database to pull data from

options:
  -h, --help            show this help message and exit
  -i, --image           attempt to use matplotlib graph rendered to the terminal instead of traditional text rendering
  -c, --component COMPONENT
                        component to monitor the telemetry of
  -n, --name NAME       name(s) of the telemetry channels to monitor, supports SQL LIKE syntax
  -t, --minutes MINUTES
                        number of minutes back to visualize the data
  -r, --refresh REFRESH
                        refresh interval, in seconds (default 2.0)
```

### Graph All CPU Telemetry Channels

``` shell
./smolgrph -n 'CPU%' hermes.db -t 2
```

![cpu telemetry channels graphed on the terminal with plotext](https://github.com/nasa/hermes/assets/11726/19edcf03-cf92-442f-a43f-25e1c451e8e2)

Use the `-i` flag to enable image support.

![cpu telemetry channels with full resolution](https://github.com/nasa/hermes/assets/11726/8d62a9a2-daa1-4e70-8ba8-4c2a9fa86668)

### Graph Specific CPU Telemetry Channels

``` shell
./smolgrph -n 'CPU_00' -n 'CPU_01' -t 2 hermes.db
```

![cpu 00 and cpu 01 telemetry channels graphed on the terminal with plotext](https://github.com/nasa/hermes/assets/11726/861da3f5-d24f-4014-8789-83b8cd0694dd)
