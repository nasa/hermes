---
icon: fontawesome/solid/box
---

# Installation

To command flight software from VS Code, you need two parts of Hermes: the Hermes VS Code extensions, and the
yamcs-grpc plugin, which runs inside YAMCS. Both come with each
[Hermes release](https://github.com/nasa/hermes/releases/latest).

## Install the VS Code extensions

Hermes comes as two extensions, named here as VS Code lists them:

| Extension | Adds |
| --- | --- |
| [Hermes](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes) | Notebooks with YAMCS command cells, the telemetry table and plot, the events panel, and the connection to YAMCS |
| [Hermes FPrime](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes-fprime) | F Prime command cells, `.seq` sequence files of timed commands, and F Prime dictionaries, which list the flight software's commands and telemetry |

Hermes FPrime is optional, but the [Quick Start](quick-start.md) uses it. Hermes needs
[VS Code](https://code.visualstudio.com/) 1.98 or newer.

=== "VS Code Marketplace (recommended)"

    1. Open the Extensions view in VS Code (++ctrl+shift+x++, or ++cmd+shift+x++ on macOS).
    2. Search for "Hermes".
    3. Install **Hermes**, then **Hermes FPrime** if you want F Prime command cells.

=== "GitHub release"

    Use the release files to install a specific version, or on a computer that can't reach the Marketplace.

    1. On the [releases page](https://github.com/nasa/hermes/releases), download these files from one release:
        - `hermes-v<version>-<platform>.vsix`, where `<platform>` is `linux-x64`, `linux-arm64`, `darwin-x64` (Intel
          Mac), `darwin-arm64` (Apple silicon Mac), `win32-x64` or `win32-arm64`
        - `hermes-fprime-v<version>.vsix`, if you want Hermes FPrime
    2. In a terminal, go to the folder you downloaded them to. Install Hermes first, since Hermes FPrime depends on it:

        ```sh
        code --install-extension hermes-v<version>-<platform>.vsix
        code --install-extension hermes-fprime-v<version>.vsix
        ```

        You can also install each file from VS Code, with **Extensions: Install from VSIX...** in the command palette.

## Download the yamcs-grpc plugin

The plugin runs inside YAMCS and serves YAMCS's API over gRPC, a protocol for calling a server over the network. The
Hermes VS Code extensions and yamcs-recorder connect to YAMCS through it.

1. From the [latest release](https://github.com/nasa/hermes/releases/latest), download `yamcs-grpc-v<version>.zip`.
2. Unzip it into a folder of its own, such as `yamcs-grpc`. That folder holds the plugin's jar (a packaged Java
   library) and the gRPC jars it needs.

The [Quick Start](quick-start.md#start-yamcs-with-the-plugin) loads these jars into YAMCS with fprime-yamcs. For a
YAMCS server you run yourself, copy them into the `lib/ext` folder of your YAMCS installation, then restart YAMCS so it
loads them. The plugin needs no entry in `yamcs.yaml`.

## Next steps

- [Quick Start](quick-start.md): connect Hermes to F Prime flight software and send it a command.
- [Recording from YAMCS](../tlm/recording.md), optional: download yamcs-recorder to record telemetry and events, and
  chart them in Grafana with the Hermes datasource.
