#!/bin/bash
set -euo pipefail

next_version="${1}"
registry=${2:?"Veuillez préciser le registry"}
mode=${3:?"Veuillez préciser le mode <push|load>"}

EXTRA_OPTS=""
if [[ ! -z "${CI:-}" ]]; then
    DEPS_ID=($(md5sum ./yarn.lock))
    EXTRA_OPTS="\
        --cache-from type=gha,scope=$DEPS_ID \
        --cache-to type=gha,mode=max,scope=$DEPS_ID \
    "
fi

echo "Build bal_root:latest ..."
docker build . \
        --platform linux/amd64 \
        --build-arg YARN_FLAGS="--immutable" \
        --tag bal_root:latest \
        --load \
        --progress=plain \
        $EXTRA_OPTS

echo "Build ui:$next_version ..."
docker build . -f "ui/Dockerfile" \
        --platform linux/amd64 \
        --${mode} \
        --progress=plain \
        --tag $registry/mission-apprentissage/mna_bal_ui:"$next_version" \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.description=Ui bal" \
        --label "org.opencontainers.image.licenses=MIT" \
        $EXTRA_OPTS

echo "Building server:$next_version ..."
docker build . -f "server/Dockerfile" \
        --platform linux/amd64 \
        --${mode} \
        --progress=plain \
        --tag $registry/mission-apprentissage/mna_bal_server:"$next_version" \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.description=Server bal" \
        --label "org.opencontainers.image.licenses=MIT" \
        $EXTRA_OPTS

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
