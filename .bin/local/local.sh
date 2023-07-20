#!/usr/bin/env bash

set -euo pipefail

function Help_local() {
   # Display Help
   echo "===================================================================================================="
   echo "========================================== Local commands =========================================="
   echo "===================================================================================================="
   echo "List of commands to be used in local developpement"
   echo 
   echo "Commands"
   echo "  local:bin:install                                       Install mna-bal bin locally"
   echo "  local:completion:zsh                                    Install mna-bal completion script for zsh"
   echo "  local:start                                             Starts application locally"
   echo "  local:stop                                              Stop local application"
   echo "  local:clean                                             Stop & Remove application; including data volumes"
   echo "  local:debug                                             Start application locally in debug mode"
   echo "  local:server:run [run_command] [run_args...]            Run a one-off command on the server container"
   echo "  local:server:sh                                         Start interactive session in the server container"
   echo "  local:server:cli [cli_options] [cli_command]            Run a server CLI command"
   echo "  local:server:seed                                       Seed database with mock data"
   echo "  local:server:migrations:status                          Check database migration status"
   echo "  local:server:migrations:up                              Execute pending database migrations"
   echo "  local:server:migrations:create -d <name>                Create a new empte database migration"
   echo "  local:test                                              Run tests for all projects (server, ui, shared)"
   echo "  local:test:server                                       Run server tests"
   echo "  local:test:server:watch                                 Run server tests in watch mode"
   echo "  local:test:shared                                       Run shared tests"
   echo "  local:test:shared:watch                                 Run shared tests in watch mode"
   echo "  local:lint                                              Run eslint"
   echo "  local:install                                           Install dependencies"
   echo "  local:prettier:fix                                      Fix prettier formatting"
   echo "  local:typecheck                                         Check Typescript definitions in all projects (server, ui, shared)"
   echo "  local:typecheck:server                                  Check Typescript definitions in server"
   echo "  local:typecheck:ui                                      Check Typescript definitions in ui"
   echo "  local:typecheck:shared                                  Check Typescript definitions in shared"
   echo "  local:env:update                                        Update local env files using values from vault file"
   echo "  local:docker:run [service] [run_command] [run_args...]  Run a one-off command on the provided service"
   echo "  local:docker:sh [service]                               Start interactive session in the provided service"
   echo 
   echo
}

function local_bin_install() {
  sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-bal
}

function local_completion_zsh() {
  sudo mkdir -p /usr/local/share/zsh/site-functions
  sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-bal
  sudo rm -f ~/.zcompdump
}

function local_start() {
  docker compose up -d --remove-orphans --build "$@"
}

function local_stop() {
  docker compose down "$@"
}

function local_clean() {
  local_stop
  docker system prune --force --volumes "$@"
}

function local_debug() {
  docker compose -f docker-compose.yml -f docker-compose.debug.yml up -d --remove-orphans --build "$@"
}

function local_docker_run() {
  docker compose run --rm -it --build -e NODE_OPTIONS='--enable-source-maps' "$@"
}

function local_docker_sh() {
  service=${1:?'Service name required'}
  shift
  local_docker_run $service sh "$@"
}

function local_server_run() {
  local_docker_run server "$@"
}

function local_server_sh() {
  local_server_run sh "$@"
}

function local_server_cli() {
  local_server_run yarn run cli "$@"
}

function local_server_seed() {
  local_server_cli seed "$@"
}

function local_server_migrations_status() {
  local_server_cli migrations:status "$@"
}

function local_server_migrations_up() {
  local_server_cli migrations:up "$@"
}

function local_server_migrations_create() {
  local_server_cli migrations:create "$@"
}

function local_test() {
  yarn test "$@"
}

function local_test_server() {
  yarn --cwd server test "$@"
}

function local_test_server_watch() {
  yarn --cwd server test -w "$@"
}

function local_test_shared() {
  yarn --cwd shared test "$@"
}

function local_test_shared_watch() {
  yarn --cwd shared test -w "$@"
}

function local_lint() {
  yarn lint --fix "$@"
}

function local_install() {
  yarn install "$@"
}

function local_prettier_fix() {
  yarn prettier:fix "$@"
}

function local_typecheck() {
  yarn typecheck "$@"
}

function local_typecheck_server() {
  yarn --cwd server typecheck "$@"
}

function local_typecheck_shared() {
  yarn --cwd shared typecheck "$@"
}

function local_typecheck_ui() {
  yarn --cwd ui typecheck "$@"
}


function local_env_update() {
  EDITOR='code -w' "$ROOT_DIR/.infra/scripts/vault/setup-local-env.sh" "$@"
}
