#!/usr/bin/env bash

set -euo pipefail

function Help_infra() {
   # Display Help
   echo "===================================================================================================="
   echo "===================================== Infrastructure commands ======================================"
   echo "===================================================================================================="
   echo "List of commands to interact with infrastucture"
   echo 
   echo "Commands"

   echo "  infra:release:images                                                                Build & Push Docker image releases"
   echo "  infra:deploy <env> --user <your_username>                                           Deploy application to <env>"
   echo "  infra:deploy:prod --user <your_username>                                            Deploy application to production"
   echo "  infra:deploy:recette --user <your_username>                                         Deploy application to recette"
   echo "  infra:preview:cleanup --user <your_username>                                        Remove preview from close pull-requests"
   echo "  infra:vault:edit                                                                    Edit vault file"
   echo "  infra:vault:generate                                                                Generate vault file"
   echo "  infra:vault:encrypt                                                                 Encrypt vault file"
   echo "  infra:vault:password                                                                Show vault password"
   echo "  infra:vault:renew                                                                   Renew vault password"
   echo "  infra:user:remove --user <your_username> --extra-vars "username=\<username_remove\>"  Remove user from server (you need to manually remove from habilitation & renew vault first)"
   echo "  infra:firewall:update <env> <app-key> <app-secret>                                  Update OVH firewall"
   echo "  infra:logs:ls <destination> <file>                                                  List application logs files on <destination>; destination can be any destination valid using SSH command"
   echo "  infra:logs:dl:local <destination> <file>                                            Download application logs files on <destination> to local; destination can be any destination valid using SSH command"
   echo "  infra:logs:rm:local                                                                 Remove local logs files downloaded via infra:logs:dl:local"
   echo 
   echo
}

function infra:release:images() {
  "$ROOT_DIR/.infra/scripts/push-images.sh" "$@"
}

function infra:deploy() {
  "$SCRIPT_DIR/infra/deploy-app.sh" "$@"
}

function infra:deploy:prod() {
  infra:deploy production "$@"
}

function infra:deploy:recette() {
  infra:deploy recette "$@"
}

function infra:preview:cleanup() {
  "${ROOT_DIR}/.bin/infra/run-playbook.sh" "preview_cleanup.yml" "preview"
}

function infra:vault:edit() {
  editor=${EDITOR:-'code -w'}
  EDITOR=$editor "$ROOT_DIR/.infra/scripts/vault/edit-vault.sh" "$@"
}

function infra:vault:generate() {
  "$ROOT_DIR/.infra/scripts/vault/generate-vault-password.sh" "$@"
}

function infra:vault:encrypt() {
  "$ROOT_DIR/.infra/scripts/vault/encrypt-vault.sh" "$@"
}

function infra:vault:password() {
  "$ROOT_DIR/.infra/scripts/vault/get-vault-password-client.sh" "$@"
}

function infra:vault:renew() {
  "$ROOT_DIR/.infra/scripts/vault/renew-vault.sh" "$@"
}

function infra:user:remove() {
  "$ROOT_DIR/.infra/scripts/clean.sh" <nom_environnement> "$@"
}

function infra:firewall:update() {
  "$ROOT_DIR/.infra/scripts/ovh/create-firewall.sh" "$@"
}

function infra:logs:ls() {
  "$ROOT_DIR/.infra/scripts/monitoring/download_logs.sh" ls "$@"
}

function infra:logs_dl:local() {
  "$ROOT_DIR/.infra/scripts/monitoring/download_logs.sh" dl "$@"
}

function infra:logs_rm:local() {
  "$ROOT_DIR/.infra/scripts/monitoring/download_logs.sh" rm "$@"
}
