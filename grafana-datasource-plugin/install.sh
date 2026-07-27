#!/bin/bash
set -e

PLUGIN_ID="nasa-hermes-datasource"
REPO="nasa/hermes"
RELEASE_URL="https://api.github.com/repos/${REPO}/releases"

if ! command -v jq >/dev/null 2>&1; then
    echo "Error: jq is required but not installed."
    exit 1
fi

echo "Fetching latest release with Grafana plugin..."
RELEASE_JSON=$(curl -fsSL "$RELEASE_URL" \
    | jq -r '[.[]
        | select(.draft == false and .prerelease == false)
        | select(.assets[] | .name | contains("nasa-hermes-datasource"))][0]')

if [ -z "$RELEASE_JSON" ] || [ "$RELEASE_JSON" = "null" ]; then
    echo "Error: Could not find a published release with the Grafana plugin. Check https://github.com/${REPO}/releases"
    exit 1
fi

VERSION=$(echo "$RELEASE_JSON" | jq -r '.tag_name')
ZIP_URL=$(echo "$RELEASE_JSON" \
    | jq -r '.assets[] | select(.name | contains("nasa-hermes-datasource") and (.name | endswith(".zip"))) | .browser_download_url' | head -1)

if [ -z "$ZIP_URL" ] || [ "$ZIP_URL" = "null" ]; then
    echo "Error: Could not find a plugin zip in release ${VERSION}. Check https://github.com/${REPO}/releases"
    exit 1
fi

echo "Installing ${PLUGIN_ID} ${VERSION}..."

# Detect plugins directory
# Priority: command-line argument > GRAFANA_PLUGINS_DIR env var > auto-detect
if [ -n "$1" ]; then
    PLUGINS_DIR="$1"
elif [ -n "$GRAFANA_PLUGINS_DIR" ]; then
    PLUGINS_DIR="$GRAFANA_PLUGINS_DIR"
elif [ -d "/var/lib/grafana/plugins" ]; then
    PLUGINS_DIR="/var/lib/grafana/plugins"
elif [ -d "/usr/local/var/lib/grafana/plugins" ]; then
    PLUGINS_DIR="/usr/local/var/lib/grafana/plugins"
elif [ -d "$HOME/grafana/plugins" ]; then
    PLUGINS_DIR="$HOME/grafana/plugins"
else
    read -rp "Grafana plugins directory: " PLUGINS_DIR
fi

if [ ! -d "$PLUGINS_DIR" ]; then
    echo "Error: Directory ${PLUGINS_DIR} does not exist."
    exit 1
fi

# Download and extract
TMP_ZIP=$(mktemp /tmp/${PLUGIN_ID}.XXXXXX)
echo "Downloading ${ZIP_URL}..."
curl -fsSL "$ZIP_URL" -o "$TMP_ZIP"

# Remove previous version if present
if [ -d "${PLUGINS_DIR}/${PLUGIN_ID}" ]; then
    echo "Removing previous installation..."
    rm -rf "${PLUGINS_DIR}/${PLUGIN_ID}"
fi

echo "Extracting to ${PLUGINS_DIR}..."
unzip -qo "$TMP_ZIP" -d "$PLUGINS_DIR"
rm "$TMP_ZIP"

echo ""
echo "Installed ${PLUGIN_ID} ${VERSION} to ${PLUGINS_DIR}/${PLUGIN_ID}"
echo ""
echo "To allow this unsigned plugin, add the following to your grafana.ini under [plugins]:"
echo ""
echo "  allow_loading_unsigned_plugins = ${PLUGIN_ID}"
echo ""
echo "Or set the environment variable:"
echo ""
echo "  GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=${PLUGIN_ID}"
echo ""
echo "Then restart Grafana."
