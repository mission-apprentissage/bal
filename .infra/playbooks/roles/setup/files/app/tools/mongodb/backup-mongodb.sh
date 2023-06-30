#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_LOCAL_DIR="/opt/bal/backups/mongodb"
readonly BACKUP_FILE="${BACKUP_LOCAL_DIR}/mongodb-$(date +'%Y-%m-%d_%H%M%S').gpg"

function backup() {
  echo "Creating backup..."
  mkdir -p "${BACKUP_LOCAL_DIR}"
  docker run --rm -i mongo:6.0.2-focal mongodump --archive --gzip --uri="$REPLY" \
    | bash "${SCRIPT_DIR}/../gpg/encrypt.sh" > "${BACKUP_FILE}"
  rm /opt/bal/backups/mongodb/latest.gpg
  ln -s "${BACKUP_FILE}" /opt/bal/backups/mongodb/latest.gpg
}

function remove_old_backups() {
  echo "Removing old MongoDB backups..."
  find "${BACKUP_LOCAL_DIR}" -mindepth 1 -maxdepth 1 -prune -ctime +7 -exec rm -r "{}" \;
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
backup
remove_old_backups
