#!/bin/bash
set -euo pipefail

next_version="${1}"
registry=${2:?"Veuillez préciser le registry"}

echo "Build ui:$next_version ..."
docker build . -f "ui/Dockerfile" \
        --platform linux/amd64 \
        --tag $registry/mission-apprentissage/mna_bal_ui:"$next_version" \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.description=Ui bal" \
        --label "org.opencontainers.image.licenses=MIT"

echo "Building server:$next_version ..."
docker build . -f "server/Dockerfile" \
          --platform linux/amd64 \
          --progress=plain \
          --tag $registry/mission-apprentissage/mna_bal_server:"$next_version" \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Server bal" \
          --label "org.opencontainers.image.licenses=MIT"

sleep 3
