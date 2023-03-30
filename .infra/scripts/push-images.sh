#!/usr/bin/env bash

cd "${0%/*}/../../../" || exit;

Help()
{
   echo "Push les images docker de BAL sur le registry github (https://ghcr.io/mission-apprentissage/)"
   echo
   echo "Utilisation : push-images.sh -v [numéro de version] -u [login] -p [GH_PAT]"
   echo
}

while getopts ":v:u:p:" option; do
  case "${option}" in
    v)
        v=${OPTARG}
        ;;
    u)
        u=${OPTARG}
        ;;
    p)
        p=${OPTARG}
        ;;
    *)
       help
       ;;
  esac
done

if [ -z "$v" ] || [ -z "$u" ] || [ -z "$p" ]; then
  Help
  exit 1
fi

read -r -p "Confirmer le numéro de version $v ? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY])
        ;;
    *)
        exit
        ;;
esac

echo "Login sur le registry ..."
echo $p | docker login ghcr.io -u "$u" --password-stdin
echo "Logged!"

# Pour enlever le message "Use 'docker scan' to run Snyk ..."
export DOCKER_SCAN_SUGGEST=false

echo "Création des images docker locales (docker build)"

echo "Build ui:$v ..."
docker build . -f "ui/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$v" \
--label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
--label "org.opencontainers.image.description=Ui bal" \
--label "org.opencontainers.image.licenses=MIT"

echo "Building server:$v ..."
docker build . -f "server/Dockerfile" --tag ghcr.io/mission-apprentissage/mna_bal_server:"$v" \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Server bal" \
          --label "org.opencontainers.image.licenses=MIT"

echo "Building reverse_proxy:$v ..."
docker build ./reverse_proxy --tag ghcr.io/mission-apprentissage/mna_bal_reverse_proxy:"$v" \
          --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
          --label "org.opencontainers.image.description=Reverse proxy bal" \
          --label "org.opencontainers.image.licenses=MIT"

# L'enchainement de commande plante régulièrement => Le sleep 3 résoud en partie le problème
sleep 3
echo "Push des images locales sur le registry"
echo "Pushing ui:$v ..."
docker push ghcr.io/mission-apprentissage/mna_bal_ui:"$v"
sleep 3
echo "Pushing server:$v ..."
docker push ghcr.io/mission-apprentissage/mna_bal_server:"$v"
sleep 3
echo "Pushing reverse_proxy:$v ..."
docker push ghcr.io/mission-apprentissage/mna_bal_reverse_proxy:"$v"
