#!/bin/sh
set -euo pipefail

next_version="${1}"

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
git push --tags https://$GH_TOKEN@github.com/mission-apprentissage/bal.git main --force
