#!/usr/bin/env bash
set -euo pipefail

readonly SERVER_NAME=${1:?"Missing server name parameter"};
shift

docker run \
  --rm \
  -v ./certbot/www/:/var/www/certbot/:rw \
  -v ./certbot/conf/:/etc/letsencrypt/:rw \
  --rm certbot/certbot:latest \
  certonly \
    --webroot --webroot-path /var/www/certbot/ \
    --email misson.apprentissage.devops@gmail.com \
    --agree-tos \
    --non-interactive \
    --domain ${SERVER_NAME} \
    "$@"

for containerId in $(docker ps -f name=bal_reverse_proxy --quiet)
do
  docker exec -it $containerId nginx -s reload
done
