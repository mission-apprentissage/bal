#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

echo "Mise en place de la page de maintenance..."
docker exec -ti $(docker ps -q -f name=bal_reverse_proxy --latest) bash -c "touch /etc/nginx/html/maintenance.on"
