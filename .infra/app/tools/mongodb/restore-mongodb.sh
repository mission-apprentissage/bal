#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_FILE=${1:?"Please provide a backup file path $(echo '' && find /opt/bal/backups/mongodb)"}; shift;

echo "Restoring ${BACKUP_FILE}..."
bash "${SCRIPT_DIR}/../gpg/decrypt.sh" "${BACKUP_FILE}" | \
  docker run --rm -i mongo:6.0.2-focal mongorestore --archive --gzip --drop --uri="{{vault[env_type].MNA_BAL_MONGODB_BACKUP_URI}}"
