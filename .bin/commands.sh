#!/usr/bin/env bash

set -euo pipefail

if [ -f "${ROOT_DIR}/.bin/shared/commands.sh" ]; then

  . "${ROOT_DIR}/.bin/shared/commands.sh"

else

  echo "Mise à jour du sous-module mna-shared-bin"

  git submodule update --recursive --init --remote "${ROOT_DIR}/.bin/shared"

fi

function _help() {

  mapfile -d '' sorted < <(printf '%s\0' "${!_meta_help[@]}" | sort -z)

  echo -e "Commands\n"

  for key in "${sorted[@]}"; do
    echo -e "  ${key}"
    echo -e "    \`-> ${_meta_help[$key]}"
    echo
  done

}

################################################################################
# Non-shared commands
################################################################################

_meta_help["app:build"]="Build Ui & Server Docker images"

function app:build() {
  "${SCRIPT_DIR}/app-build.sh" "$@"
}

_meta_help["app:release"]="Build & push Docker image releases"

function app:release() {
  "${SCRIPT_DIR}/app-release.sh" "$@"
}

_meta_help["app:release:interactive"]="Interactivelly build & push Docker image releases"

function release:interactive() {
  "${SCRIPT_DIR}/app-release-interactive.sh" "$@"
}

_meta_help["env:init"]="Update local env files using values from SOPS files"

function env:init() {
  "${SCRIPT_DIR}/env-init.sh" "$@"
}

