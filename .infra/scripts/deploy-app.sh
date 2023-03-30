#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

echo "Déploiement sur l'(es) environnement(s) ${ENV_FILTER}..."
ansible-playbook \
    -i "${SCRIPT_DIR}/../env.ini" \
    --limit "${ENV_FILTER}" \
    --vault-password-file="${SCRIPT_DIR}/vault/get-vault-password-client.sh" \
     "${SCRIPT_DIR}/../playbooks/deploy.yml" "$@"
