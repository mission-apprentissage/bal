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

function local:bin:install() {
  sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-bal
}

function local:completion:zsh() {
  sudo mkdir -p /usr/local/share/zsh/site-functions
  sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-bal
  sudo rm -f ~/.zcompdump
}

function local:start() {
  docker compose up -d --remove-orphans --build "$@"
}

function local:stop() {
  docker compose down "$@"
}

function local:clean() {
  local:stop
  docker system prune --force --volumes "$@"
}

function local:debug() {
  docker compose -f docker-compose.yml -f docker-compose.debug.yml up -d --remove-orphans --build "$@"
}

function local:docker:run() {
  docker compose run --rm -it --build -e NODE_OPTIONS='--enable-source-maps' "$@"
}

function local:docker:sh() {
  service=${1:?'Service name required'}
  shift
  local:docker:run $service sh "$@"
}

function local:server:run() {
  local:docker:run server "$@"
}

function local:server:sh() {
  local:server:run sh "$@"
}

function local:server:cli() {
  local:server:run yarn run cli "$@"
}

function local:server:seed() {
  local:server:cli seed "$@"
}

function local:server_migrations:status() {
  local:server:cli migrations:status "$@"
}

function local:server_migrations:up() {
  local:server:cli migrations:up "$@"
}

function local:server_migrations:create() {
  local:server:cli migrations:create "$@"
}

function local:test() {
  yarn test "$@"
}

function local:test:server() {
  yarn --cwd server test "$@"
}

function local:test_server:watch() {
  yarn --cwd server test -w "$@"
}

function local:test:shared() {
  yarn --cwd shared test "$@"
}

function local:test_shared:watch() {
  yarn --cwd shared test -w "$@"
}

function local:lint() {
  yarn lint --fix "$@"
}

function local:install() {
  yarn install "$@"
}

function local:prettier:fix() {
  yarn prettier:fix "$@"
}

function local:typecheck() {
  yarn typecheck "$@"
}

function local:typecheck:server() {
  yarn --cwd server typecheck "$@"
}

function local:typecheck:shared() {
  yarn --cwd shared typecheck "$@"
}

function local:typecheck:ui() {
  yarn --cwd ui typecheck "$@"
}


function local:env:update() {
  EDITOR='code -w' "$ROOT_DIR/.infra/scripts/vault/setup-local-env.sh" "$@"
}
