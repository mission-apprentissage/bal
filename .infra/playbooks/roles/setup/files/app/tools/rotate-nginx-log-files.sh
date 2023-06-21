#!/usr/bin/env bash
set -euo pipefail

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
docker exec $(docker ps -q -f name=bal_reverse_proxy --latest) bash -c "/usr/sbin/logrotate -s /data/status /etc/logrotate.conf"
