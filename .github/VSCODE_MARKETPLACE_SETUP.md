# VSCode Marketplace Publishing Setup

This document explains how to set up automated publishing to the Visual Studio Code Marketplace via GitHub Actions.

## Prerequisites

You need a Personal Access Token (PAT) from the Visual Studio Marketplace with publishing permissions.

## Creating a Visual Studio Marketplace PAT

1. Go to https://dev.azure.com/ and sign in with the account that has access to the `jet-propulsion-laboratory` publisher
2. Click on your profile icon in the top right → **Personal access tokens**
3. Click **+ New Token**
4. Configure the token:
   - **Name**: `GitHub Actions - Hermes Extensions`
   - **Organization**: Select your organization (or "All accessible organizations")
   - **Expiration**: Set an appropriate expiration date (recommended: 1 year, then rotate)
   - **Scopes**: Select **Marketplace** → **Manage** (this grants publish/unpublish permissions)
5. Click **Create**
6. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Adding the Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/nasa/hermes
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `VSCE_PAT`
   - **Secret**: Paste the Personal Access Token you created above
5. Click **Add secret**

## How the Workflow Works

The workflow (`.github/workflows/build-vscode-extensions.yml`) has two jobs:

### Build Job (always runs)
- Triggers on:
  - Git tags starting with `v*` (e.g., `v4.0.0`)
  - Manual workflow dispatch
  - Pull requests that modify TypeScript/extension code
- Builds both `hermes` (core) and `hermes-fprime` extensions
- Packages them as `.vsix` files
- Uploads artifacts to GitHub Actions
- **On tag pushes**: Uploads `.vsix` files to GitHub Release

### Publish Job (only on tags)
- Triggers only when a Git tag is pushed
- Depends on successful build job
- Publishes both extensions to the VS Code Marketplace using the `VSCE_PAT` secret

## Publishing a New Release

The workflow automatically sets the extension version from the Git tag. You don't need to manually update `package.json` files.

### Publishing a Stable Release

1. Create and push a Git tag with the desired version:
   ```bash
   git tag v4.1.0
   git push origin v4.1.0
   ```

2. The workflow will automatically:
   - Extract the version from the tag (e.g., `v4.1.0` → `4.1.0`)
   - Update all `package.json` files with the new version
   - Build both extensions with the correct version
   - Create a GitHub Release with auto-generated changelog notes
   - Upload all assets (4 Go binaries + 2 VSCode extensions) to the release
   - Publish both extensions to the VS Code Marketplace with version `4.1.0`

### Publishing a Pre-Release

Pre-release versions are detected automatically based on semantic versioning (versions containing a hyphen).

1. Create a pre-release tag:
   ```bash
   # Beta release
   git tag v4.1.0-beta.1
   git push origin v4.1.0-beta.1

   # Release candidate
   git tag v4.1.0-rc.1
   git push origin v4.1.0-rc.1

   # Alpha release
   git tag v4.1.0-alpha.1
   git push origin v4.1.0-alpha.1
   ```

2. The workflow will automatically:
   - Detect the hyphen in the version and mark it as a pre-release
   - Create a **Pre-release** on GitHub (marked with the "Pre-release" badge)
   - Publish to the VS Code Marketplace with the `--pre-release` flag
   - Users can opt-in to pre-release versions in VS Code via "Switch to Pre-Release Version"

**Pre-release Benefits:**
- Test new features with early adopters before stable release
- Pre-release extensions show up in VS Code's pre-release channel
- GitHub releases are clearly marked as pre-release
- Can iterate quickly (`v4.1.0-beta.1`, `v4.1.0-beta.2`, etc.)

**Note**: The version in your local `package.json` files doesn't matter for releases - the Git tag is the source of truth. However, you may want to keep them in sync manually for consistency:

```bash
# Optional: Update package.json files to match
vim package.json  # Change "version": "4.1.0"
vim src/extensions/core/package.json
vim src/extensions/fprime/package.json
git add package.json src/extensions/*/package.json
git commit -m "Bump version to v4.1.0"
git tag v4.1.0
git push origin main v4.1.0
```

## Auto-Generated Release Notes

Both workflows automatically generate release notes using GitHub's built-in changelog generator. When you push a tag, the GitHub release will include:

- **What's Changed**: List of merged pull requests since the last release
- **New Contributors**: First-time contributors in this release
- **Full Changelog**: Link to compare view showing all changes

The changelog is generated from:
- PR titles merged between the previous tag and the current tag
- Commit messages (if no PRs are associated)
- Contributor information

**Customizing Release Notes:**

You can customize the format and grouping by creating a `.github/release.yml` file:

```yaml
changelog:
  exclude:
    labels:
      - ignore-for-release
  categories:
    - title: Breaking Changes 🛠
      labels:
        - breaking-change
    - title: New Features 🎉
      labels:
        - enhancement
    - title: Bug Fixes 🐛
      labels:
        - bug
    - title: Other Changes
      labels:
        - "*"
```

See [GitHub's documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) for more options.

## Testing Without Publishing

To test the workflow without publishing:

1. Push changes to a PR branch that modifies extension code
2. The workflow will build and package extensions
3. Check the Actions tab for build artifacts
4. Download and test the `.vsix` files locally

Or manually trigger the workflow:

1. Go to **Actions** → **Build VSCode Extensions**
2. Click **Run workflow**
3. Select a branch and click **Run workflow**

## Troubleshooting

### "Failed to publish: The Personal Access Token verification has failed"
- The `VSCE_PAT` secret is missing, expired, or invalid
- Create a new PAT following the steps above
- Update the GitHub secret with the new token

### "Failed to publish: Extension publisher 'jet-propulsion-laboratory' does not exist"
- The publisher name in `package.json` doesn't match your Marketplace publisher
- Verify the publisher at https://marketplace.visualstudio.com/manage/publishers/jet-propulsion-laboratory

### "Failed to package: Missing required field 'repository'"
- Ensure both extension `package.json` files have the `repository` field
- This is already configured in the current setup

## Manual Publishing

If you need to publish manually (bypassing GitHub Actions):

```bash
# Install vsce
yarn global add @vscode/vsce

# Build extensions
yarn build

# Publish core extension
cd src/extensions/core
vsce publish --yarn -p YOUR_PAT_HERE

# Publish fprime extension
cd ../fprime
vsce publish -p YOUR_PAT_HERE
```

## Security Notes

- **Never commit PATs to the repository**
- Rotate the PAT annually or if compromised
- The PAT has full Marketplace management permissions - keep it secure
- Only repository administrators should have access to GitHub secrets
