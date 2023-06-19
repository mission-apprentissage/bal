#!/bin/bash
set -euo pipefail

next_version="${1}"

if output=$(git status --porcelain) && [ -z "$output" ]; then
  ## Concurrency mode 
  git add  CHANGELOG.md \
  CHANGELOG.md \
  .github/workflows/_deploy.yml \
  .infra/.env \
  package.json \
  server/package.json \
  shared/package.json \
  ui/package.json

  git commit -m "chore(release): bump $next_version [skip ci]"
else 
  echo "Skipping commit: Working tree is not clean"
fi

if [ ! -z "${CI:-}" ]; then
  git push --tags https://$GH_TOKEN@github.com/mission-apprentissage/bal.git $GITHUB_REF_NAME --force
else
  echo "Skipping push: Not in CI"
fi
