#!/bin/bash
set -euo pipefail

next_version="${1}"
registry=${2:?"Veuillez préciser le registry"}

DEPS_ID=($(md5sum ./yarn.lock))

EXTRA_OPTS=""
if [[ ! -z "$CI" ]]; then
    EXTRA_OPTS="\
        --cache-from type=gha,scope=$DEPS_ID \
        --cache-to type=gha,mode=max,scope=$DEPS_ID \
    "
fi

echo "Build bal_root:latest ..."
docker buildx . \
        --platform linux/amd64 \
        --build-arg YARN_FLAGS="--immutable" \
        --tag bal_root:latest \
        $EXTRA_OPTS

echo "Build ui:$next_version ..."
docker buildx . -f "ui/Dockerfile" \
        --platform linux/amd64 \
        --tag $registry/mission-apprentissage/mna_bal_ui:"$next_version" \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.description=Ui bal" \
        --label "org.opencontainers.image.licenses=MIT"

echo "Building server:$next_version ..."
docker buildx . -f "server/Dockerfile" \
          --platform linux/amd64 \
          --progress=plain \
          --tag $registry/mission-apprentissage/mna_bal_server:"$next_version" \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Server bal" \
          --label "org.opencontainers.image.licenses=MIT"

sleep 3
