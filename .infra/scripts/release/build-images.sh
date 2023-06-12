#!/bin/sh
set -euo pipefail

next_version="${1}"

echo "Création des images docker (docker build)"
echo "Build deps"
docker build . \
        --tag mna_bal_deps_installer:local \
        --platform linux/amd64

echo "Build ui:$next_version ..."
docker build . -f "ui/Dockerfile" \
        --platform linux/amd64 \
        --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$next_version" \
        --build-arg VERSION=$next_version \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.description=Ui bal" \
        --label "org.opencontainers.image.licenses=MIT"

echo "Building server:$next_version ..."
docker build . -f "server/Dockerfile" \
          --platform linux/amd64 \
          --progress=plain \
          --tag ghcr.io/mission-apprentissage/mna_bal_server:"$next_version" \
          --build-arg VERSION=$next_version \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Server bal" \
          --label "org.opencontainers.image.licenses=MIT"

sleep 3
