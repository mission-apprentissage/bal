#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec -it $(docker ps -q -f name=bal_mongodb --latest) mongosh "{{ vault[env_type].MNA_BAL_MONGODB_URI }}" "$@"
