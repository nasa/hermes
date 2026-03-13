# Hermes Task System

This document describes the task system in Hermes, including built-in task types and how to compose them using VSCode's task dependencies.

## Task Types

### Core Task Types

These task types are provided by the core Hermes extension and work with any flight software framework.

#### `hermes-load-dictionary`

Loads a dictionary using a registered dictionary provider.

**Parameters:**
- `loader` (string, required): Dictionary provider ID (e.g., "fprime.json", "fprime.xml")
- `file` (string, required): Path to the dictionary file
- `id` (string, optional): Dictionary ID to use (defaults to dictionary name)

**Example:**
```json
{
  "label": "Load Dictionary",
  "type": "hermes-load-dictionary",
  "loader": "fprime.json",
  "file": "${workspaceFolder}/build-artifacts/Darwin/Ref/dict/RefTopologyAppDictionary.json"
}
```

#### `hermes-create-profile`

Creates and optionally starts a Hermes profile.

**Parameters:**
- `name` (string, required): Profile name
- `provider` (string, required): Profile provider type (e.g., "FPrime Server", "FPrime Client")
- `settings` (object or string, required): Provider-specific settings
- `autoStart` (boolean, optional): Whether to start the profile after creation (default: true)

**Example:**
```json
{
  "label": "Create Profile",
  "type": "hermes-create-profile",
  "name": "Ref",
  "provider": "FPrime Server",
  "settings": {
    "name": "Ref",
    "address": "0.0.0.0:50000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "autoStart": true
}
```

## Dictionary Loading

Dictionaries are loaded automatically from your workspace:

1. **Auto-discovery**: Hermes searches for `build-artifacts/**/dict/*.json` files on startup
2. **File watching**: Dictionary changes are detected and reloaded automatically
3. **Manual paths**: Add custom dictionary paths in settings with loader specification

Example settings.json:
```json
{
  "hermes.dictionaries": [
    {
      "loader": "fprime.json",
      "file": "/path/to/custom/dict.json",
      "id": "CustomDict"
    }
  ]
}
```

No manual task required - dictionaries are always available for profiles to reference.

## Composing Tasks with Dependencies

VSCode's task system supports dependencies, allowing you to compose complex workflows from simple building blocks. The F Prime extension auto-discovers your deployments and creates individual tasks for each step, making composition easy.

### Quick Start: Using Auto-Discovered Tasks

The simplest way to compose tasks is to reference the auto-discovered tasks by their label. For example, if you have a deployment named "Ref", you'll automatically get these tasks:
- `Ref: Create Profile`
- `Ref: Start FSW (Local)`

Create a `.vscode/tasks.json` file to compose them:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Deploy Ref",
      "dependsOn": [
        "Ref: Create Profile",
        "Ref: Start FSW (Local)"
      ],
      "dependsOrder": "sequence"
    }
  ]
}
```

That's it! Run "Deploy Ref" and it will execute all three steps in order.

### Example: Full F Prime Deployment (Manual)

If you need more control or want to customize the tasks, you can define them manually in your `.vscode/tasks.json` file:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Load Ref Dictionary",
      "type": "hermes-load-dictionary",
      "loader": "fprime.json",
      "file": "${workspaceFolder}/build-artifacts/Darwin/Ref/dict/RefTopologyAppDictionary.json",
      "problemMatcher": []
    },
    {
      "label": "Create Ref Profile",
      "type": "hermes-create-profile",
      "name": "Ref",
      "provider": "FPrime Server",
      "settings": {
        "name": "Ref",
        "address": "0.0.0.0:50000",
        "dictionary": "Ref",
        "protocol": "ccsds"
      },
      "autoStart": true,
      "dependsOn": ["Load Ref Dictionary"],
      "problemMatcher": []
    },
    {
      "label": "Start Ref FSW",
      "type": "shell",
      "command": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 50000",
      "dependsOn": ["Create Ref Profile"],
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Deploy Ref",
      "dependsOn": ["Start Ref FSW"],
      "dependsOrder": "sequence",
      "problemMatcher": []
    }
  ]
}
```

### Task Execution Order

With the above configuration:

1. **"Deploy Ref"** task triggers
2. **"Load Ref Dictionary"** runs first (dependency of "Create Ref Profile")
3. **"Create Ref Profile"** runs second (dependency of "Start Ref FSW")
4. **"Start Ref FSW"** runs last
5. **"Deploy Ref"** completes when all dependencies finish

### Benefits of Task Composition

1. **Modularity**: Each task does one thing well
2. **Reusability**: Tasks can be reused in different compositions
3. **Flexibility**: Easy to add/remove steps or change the order
4. **Debugging**: Can run individual tasks for troubleshooting
5. **Customization**: Easy to add custom steps between standard tasks

### Common Patterns with Auto-Discovered Tasks

#### Deploy Multiple Deployments in Parallel

```json
{
  "label": "Deploy All Deployments",
  "dependsOn": [
    "Ref: Start FSW",
    "MyComponent: Start FSW",
    "TestHarness: Start FSW"
  ],
  "dependsOrder": "parallel"
}
```

#### Add Pre-Flight Checks

```json
{
  "label": "Pre-Flight Checks",
  "type": "shell",
  "command": "./scripts/check-system.sh"
},
{
  "label": "Deploy Ref with Checks",
  "dependsOn": [
    "Pre-Flight Checks",
    "Ref: Load Dictionary",
    "Ref: Create Profile",
    "Ref: Start FSW"
  ],
  "dependsOrder": "sequence"
}
```

#### Use Client Mode Instead of Server Mode

```json
{
  "label": "Ref Client Mode Profile",
  "type": "hermes-create-profile",
  "name": "RefClient",
  "provider": "FPrime Client",
  "settings": {
    "name": "RefClient",
    "address": "localhost:50000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "autoStart": true
},
{
  "label": "Deploy Ref Client Mode",
  "dependsOn": [
    "Ref: Load Dictionary",
    "Ref Client Mode Profile",
    "Ref: Start FSW"
  ],
  "dependsOrder": "sequence"
}
```

#### Load Only the Dictionary (No Profile or FSW)

Just run the auto-discovered task `Ref: Load Dictionary` directly from the task picker, or reference it:

```json
{
  "label": "Load All Dictionaries",
  "dependsOn": [
    "Ref: Load Dictionary",
    "MyComponent: Load Dictionary"
  ],
  "dependsOrder": "parallel"
}
```

### Manual Task Definition Patterns

If you need more control beyond what auto-discovery provides, you can define tasks manually.

#### Server Mode (FSW connects to GDS)

```json
{
  "type": "hermes-create-profile",
  "name": "MyDeployment",
  "provider": "FPrime Server",
  "settings": {
    "name": "MyDeployment",
    "address": "0.0.0.0:8000",
    "dictionary": "MyDeployment",
    "protocol": "ccsds"
  }
}
```

#### Client Mode (GDS connects to FSW)

```json
{
  "type": "hermes-create-profile",
  "name": "MyDeployment",
  "provider": "FPrime Client",
  "settings": {
    "name": "MyDeployment",
    "address": "localhost:8000",
    "dictionary": "MyDeployment",
    "protocol": "ccsds"
  }
}
```

#### Loading Multiple Dictionaries

```json
{
  "label": "Load All Dictionaries",
  "dependsOn": [
    "Load Deployment A Dictionary",
    "Load Deployment B Dictionary"
  ],
  "dependsOrder": "parallel"
}
```

#### Custom Pre-Flight Checks

```json
{
  "label": "Pre-Flight Checks",
  "type": "shell",
  "command": "echo 'Running pre-flight checks...' && ./scripts/check-system.sh",
  "problemMatcher": []
},
{
  "label": "Deploy with Checks",
  "dependsOn": [
    "Pre-Flight Checks",
    "Load Dictionary",
    "Create Profile",
    "Start FSW"
  ],
  "dependsOrder": "sequence"
}
```

## Custom FSW Deployment Tasks

The auto-discovered "Start FSW (Local)" task is a template for running a local binary. You'll typically need to create custom FSW tasks in your `.vscode/tasks.json` for your specific deployment scenario:

### Example: Simulator Deployment
```json
{
  "label": "Ref: Start FSW (Simulator)",
  "type": "shell",
  "command": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 50000 --sim",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Hardware Deployment via Flash
```json
{
  "label": "Ref: Deploy to Hardware",
  "type": "shell",
  "command": "fprime-util flash --port /dev/ttyUSB0 && fprime-util connect",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Remote Testbed
```json
{
  "label": "Ref: Start FSW (Testbed)",
  "type": "shell",
  "command": "ssh testbed 'cd /opt/fsw && ./Ref -a 0.0.0.0 -p 50000'",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Custom Toolchain (ARM)
```json
{
  "label": "Ref: Start FSW (ARM)",
  "type": "shell",
  "command": "${workspaceFolder}/build-artifacts/arm-linux-gnueabihf/Ref/bin/Ref -a 0.0.0.0 -p 50000",
  "isBackground": true,
  "problemMatcher": []
}
```

Then compose with profile creation:
```json
{
  "label": "Deploy Ref to Hardware",
  "dependsOn": [
    "Ref: Create Profile",
    "Ref: Deploy to Hardware"
  ],
  "dependsOrder": "sequence"
}
```

## Task Discovery

The F Prime extension automatically discovers F Prime deployments in your workspace and creates multiple tasks for each deployment:

### Auto-Discovered Tasks

For each deployment found in `build-artifacts/<toolchain>/<deployment>/`, the following tasks are created:

1. **`<DeploymentName>: Create Profile`** - Creates and starts a profile (type: `hermes-create-profile`, background task)
2. **`<DeploymentName>: Start FSW (Local)`** - Template task for starting local binary (type: `shell`, background task)

**Note:** Tasks are discovered for all toolchains in `build-artifacts/`, not just the current platform. This allows you to see all available deployments across different build configurations.

**Important:** The "Start FSW (Local)" task is a template based on detecting a local binary. You will typically need to customize this task in your `.vscode/tasks.json` for your specific deployment workflow:
- Custom toolchains (baremetal, cross-compile, simulator)
- Hardware deployment (flashing, bootloader, JTAG)
- Remote/testbed deployment
- Custom FSW arguments and environment

### Using Auto-Discovered Tasks

You can reference these tasks in your `.vscode/tasks.json` file by their label:

```json
{
  "label": "Deploy Ref",
  "dependsOn": [
    "Ref: Create Profile",
    "Ref: Start FSW (Local)"
  ],
  "dependsOrder": "sequence"
}
```

### Finding Available Tasks

To see all available tasks:
1. Open the Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
2. Run "Tasks: Run Task"
3. Select a task from the list

The auto-discovered tasks will appear with their deployment name prefix (e.g., "Ref: Create Profile").

## Variables

You can use VSCode variables in task definitions:

- `${workspaceFolder}`: The workspace root folder
- `${file}`: The currently opened file
- `${fileBasename}`: The currently opened file's basename
- `${fileDirname}`: The currently opened file's directory
- `${env:VAR}`: Environment variable

Example:
```json
{
  "file": "${workspaceFolder}/build-artifacts/${env:FPRIME_PLATFORM}/Ref/dict/RefTopologyAppDictionary.json"
}
```

## Best Practices

1. **Use task composition for custom deployments**: Don't create monolithic tasks; compose from smaller tasks
2. **Set `dependsOrder` to "sequence"**: Ensures tasks run in the correct order
3. **Mark long-running tasks as background**: Use `"isBackground": true` for FSW tasks
4. **Add problem matchers**: Use `"problemMatcher": []` to suppress warnings if no patterns are needed
5. **Use variables**: Make tasks portable across different machines using `${workspaceFolder}` and other variables
6. **Document custom tasks**: Add comments in your tasks.json explaining what each task does

## Troubleshooting

### Task not found

If a task type is not recognized, ensure the relevant extension is installed:
- `hermes-load-dictionary`, `hermes-create-profile`: Core Hermes extension
- `fprime-start-fsw`, `fprime-deployment`: F Prime extension

### Dependencies not running

Ensure `dependsOrder` is set to `"sequence"` for sequential execution:
```json
{
  "dependsOn": ["Task1", "Task2"],
  "dependsOrder": "sequence"
}
```

### Task fails silently

Check the Terminal panel for task output. Tasks write logs to their respective terminals.

### Dictionary not found

Verify the dictionary file path is correct and the file exists. Use `${workspaceFolder}` for portable paths.

### Profile creation fails

Ensure:
1. The dictionary was loaded first (use `dependsOn`)
2. The dictionary ID matches the one loaded
3. The backend is running (check status bar)
4. The profile provider name is correct (case-sensitive)

## See Also

- [VSCode Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [Task Variables](https://code.visualstudio.com/docs/editor/variables-reference)
- Example tasks: `.vscode/fprime-tasks.example.json`
