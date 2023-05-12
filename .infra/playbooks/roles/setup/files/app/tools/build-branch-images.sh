#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly PROJECT_DIR="/opt/bal"
readonly REPO_DIR="/opt/bal/repository"
readonly BRANCH=${1:?"Merci de préciser le nom de la branche (ex. master)"}; shift;
readonly LOCAL_VERSION=${1:?"Merci de préciser la version local (ex. 33)"}; shift;
readonly PREVIEW_STATUS=${1:?"Merci de préciser si la preview est ouverte ou fermée (open/close)"}; shift;

function update_repository() {
    echo "Mise à jour du repository..."

    cd "${REPO_DIR}"
    git fetch
    git checkout "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
    cd -
}

function build_images() {
    echo "Build local images..."

    cd "${REPO_DIR}"
    docker build . -f "ui/Dockerfile" --build-arg DEPS_CONTEXT=local --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$LOCAL_VERSION" \
              --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
              --label "org.opencontainers.image.description=Ui bal" \
              --label "org.opencontainers.image.licenses=MIT"
     docker build . -f "server/Dockerfile" --build-arg DEPS_CONTEXT=local --tag ghcr.io/mission-apprentissage/mna_bal_server:"$LOCAL_VERSION" \
              --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
              --label "org.opencontainers.image.description=Server bal" \
              --label "org.opencontainers.image.licenses=MIT"
    cd -
}

function clean_docker() {
    echo "Removing dangling data built"
    docker system prune -f --filter "until=60h"
}

function reload_containers() {
    echo "Rechargement des conteneurs ..."

    cd "${PROJECT_DIR}"
    /usr/local/bin/docker-compose \
      -f "docker-compose.yml" \
      $(for file in $(ls docker-compose.pr-*.yml); do echo -n "-f $file "; done)  \
      --project-name bal \
      up -d --force-recreate --remove-orphans --renew-anon-volumes $*
    cd -
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"

if [ "$PREVIEW_STATUS" == "open" ]; then
    update_repository
    build_images
    sed "s/LOCAL_VERSION/$LOCAL_VERSION/g" /opt/bal/docker-compose.preview-app.yml > /opt/bal/docker-compose.pr-"$LOCAL_VERSION".yml
fi

if [ "$PREVIEW_STATUS" == "close" ]; then
    rm "/opt/bal/docker-compose.pr-$LOCAL_VERSION.yml"
fi

reload_containers
clean_docker

if [ "$PREVIEW_STATUS" == "open" ]; then
    docker exec bal_server_"$LOCAL_VERSION" yarn cli "seed"
fi
