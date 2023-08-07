#!/usr/bin/env bash
set -euo pipefail

echo "Updating local server/.env"
ansible all -i ./.infra/env.ini \
  --limit "local" \
  -m template \
  -a "src=.infra/.env_server dest=./server/.env" \
  --extra-vars "@.infra/vault/vault.yml" \
  --vault-password-file=".infra/vault/get-vault-password-client.sh"
