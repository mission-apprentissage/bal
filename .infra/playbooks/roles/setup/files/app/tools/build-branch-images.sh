#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly REPO_DIR="/opt/bal/repository"
readonly BRANCH=${1:?"Merci de préciser le nom de la branche (ex. master)"}; shift;
readonly LOCAL_VERSION=${1:?"Merci de préciser la version local (ex. pr_33)"}; shift;

function update_repository() {
    echo "Mise à jour du repository..."

    cd "${REPO_DIR}"
    git fetch
    git checkout "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
    cd -
}

function build_images() {
    echo "Mise à jour du repository..."

    cd "${REPO_DIR}"
    docker build . -f "ui/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$LOCAL_VERSION" \
              --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
              --label "org.opencontainers.image.description=Ui bal" \
              --label "org.opencontainers.image.licenses=MIT"
     docker build . -f "server/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_server:"$LOCAL_VERSION" \
              --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
              --label "org.opencontainers.image.description=Server bal" \
              --label "org.opencontainers.image.licenses=MIT"
    cd -
}

function clean_docker() {
    echo "Removing dangling data built two weeks ago..."
    docker system prune -f --filter "until=360h"
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
update_repository
build_images

sed -i "s/ghcr.io/mission-apprentissage/mna_bal_ui:.*/ghcr.io/mission-apprentissage/mna_bal_ui:$LOCAL_VERSION/" "/opt/bal/docker-compose.preview-app.yml"
sed -i "s/ghcr.io/mission-apprentissage/mna_bal_server:.*/ghcr.io/mission-apprentissage/mna_bal_server:$LOCAL_VERSION/" "/opt/bal/docker-compose.preview-app.yml"

clean_docker
