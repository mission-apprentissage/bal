#!/bin/sh

next_version="${1}"

cd ./ui
npm version ${next_version}
cd ../server
npm version ${next_version}
cd ../shared
npm version ${next_version}

cd ..


echo "Login sur le registry ..."
echo $GHCR_PASSWORD | docker login ghcr.io -u "$GHCR_USER" --password-stdin
echo "Logged!"

echo "Création des images docker (docker build)"

echo "Build ui:$next_version ..."
docker build . -f "ui/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$next_version" \
--label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
--label "org.opencontainers.image.description=Ui bal" \
--label "org.opencontainers.image.licenses=MIT"

echo "Building server:$next_version ..."
docker build . -f "server/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_server:"$next_version" \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Server bal" \
          --label "org.opencontainers.image.licenses=MIT"

# L'enchainement de commande plante régulièrement => Le sleep 3 résoud en partie le problème
sleep 3
echo "Push des images locales sur le registry"
echo "Pushing ui:$next_version ..."
docker push ghcr.io/mission-apprentissage/mna_bal_ui:"$next_version"
sleep 3
echo "Pushing server:$next_version ..."
docker push ghcr.io/mission-apprentissage/mna_bal_server:"$next_version"
