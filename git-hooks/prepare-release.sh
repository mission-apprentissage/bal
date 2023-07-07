#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $SCRIPT_DIR/..;

mode=""
if [ ! -z "${CI:-}" ]; then
  mode="push"
else
  mode="load"
fi

./.infra/scripts/release/bump-version.sh "$@"
./.infra/scripts/release/build-images.sh "$@" $mode
./.infra/scripts/release/push-git.sh "$@"
