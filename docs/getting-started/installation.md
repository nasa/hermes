---
icon: fontawesome/solid/box
---

# Installation

Hermes v6 has no release yet. The Hermes extensions on the VS Code Marketplace are v5, so until v6 is released, build
the parts you need from the `v6` branch.

## Prerequisites

| Tool | Needed for |
| --- | --- |
| [Docker](https://docs.docker.com/get-docker/) | Building the yamcs-grpc plugin, which compiles inside a YAMCS image, so you don't need Java or Maven |
| curl and a POSIX shell (Git Bash or WSL on Windows) | Building the yamcs-grpc plugin |
| [VS Code](https://code.visualstudio.com/) 1.98 or newer | The Hermes extensions |
| [Node.js](https://nodejs.org/) 22 and [Yarn 1](https://classic.yarnpkg.com/en/docs/install) | Running the Hermes extensions from the repository |

## Get the code

```sh
git clone --branch v6 https://github.com/nasa/hermes.git
cd hermes
```

## Build the yamcs-grpc plugin

The plugin runs inside YAMCS and serves YAMCS's API over gRPC. The Hermes extensions and yamcs-recorder connect to
YAMCS through it.

```sh
cd yamcs-grpc-plugin
./build.sh
```

`yamcs-grpc-plugin/out/lib/` then holds the plugin jar and the gRPC jars it needs. The
[Quick Start](quick-start.md#start-yamcs-with-the-plugin) loads them into YAMCS. To run the plugin in stock YAMCS
instead, see the [plugin README](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin#run).

## Install the VS Code extensions

Hermes comes as three extensions:

| Extension | Adds |
| --- | --- |
| Hermes | Notebooks, the telemetry table and plot, the events panel, and the connection to YAMCS |
| Hermes YAMCS | YAMCS command cells |
| Hermes FPrime | F Prime command cells, `.seq` sequences and F Prime dictionaries |

=== "Run from the repository"

    From the repository root:

    ```sh
    yarn install
    ```

    Then open the repository in VS Code, pick the **All** configuration in the Run and Debug view, and press ++f5++.
    VS Code builds the extensions and opens a second window with all three loaded. Use Hermes in that window.

=== "Install CI builds"

    The [Build VSCode Extensions](https://github.com/nasa/hermes/actions/workflows/build-vscode-extensions.yml)
    workflow packages the extensions on pull requests. To build `v6`, start it with **Run workflow**, which needs
    write access to the repository.

    1. Open a run and download three artifacts: `hermes-dev-…` for your platform, such as `hermes-dev-…-linux-x64`,
       then `hermes-fprime-dev-…` and `hermes-yamcs-dev-…`. Each one is a zip holding a `.vsix` file.
    2. In VS Code, run **Extensions: Install from VSIX...** for each `.vsix`. Install Hermes first, since the other two
       depend on it.

## Recording and Grafana

To record telemetry and events and chart them, see [Recording](../tlm/recording.md) and
[Grafana](../tlm/grafana.md).

## Next steps

- [Quick Start](quick-start.md): connect Hermes to an F Prime deployment and send it a command.
