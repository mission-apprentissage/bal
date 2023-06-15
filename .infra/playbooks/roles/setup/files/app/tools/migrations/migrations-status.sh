#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker compose --env-file .env_docker_compose run --rm --no-deps server yarn cli migrations:status
