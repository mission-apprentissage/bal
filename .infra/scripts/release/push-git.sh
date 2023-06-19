#!/bin/bash
set -euo pipefail

next_version="${1}"

if [ ! -z "${CI:-}" ]; then
  git add CHANGELOG.md \
  .github/workflows/_deploy.yml \
  .infra/env.ini \
  package.json \
  server/package.json \
  shared/package.json \
  ui/package.json

  git commit -m "chore(release): bump $next_version [skip ci]"
  git push --tags --force
else
  echo "Skipping push: Not in CI"
fi
