#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly BACKUP_LOCAL_DIR="/opt/bal/backups/metabase"

stop_container() {
  bash /opt/bal/tools/stop-containers.sh metabase
}

restart_container() {
  bash /opt/bal/tools/reload-containers.sh
}

function backup_metabase(){
  echo "Sauvegarde de la base metabase..."

  stop_container
  tar -zcvf "/opt/bal/backups/metabase/metabase-$(date +'%Y-%m-%d_%H%M%S').tar.gz" \
    -C /opt/bal/data/metabase .
  restart_container

  echo "Sauvegarde terminé."
}

function remove_old_backups() {
  echo "Removing local backups older than 7 days..."
  find "${BACKUP_LOCAL_DIR}" -mindepth 1 -maxdepth 1 -prune -ctime +7 -exec rm -r "{}" \;
}


backup_metabase
remove_old_backups
