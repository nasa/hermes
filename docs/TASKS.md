# Hermes Task System

This document describes the task system in Hermes, including built-in task types and how to compose them using VSCode's task dependencies.

## Task Types

### F Prime Extension Task Types

#### `hermes-fprime-deployment`

Creates a profile and optionally starts FSW for an F Prime deployment.

**Parameters:**
- `title` (string, required): Profile name / deployment title
- `profileProvider` (string, required): Profile provider type ("FPrime Server" or "FPrime Client")
- `profileSettings` (object, required): Profile settings
  - `name` (string): Profile name
  - `address` (string): Network address (e.g., "0.0.0.0:50000")
  - `dictionary` (string): Dictionary ID to use
  - `protocol` (string): Protocol type (e.g., "ccsds")
- `fswCommand` (string, optional): FSW command to execute after profile creation

**Example:**
```json
{
  "label": "Deploy Ref",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:50000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 50000"
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

The simplest way to use an F Prime deployment is to run the auto-discovered task directly from the task picker. For example, if you have a deployment named "Ref", you'll automatically get:
- `Ref: Deploy` - Creates profile and starts FSW

Just run the task from the Command Palette:
1. Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
2. Run "Tasks: Run Task"
3. Select "Ref: Deploy"

The task will:
1. Create and start a profile for the deployment
2. Start the FSW binary (if available)
3. Keep running until you terminate it

If you need to customize the deployment workflow (different port, custom FSW command, etc.), create a custom task in your `.vscode/tasks.json` file using the `hermes-fprime-deployment` task type.

### Example: Customizing F Prime Deployment

If you need to customize the auto-discovered task, you can define a manual task in your `.vscode/tasks.json` file:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Deploy Ref (Custom)",
      "type": "hermes-fprime-deployment",
      "title": "Ref",
      "profileProvider": "FPrime Server",
      "profileSettings": {
        "name": "Ref",
        "address": "0.0.0.0:8000",
        "dictionary": "Ref",
        "protocol": "ccsds"
      },
      "fswCommand": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 8000",
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}
```

### Task Execution

When the task runs:

1. Creates and starts a profile named "Ref"
2. If `fswCommand` is provided, starts the FSW binary
3. Pipes FSW stdout/stderr to the terminal
4. Keeps running until FSW exits or you terminate it
5. Automatically stops the profile when the task is terminated

### Benefits of Task Composition

1. **Modularity**: Each deployment task is self-contained and handles profile + FSW lifecycle
2. **Reusability**: Tasks can be reused in different compositions (parallel deployments, custom workflows)
3. **Flexibility**: Easy to customize FSW commands, ports, and connection modes
4. **Debugging**: Can run individual deployment tasks for troubleshooting
5. **Customization**: Easy to add custom pre/post steps (logging, health checks, cleanup)

### Common Patterns with Auto-Discovered Tasks

#### Deploy Multiple Deployments in Parallel

```json
{
  "label": "Deploy All Deployments",
  "dependsOn": [
    "Ref: Deploy",
    "MyComponent: Deploy",
    "TestHarness: Deploy"
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
    "Ref: Deploy"
  ],
  "dependsOrder": "sequence"
}
```

#### Profile Only (No FSW)

To create a profile without starting FSW, omit the `fswCommand` parameter:

```json
{
  "label": "Ref Profile Only",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "problemMatcher": []
}
```

#### Use Client Mode Instead of Server Mode

```json
{
  "label": "Deploy Ref Client Mode",
  "type": "hermes-fprime-deployment",
  "title": "RefClient",
  "profileProvider": "FPrime Client",
  "profileSettings": {
    "name": "RefClient",
    "address": "localhost:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 8000",
  "isBackground": true,
  "problemMatcher": []
}
```

### Manual Task Definition Patterns

If you need more control beyond what auto-discovery provides, you can define tasks manually.

#### Server Mode (FSW connects to GDS)

```json
{
  "label": "Deploy MyDeployment (Server)",
  "type": "hermes-fprime-deployment",
  "title": "MyDeployment",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "MyDeployment",
    "address": "0.0.0.0:8000",
    "dictionary": "MyDeployment",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/path/to/MyDeployment -a 0.0.0.0 -p 8000",
  "isBackground": true,
  "problemMatcher": []
}
```

#### Client Mode (GDS connects to FSW)

```json
{
  "label": "Deploy MyDeployment (Client)",
  "type": "hermes-fprime-deployment",
  "title": "MyDeployment",
  "profileProvider": "FPrime Client",
  "profileSettings": {
    "name": "MyDeployment",
    "address": "localhost:8000",
    "dictionary": "MyDeployment",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/path/to/MyDeployment -a 0.0.0.0 -p 8000",
  "isBackground": true,
  "problemMatcher": []
}
```

#### Deploying Multiple FSW Instances

```json
{
  "label": "Deploy All",
  "dependsOn": [
    "Deploy FSW A",
    "Deploy FSW B"
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
    "MyDeployment: Deploy"
  ],
  "dependsOrder": "sequence"
}
```

## Custom FSW Deployment Scenarios

The auto-discovered deployment task uses a basic local binary command. You'll typically need to create custom tasks in your `.vscode/tasks.json` for your specific deployment scenario:

### Example: Simulator Deployment
```json
{
  "label": "Ref: Deploy (Simulator)",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/build-artifacts/Darwin/Ref/bin/Ref -a 0.0.0.0 -p 8000 --sim",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Hardware Deployment via Flash
```json
{
  "label": "Ref: Deploy to Hardware",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "fprime-util flash --port /dev/ttyUSB0 && fprime-util connect",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Remote Testbed
```json
{
  "label": "Ref: Deploy (Testbed)",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "ssh testbed 'cd /opt/fsw && ./Ref -a 0.0.0.0 -p 8000'",
  "isBackground": true,
  "problemMatcher": []
}
```

### Example: Custom Toolchain (ARM)
```json
{
  "label": "Ref: Deploy (ARM)",
  "type": "hermes-fprime-deployment",
  "title": "Ref",
  "profileProvider": "FPrime Server",
  "profileSettings": {
    "name": "Ref",
    "address": "0.0.0.0:8000",
    "dictionary": "Ref",
    "protocol": "ccsds"
  },
  "fswCommand": "${workspaceFolder}/build-artifacts/arm-linux-gnueabihf/Ref/bin/Ref -a 0.0.0.0 -p 8000",
  "isBackground": true,
  "problemMatcher": []
}
```

## Task Discovery

The F Prime extension automatically discovers F Prime deployments in your workspace and creates tasks for each deployment:

### Auto-Discovered Tasks

For each deployment found in `build-artifacts/<toolchain>/<deployment>/` with a valid dictionary file, the following task is created:

**`<DeploymentName>: Deploy`** - Combined task that creates a profile and optionally starts FSW (type: `hermes-fprime-deployment`, background task)

This auto-discovered task:
- Creates and starts a profile for the deployment
- Starts the local FSW binary (if available) at the default port starting from 8000 (incrementing for each deployment)
- Uses the "FPrime Server" profile provider (FSW connects to GDS)
- Automatically references the deployment's dictionary
- Uses CCSDS protocol

**Note:** Tasks are discovered for all toolchains in `build-artifacts/`, not just the current platform. This allows you to see all available deployments across different build configurations.

**Important:** The auto-discovered task is a template based on detecting a local binary. You will typically need to create custom tasks in your `.vscode/tasks.json` for your specific deployment workflow:
- Custom toolchains (baremetal, cross-compile, simulator)
- Hardware deployment (flashing, bootloader, JTAG)
- Remote/testbed deployment
- Custom FSW arguments and environment
- Client mode instead of server mode

### Using Auto-Discovered Tasks

You can reference auto-discovered tasks in your `.vscode/tasks.json` file by their label:

```json
{
  "label": "Deploy All Components",
  "dependsOn": [
    "Ref: Deploy",
    "MyComponent: Deploy"
  ],
  "dependsOrder": "parallel"
}
```

Or add pre/post steps to an existing deployment:

```json
{
  "label": "Deploy Ref with Logging",
  "dependsOn": [
    "Start Logger",
    "Ref: Deploy"
  ],
  "dependsOrder": "sequence"
}
```

### Finding Available Tasks

To see all available tasks:
1. Open the Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
2. Run "Tasks: Run Task"
3. Select a task from the list

The auto-discovered tasks will appear with their deployment name prefix (e.g., "Ref: Deploy").

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

If a task type is not recognized, ensure the F Prime extension is installed:
- `hermes-fprime-deployment`: F Prime extension (`jet-propulsion-laboratory.hermes-fprime`)

### Auto-discovered tasks not appearing

Ensure:
1. Your workspace has a `build-artifacts/` directory with built deployments
2. Each deployment has a `dict/` directory with a `.json` dictionary file
3. The F Prime extension is installed and activated

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

The deployment task automatically references the dictionary by name. Ensure:
1. The dictionary was discovered by Hermes (check auto-discovery or manual settings)
2. The `dictionary` field in `profileSettings` matches the dictionary ID
3. The backend is running (check status bar)

### Profile creation fails

Ensure:
1. The dictionary ID in `profileSettings.dictionary` matches an available dictionary
2. The backend is running (check status bar)
3. The profile provider name is correct (case-sensitive: "FPrime Server" or "FPrime Client")
4. The address format is correct (e.g., "0.0.0.0:8000" or "localhost:8000")

### FSW fails to start

Check the task terminal output for errors. Common issues:
1. Binary path is incorrect or doesn't exist
2. Port is already in use
3. Binary doesn't have execute permissions
4. Command syntax is incorrect (check shell escaping)

## See Also

- [VSCode Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [Task Variables](https://code.visualstudio.com/docs/editor/variables-reference)
- Example tasks: `.vscode/fprime-tasks.example.json`
