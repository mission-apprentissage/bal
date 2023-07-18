#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $SCRIPT_DIR/..;

defaultMode=""
if [ ! -z "${CI:-}" ]; then
  defaultMode="push"
else
  defaultMode="load"
fi

readonly next_version="${1}"
readonly registry=${2:?"Veuillez préciser le registry"}
readonly mode=${3:-$defaultMode}

./.infra/scripts/release/bump-version.sh $next_version 
./.infra/scripts/release/build-images.sh $next_version $registry $mode
./.infra/scripts/release/push-git.sh $next_version
