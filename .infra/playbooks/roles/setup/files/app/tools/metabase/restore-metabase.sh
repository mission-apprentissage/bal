#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly BACKUP_FILE=${1:?"Please provide a backup file path $(echo '' && find /opt/bal/backups/metabase)"}; shift;

stop_container() {
  bash /opt/bal/tools/stop-containers.sh metabase
}

restart_container() {
  bash /opt/bal/tools/reload-containers.sh metabase
}

function restore_metabase(){
  echo "Restauration de la base metabase..."

  stop_container
  tar -xvf "${BACKUP_FILE}" -C /opt/bal/data/metabase
  restart_container

  echo "Réstauration terminée."
}

restore_metabase
