---
icon: fontawesome/solid/box
---

# Installation

The Hermes release on the VS Code Marketplace can't connect to YAMCS yet. This page builds the two parts the
[Quick Start](quick-start.md) needs from source: the yamcs-grpc plugin and the Hermes VS Code extensions.

## Prerequisites

| Tool | Needed for |
| --- | --- |
| [git](https://git-scm.com/) | Getting the code |
| [Docker](https://docs.docker.com/get-docker/), running | Building the yamcs-grpc plugin (no Java or Maven needed) |
| curl and a POSIX shell, such as Git Bash on Windows | Building the yamcs-grpc plugin |
| [VS Code](https://code.visualstudio.com/) 1.98 or newer | The Hermes VS Code extensions |
| [Node.js](https://nodejs.org/) 22 and [Yarn 1](https://classic.yarnpkg.com/en/docs/install) | Running the extensions from the repository |

## Get the code

```sh
git clone --branch v6 https://github.com/nasa/hermes.git
cd hermes
```

On Windows, clone into a Windows folder, for example `C:\Users\me\hermes`. Run this page's commands in Git Bash and
open the folder in VS Code on Windows. The Quick Start runs F Prime in WSL, which sees that folder as
`/mnt/c/Users/me/hermes`.

## Build the yamcs-grpc plugin

The plugin runs inside YAMCS and serves YAMCS's API over gRPC, a protocol for calling a server over the network. The
Hermes VS Code extensions and yamcs-recorder connect to YAMCS through it.

```sh
cd yamcs-grpc-plugin
./build.sh
```

The script ends by printing `built` and the path of the plugin's jar, a packaged Java library. The
`yamcs-grpc-plugin/out/lib/` folder then holds that jar and the gRPC jars it needs. The
[Quick Start](quick-start.md#start-yamcs-with-the-plugin) loads them into YAMCS. To load them into a YAMCS server you
run yourself, see the [plugin README](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin#run).

## Install the VS Code extensions

Hermes comes as three extensions, named here as VS Code lists them:

| Extension | Adds |
| --- | --- |
| Hermes | Notebooks, the telemetry table and plot, the events panel, and the connection to YAMCS |
| Hermes YAMCS | YAMCS command cells |
| Hermes FPrime | F Prime command cells, `.seq` sequence files of timed commands, and F Prime dictionaries, which list the flight software's commands and telemetry |

Running them from the repository is the simpler way. Installing CI builds keeps them in your everyday VS Code.

=== "Run from the repository"

    From the repository root:

    ```sh
    yarn install
    ```

    Then open the repository folder in VS Code. In the **Run and Debug** view (++ctrl+shift+d++), pick the **All**
    configuration and press ++f5++. VS Code builds the extensions and opens a second window, titled
    **[Extension Development Host]**, with all three loaded. Use Hermes in that window.

=== "Install CI builds"

    The [Build VSCode Extensions](https://github.com/nasa/hermes/actions/workflows/build-vscode-extensions.yml)
    workflow packages the extensions. Downloading them needs a GitHub login.

    1. Open a successful run on a pull request into `v6`. It includes that pull request's changes. To build the branch
       alone, start the workflow on `v6` with **Run workflow**, which needs write access to the repository.
    2. Under **Artifacts**, download three files: `hermes-dev-…` for your platform, such as
       `hermes-dev-…-linux-x64` or `hermes-dev-…-win32-x64`, then `hermes-fprime-dev-…` and `hermes-yamcs-dev-…`.
    3. Unzip each one to get its `.vsix` file.
    4. In VS Code, run **Extensions: Install from VSIX...** from the command palette for each `.vsix`. Install Hermes
       first, since the other two depend on it.

## Next steps

- [Quick Start](quick-start.md): connect Hermes to F Prime flight software and send it a command.
