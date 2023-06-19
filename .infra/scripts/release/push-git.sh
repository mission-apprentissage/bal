#!/bin/bash
set -euo pipefail

next_version="${1}"

if [ ! -z "${CI:-}" ]; then
  git add CHANGELOG.md \
  .github/workflows/_deploy.yml \
  .infra/.env_docker_compose \
  package.json \
  server/package.json \
  shared/package.json \
  ui/package.json

  git commit -m "chore(release): bump $next_version [skip ci]"
  git push --tags https://$GH_TOKEN@github.com/mission-apprentissage/bal.git $GITHUB_REF_NAME --force
else
  echo "Skipping push: Not in CI"
fi
