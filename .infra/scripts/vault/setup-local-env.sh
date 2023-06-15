#!/usr/bin/env bash
set -euo pipefail

echo "Updating local .env_server"
ansible all -i ./.infra/env.ini \
  --limit "local" \
  -m template \
  -a "src=.infra/.env_server dest=.env_server" \
  --extra-vars "@.infra/vault/vault.yml" \
  --vault-password-file=".infra/scripts/vault/get-vault-password-client.sh"

echo "Updating local .env_ui"
ansible local -i ./.infra/env.ini \
  -m template \
  -a "src=.infra/.env_ui dest=.env_ui" \
  --extra-vars "@.infra/vault/vault.yml" \
  --vault-password-file=".infra/scripts/vault/get-vault-password-client.sh"
