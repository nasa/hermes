#!/usr/bin/env sh

# https://stackoverflow.com/questions/59895/how-do-i-get-the-directory-where-a-bash-script-is-located-from-within-the-script
get_script_dir()
{
    _SOURCE_PATH="$0"
    # Resolve symlinks recursively
    while [ -L "$_SOURCE_PATH" ]; do
        # Get symlink directory
        _SYMLINK_DIR="$( cd -P "$( dirname "$_SOURCE_PATH" )" >/dev/null 2>&1 && pwd )"
        # Resolve symlink target (relative or absolute)
        _SOURCE_PATH="$(readlink "$_SOURCE_PATH")"
        # Check if candidate path is relative or absolute
        if [[ $_SOURCE_PATH != /* ]]; then
            # Candidate path is relative, resolve to full path
            _SOURCE_PATH=$_SYMLINK_DIR/$_SOURCE_PATH
        fi
    done
    # Get final script directory path from fully resolved source path
    _SCRIPT_DIR="$(cd -P "$( dirname "$_SOURCE_PATH" )" >/dev/null 2>&1 && pwd)"
    echo "$_SCRIPT_DIR"
}

SCRIPT_DIR=$(get_script_dir)
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
VENV_NAME=".smolgraph-$PYTHON_VERSION"
VENV_PATH="$SCRIPT_DIR/$VENV_NAME"

if [ ! -d "$VENV_PATH" ]; then
    echo "venv $VENV_NAME at $VENV_PATH not found, creating..."
    python3 -m venv "$VENV_PATH"
    . "$VENV_PATH"/bin/activate
    pip install -r "$SCRIPT_DIR"/requirements.txt
    deactivate
fi

. "$VENV_PATH"/bin/activate
if [ -n "${SMOLGRPH_PDB+x}" ]; then
    python3 -m pdb "$SCRIPT_DIR"/smolgrph.py "$@"
else
    python3 "$SCRIPT_DIR"/smolgrph.py "$@"
fi
deactivate
