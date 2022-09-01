#!/bin/bash

ASSETS_DIR='./src/assets'

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"
cd "$(git rev-parse --show-toplevel)"

changed=

while [ "$1" ]
do
  case "$1" in
    '--changed')
      changed=true
      ;;
    *)
      echo "Unknown flag '${1}'"
      exit 1
  esac
  shift
done

if [ "$changed" ]
then
  files="$(git diff --diff-filter d --name-only HEAD~1 -- "$ASSETS_DIR")"
else
  files="$(find "$ASSETS_DIR" -type file)"
fi

yarn
node './scripts/optimize_assets.mjs' $files
