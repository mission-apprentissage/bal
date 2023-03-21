#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec bal_server yarn --silent "$@"
