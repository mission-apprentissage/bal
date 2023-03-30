#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly PROJECT_DIR="/opt/bal"

function reload_containers() {
    echo "Rechargement des conteneurs ..."

    /usr/local/bin/docker-compose \
      -f "${PROJECT_DIR}/docker-compose.yml" \
      --project-name bal \
      up -d --force-recreate --remove-orphans --renew-anon-volumes $*
}

function clean_docker() {
    echo "Removing dangling data built two weeks ago..."
    docker system prune -f --filter "until=360h"
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
reload_containers "$@"
clean_docker
