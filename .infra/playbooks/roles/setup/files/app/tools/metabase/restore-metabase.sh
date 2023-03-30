#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly BACKUP_FILE=${1:?"Please provide a backup file path $(echo '' && find /mnt/backups/metabase)"}; shift;

stop_container() {
  bash /opt/bal/tools/stop-containers.sh metabase
}

restart_container() {
  NO_UPDATE=true bash /opt/bal/tools/reload-containers.sh --no-deps metabase
}

function restore_metabase(){
  echo "Restauration de la base metabase..."

  stop_container
  tar -xvf "${BACKUP_FILE}" -C /opt/bal/data/metabase
  restart_container

  echo "Sauvegarde terminé."
}

restore_metabase
