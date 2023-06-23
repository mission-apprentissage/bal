#!/bin/bash
set -euo pipefail

next_version="${1}"
registry=${2:?"Veuillez préciser le registry"}

echo "Push des images locales sur le registry"
echo "Pushing ui:$next_version ..."
docker push $registry/mission-apprentissage/mna_bal_ui:"$next_version"
sleep 3
echo "Pushing server:$next_version ..."
docker push $registry/mission-apprentissage/mna_bal_server:"$next_version"

if [[ $(uname) = "Darwin" ]]; then
  sed -i '' "s/registry=.*/registry=$registry/" ".infra/env.ini"
else
  sed -i'' "s/registry=.*/registry=$registry/" ".infra/env.ini"
fi
echo "Bump registry in .infra/env.ini : $registry"

if [[ $(uname) = "Darwin" ]]; then
  sed -i '' "s/app_version=.*/app_version=$next_version/" ".infra/env.ini"
else
  sed -i'' "s/app_version=.*/app_version=$next_version/" ".infra/env.ini"
fi
echo "Bump app version in .infra/env.ini : $next_version"

if [[ $(uname) = "Darwin" ]]; then
  sed -i '' "s/default:.*/default: $next_version/" ".github/workflows/_deploy.yml"
else
  sed -i'' "s/default:.*/default: $next_version/" ".github/workflows/_deploy.yml"
fi
echo "Bump app version in _deploy.yml : $next_version"
