#!/bin/bash
set -euo pipefail

next_version="${1:?"Veuillez préciser la version"}"
mode=${2:?"Veuillez préciser le mode <push|load>"}
shift 2

get_channel() {
  local version="$1"
  channel=$(echo "$version" | cut -d '-' -f 2)

  if [ "$channel" == "$version" ]; then
    channel="latest"
  fi

  echo $channel
}

if [[ $# == "0" ]]; then
  echo "Veuillez spécifier les environnements à build (production, recette, preview, local)"
  exit 1;
fi;

set +e
docker buildx create --name mna --driver docker-container --bootstrap --use 2> /dev/null
set -e

SHARED_OPS="\
        --platform linux/amd64 \
        --label "org.opencontainers.image.source=https://github.com/mission-apprentissage/bal" \
        --label "org.opencontainers.image.licenses=MIT" \
        --builder mna \
"

CACHE_OPTS=""
if [[ ! -z "${CI:-}" ]]; then
    DEPS_ID=($(md5sum ./yarn.lock))
    SHARED_OPS="${SHARED_OPS} --cache-from type=gha,scope=$DEPS_ID"
    CACHE_OPTS="\
        --cache-to type=gha,mode=min,scope=$DEPS_ID \
    "
fi

echo "Build all stages in parallel and cache yarn installs"
docker build "${ROOT_DIR}" \
        --target root \
        $SHARED_OPS \
        $CACHE_OPTS

# Declare an associative array to store the names and PIDs of the background processes
names=()
pids=()

channel=$(get_channel $next_version)

for env in "$@"
do
  echo "Start building ui:$next_version with mode=$mode; env=$env; channel=$channel"
  docker build "${ROOT_DIR}" \
    --build-arg PUBLIC_ENV="$env" \
    --build-arg PUBLIC_VERSION="$next_version" \
    --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$next_version-$env" \
    --tag ghcr.io/mission-apprentissage/mna_bal_ui:"$channel-$env" \
    --label "org.opencontainers.image.description=Ui bal" \
    --target ui \
    --${mode} \
    --quiet \
    $SHARED_OPS &

  pids+=($!)
  names+=("ui-$env")
done

echo "Start building server:$next_version with mode=$mode; channel=$channel"
docker build "${ROOT_DIR}" \
        --build-arg PUBLIC_VERSION="$next_version" \
        --tag ghcr.io/mission-apprentissage/mna_bal_server:"$next_version" \
        --tag ghcr.io/mission-apprentissage/mna_bal_server:"$channel" \
        --label "org.opencontainers.image.description=Server bal" \
        --target server \
        --${mode} \
        --quiet \
        $SHARED_OPS &

pids+=($!)
names+=("server")

final_code=0
for ((i = 0; i < ${#pids[@]}; i++)); do
  pid=${pids[i]}
  name=${names[i]}
  wait "$pid"
  status_code=$?
  final_code=$((final_code + status_code))
  echo "Process '$name' with PID $pid finished with status code: $status_code"
done

if [ "$final_code" -gt 0 ]; then
  echo "One or more background processes failed."
  exit 1
fi
