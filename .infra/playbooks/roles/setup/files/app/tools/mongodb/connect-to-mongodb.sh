#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec -it bal_mongodb mongosh "{{ vault[env_type].MNA_BAL_MONGODB_URI }}" "$@"
