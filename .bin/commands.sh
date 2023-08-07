#!/usr/bin/env bash

set -euo pipefail

function Help() {
   # Display Help
   echo "Commands"
   echo "  bin:setup                                               Installs mna-bal binary with zsh completion on system"
   echo "  init:env                                                Update local env files using values from vault file"
   echo "  release:images                                                                Build & Push Docker image releases"
   echo "  deploy <env> --user <your_username>                                           Deploy application to <env>"
   echo "  preview:cleanup --user <your_username>                                        Remove preview from close pull-requests"
   echo "  vault:edit                                                                    Edit vault file"
   echo "  vault:password                                                                Show vault password"
   echo 
   echo
}

function bin:setup() {
  sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-bal

  sudo mkdir -p /usr/local/share/zsh/site-functions
  sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-bal
  sudo rm -f ~/.zcompdump
}

function init:env() {
  "$ROOT_DIR/.infra/vault/setup-local-env.sh" "$@"
}

function release:images() {
  "$ROOT_DIR/.infra/scripts/push-images.sh" "$@"
}

function release:images() {
  "$ROOT_DIR/.infra/scripts/push-images.sh" "$@"
}

function deploy() {
  "${ROOT_DIR}/.bin/scripts/deploy-app.sh" "$@"
}

function preview:cleanup() {
  "${ROOT_DIR}/.bin/scripts/run-playbook.sh" "preview_cleanup.yml" "preview"
}

function vault:edit() {
  editor=${EDITOR:-'code -w'}
  EDITOR=$editor "$ROOT_DIR/.infra/vault/edit-vault.sh" "$@"
}

function vault:password() {
  "$ROOT_DIR/.infra/vault/get-vault-password-client.sh" "$@"
}
