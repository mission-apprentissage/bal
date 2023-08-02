#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

function deploy() {
  echo "Déploiement sur l'environnement ${ENV_FILTER}..."

  if [[ "$ENV_FILTER" == "preview" ]]; then
    readonly PR_NUMBER=${1:?"Merci de préciser le numéro de la Pull Request (ex. 33)"};
    shift;

    if ! [[ $PR_NUMBER =~ ^[0-9]+$ ]]; then
      echo "Merci de préciser le numéro de la Pull Request (ex. 33)" >&2;
      echo "Usage: deploy-app.sh preview <pr_number> <ansible_args...>" >&2;
      exit 1
    fi

    "${SCRIPT_DIR}/run-playbook.sh" "preview.yml" "$ENV_FILTER" --extra-var "pr_number=$PR_NUMBER"
  else
    "${SCRIPT_DIR}/run-playbook.sh" "deploy.yml" "$ENV_FILTER"
  fi
}

# Do not show error log in CI
if [[ -z "${CI:-}" ]]; then
  deploy "$@"
else
  deploy "$@" 2> /dev/null
fi;
