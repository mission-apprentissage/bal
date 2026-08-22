#!/usr/bin/env bash

set -euo pipefail

if [ -z "${SCRIPTS_DIR:-}" ]; then
  export SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

if [ -z "${ROOT_DIR:-}" ]; then
  export ROOT_DIR="$(cd "${SCRIPTS_DIR}/../.." && pwd)"
fi

defaultMode=""
if [ ! -z "${CI:-}" ]; then
  defaultMode="push"
else
  defaultMode="load"
fi

readonly next_version="${1}"
readonly mode=${2:-$defaultMode}

# app-build.sh attend : <version> <mode> <commit_hash> <environnement> (un seul environnement)
# -C "$ROOT_DIR" : indépendant du cwd d'invocation ; déclaration séparée du readonly
# pour que set -e stoppe bien le script si git échoue (SC2155)
commit_hash="$(git -C "$ROOT_DIR" rev-parse HEAD)"
readonly commit_hash

"$ROOT_DIR"/.bin/mna app:build "$next_version" "$mode" "$commit_hash" production
"$ROOT_DIR"/.bin/mna app:build "$next_version" "$mode" "$commit_hash" recette
