#!/usr/bin/env bash

set -euo pipefail

if [ -f "${ROOT_DIR}/.bin/shared/commands.sh" ]; then

  . "${ROOT_DIR}/.bin/shared/commands.sh"

else

  echo "Mise à jour des sous-modules du dépôt"

  git submodule update --recursive --init
  git submodule update --recursive --remote

fi

function _help() {

   echo -e "Commands\n"
   
   echo -e "  bin:setup"
   echo -e "    \`-> Install mna-bal binary with zsh completion on system\n"
   
   echo -e "  env:init"
   echo -e "    \`-> Update local env files using values from SOPS files\n"
   
   echo -e "  release:interactive"
   echo -e "    \`-> Build & Push Docker image releases\n"
   
   echo -e "  release:app"
   echo -e "    \`-> Build & Push Docker image releases\n"
   
   echo -e "  product:access:update"
   echo -e "    \`-> Update product access\n"
   
   echo -e "  vault:edit [<env>]"
   echo -e "    \`-> Edit SOPS env.global.yml or env.<env>.yml file\n"
   
   echo -e "  app:deploy <env> --user <your_username>"
   echo -e "    \`-> Deploy application to <env>\n"
   
   echo -e "  app:deploy:log:encrypt"
   echo -e "    \`-> Encrypt Github Actions Ansible logs\n"
   
   echo -e "  app:deploy:log:decrypt"
   echo -e "    \`-> Decrypt Github Actions Ansible logs\n"
   
   echo -e "  seed:update"
   echo -e "    \`-> Update seed using a database\n"

   echo -e "  seed:apply"
   echo -e "    \`-> Apply seed to a database\n"

}

function bin:setup() {
  "${SCRIPT_DIR}/bin-setup.sh"
}

function env:init() {
  "${SCRIPT_DIR}/env-init.sh" "$@"
}

function release:interactive() {
  "${SCRIPT_DIR}/release-interactive.sh" "$@"
}

function release:app() {
  "${SCRIPT_DIR}/release-app.sh" "$@"
}

