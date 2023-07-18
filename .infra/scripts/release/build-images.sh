#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ROOT_DIR="${SCRIPT_DIR}/../.."

cd ${ROOT_DIR}

next_version="${1}"
registry=${2:?"Veuillez préciser le registry"}
mode=${3:?"Veuillez préciser le mode <push|load>"}

SHARED_OPS="\
        --build-arg YARN_FLAGS="--immutable" \
        --platform linux/amd64 \
        --progress=plain \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.licenses=MIT"
"

CACHE_OPTS=""
if [[ ! -z "${CI:-}" ]]; then
    DEPS_ID=($(md5sum ./yarn.lock))
    CACHE_OPTS="\
        --cache-from type=gha,scope=$DEPS_ID \
        --cache-to type=gha,mode=min,scope=$DEPS_ID \
    "
fi

echo "Build all stages in parallel"
docker build . \
        $SHARED_OPS \
        $CACHE_OPTS

echo "Build ui:$next_version with mode=$mode"
docker build . \
        --tag $registry/mission-apprentissage/mna_bal_ui:"$next_version" \
        --label "org.opencontainers.image.description=Ui bal" \
        --target ui \
        --${mode} \
        $SHARED_OPS

echo "Building server:$next_version  with mode=$mode"
docker build . \
        --tag $registry/mission-apprentissage/mna_bal_server:"$next_version" \
        --label "org.opencontainers.image.description=Server bal" \
        --target server \
        --${mode} \
        $SHARED_OPS

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
