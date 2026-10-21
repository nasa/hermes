---
icon: fontawesome/solid/box
---

# Installation

Hermes can be installed in multiple ways depending on your use case. For most users, the VSCode extension from the marketplace is the recommended approach. To command flight software you also need the yamcs-grpc plugin, which runs inside YAMCS.

## VSCode Marketplace (Recommended)

The easiest way to install Hermes is through the [Visual Studio Code](https://code.visualstudio.com/) [marketplace](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes)

1. [Install](https://code.visualstudio.com/) & Open Visual Studio Code 1.98 or newer
2. Go to the Extensions view (`Cmd+Shift+X` on macOS, `Ctrl+Shift+X` on Windows/Linux)
3. Search for "Hermes"
4. Install the **Hermes** extension (ID: `jet-propulsion-laboratory.hermes`)
5. Optionally, install the **Hermes FPrime** [extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes-fprime) for F' framework support.

**What's included:**

- Complete VSCode integration with telemetry viewers, command interfaces, and sequence editors

## GitHub Releases (for automation or offline environments)

If you need a specific version or want to install manually:

1. Go to the [Hermes releases page](https://github.com/nasa/hermes/releases)
2. Download `hermes-v<version>.vsix`
3. Optionally download `hermes-fprime-v<version>.vsix` for F' support
4. Install the extension(s), Hermes first, since Hermes FPrime depends on it:
   ```bash
   code --install-extension hermes-v<version>.vsix
   code --install-extension hermes-fprime-v<version>.vsix
   ```

## yamcs-grpc Plugin

The plugin runs inside YAMCS and serves YAMCS's API over gRPC, a protocol for calling a server over the network. The
Hermes VS Code extensions and yamcs-recorder connect to YAMCS through it.

1. From the [latest release](https://github.com/nasa/hermes/releases/latest), download `yamcs-grpc-v<version>.zip`.
2. Unzip it into a folder of its own, such as `yamcs-grpc`. That folder holds the plugin's jar (a packaged Java
   library) and the gRPC jars it needs.

The [Quick Start](quick-start.md#running-your-f-prime-deployment) loads these jars into YAMCS with fprime-yamcs. For a
YAMCS server you run yourself, copy them into the `lib/ext` folder of your YAMCS installation, then restart YAMCS so it
loads them. The plugin needs no entry in `yamcs.yaml`.

## Next Steps

- [Getting Started Guide](./quick-start.md) - Connect Hermes to your flight software through YAMCS
- [Core Concepts](../arch/core-concepts.md) - Learn about Hermes Core Concepts and Design Patterns
- [Telemetry Monitoring](../tlm/index.md) - Setup your monitoring infrastructure
