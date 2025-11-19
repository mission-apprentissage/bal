#!/usr/bin/env bash

set -euo pipefail

. ${ROOT_DIR}/.bin/shared/commands.sh

function _help() {

   echo -e "Commands\n"
   
   echo -e "  bin:setup"
   echo -e "    \`-> Installs mna-bal binary with zsh completion on system\n"
   
   echo -e "  init:env"
   echo -e "    \`-> Update local env files using values from vault files\n"
   
   echo -e "  release:interactive"
   echo -e "    \`-> Build & Push Docker image releases\n"
   
   echo -e "  release:app"
   echo -e "    \`-> Build & Push Docker image releases\n"
   
   echo -e "  product:access:update"
   echo -e "    \`-> Update product access\n"
   
   echo -e "  vault:edit"
   echo -e "    \`-> Edit vault file\n"
   
   echo -e "  app:deploy <env> --user <your_username>"
   echo -e "    \`-> Deploy application to <env>\n"
   
   echo -e "  app:deploy:log:encrypt"
   echo -e "    \`-> Encrypt Github ansible logs\n"
   
   echo -e "  app:deploy:log:decrypt"
   echo -e "    \`-> Decrypt Github ansible logs\n"
   
   echo -e "  seed:update"
   echo -e "    \`-> Update seed using a database\n"

   echo -e "  seed:apply"
   echo -e "    \`-> Apply seed to a database\n"

}

function bin:setup() {
  sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-bal

  sudo mkdir -p /usr/local/share/zsh/site-functions
  sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-bal
  sudo rm -f ~/.zcompdump*
}

function init:env() {
  "${SCRIPT_DIR}/setup-local-env.sh" "$@"
}

function release:interactive() {
  "${SCRIPT_DIR}/release-interactive.sh" "$@"
}

function release:app() {
  "${SCRIPT_DIR}/release-app.sh" "$@"
}

function seed:update() {
  "${SCRIPT_DIR}/seed-update.sh" "$@"
}

function seed:apply() {
  "${SCRIPT_DIR}/seed-apply.sh" "$@"
}

