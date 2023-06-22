#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $SCRIPT_DIR/..;

./.infra/scripts/release/bump-version.sh "$@"
./.infra/scripts/release/build-images.sh "$@"
./.infra/scripts/release/push-images.sh "$@"
./.infra/scripts/release/push-git.sh "$@"
