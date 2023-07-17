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

   echo "  infra:setup <env> --user <your_username>                                            Setup infra on environnement <env>"
   echo "  infra:setup:prod --user <your_username>                                             Setup infra on production"
   echo "  infra:setup:recette --user <your_username>                                          Setup infra on recette"
   echo "  infra:release:images                                                                Build & Push Docker image releases"
   echo "  infra:deploy <env> --user <your_username>                                           Deploy application to <env>"
   echo "  infra:deploy:prod --user <your_username>                                            Deploy application to production"
   echo "  infra:deploy:recette --user <your_username>                                         Deploy application to recette"
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

function infra_setup() {
  ${ROOT_DIR}/.infra/scripts/setup-vm.sh "$@"
}

function infra_setup_prod() {
  infra_setup production "$@"
}

function infra_setup_recette() {
  infra_setup recette "$@"
}

function infra_release_images() {
  ${ROOT_DIR}/.infra/scripts/push-images.sh "$@"
}

function infra_deploy() {
  ${ROOT_DIR}/.infra/scripts/deploy-app.sh "$@"
}

function infra_deploy_prod() {
  infra_deploy production "$@"
}

function infra_deploy_recette() {
  infra_deploy recette "$@"
}

function infra_vault_edit() {
  editor=${EDITOR:-'code -w'}
  EDITOR=$editor "$ROOT_DIR/.infra/scripts/vault/edit-vault.sh" "$@"
}

function infra_vault_generate() {
  "$ROOT_DIR/.infra/scripts/vault/generate-vault-password.sh" "$@"
}

function infra_vault_encrypt() {
  "$ROOT_DIR/.infra/scripts/vault/encrypt-vault.sh" "$@"
}

function infra_vault_password() {
  "$ROOT_DIR/.infra/scripts/vault/get-vault-password-client.sh" "$@"
}

function infra_vault_renew() {
  ${ROOT_DIR}/.infra/scripts/vault/renew-vault.sh "$@"
}

function infra_user_remove() {
  ${ROOT_DIR}/.infra/scripts/clean.sh <nom_environnement> "$@"
}

function infra_firewall_update() {
  ${ROOT_DIR}/.infra/scripts/ovh/create-firewall.sh "$@"
}

function infra_logs_ls() {
  ${ROOT_DIR}/.infra/scripts/monitoring/download_logs.sh ls "$@"
}

function infra_logs_dl_local() {
  ${ROOT_DIR}/.infra/scripts/monitoring/download_logs.sh dl "$@"
}

function infra_logs_rm_local() {
  ${ROOT_DIR}/.infra/scripts/monitoring/download_logs.sh rm "$@"
}
