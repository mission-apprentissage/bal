#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

function tail_logs() {
    echo "Rechargement des conteneurs ..."

    /usr/local/bin/docker-compose \
      -f "/opt/bal/docker-compose.yml" \
      --project-name bal \
      logs "$@"
}

tail_logs "$@"
