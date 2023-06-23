#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly PROJECT_DIR="/opt/bal"

function reload_containers() {
    echo "Rechargement des conteneurs ..."
    if test -f "docker-compose.recette.yml"; then
      docker stack deploy -c docker-compose.yml -c docker-compose.recette.yml bal;
    else
      docker stack deploy -c docker-compose.yml bal;
    fi
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
reload_containers "$@"
