#!/bin/bash
set -euo pipefail

next_version="${1}"

cd ./ui

UI_VERSION=$(cat package.json | jq -r '.version')
if [ $UI_VERSION != $next_version ]; then
  yarn version ${next_version}
fi;

cd ../server
SERVER_VERSION=$(cat package.json | jq -r '.version')
if [ $SERVER_VERSION != $next_version ]; then
  yarn version ${next_version}
fi;

cd ../shared
SHARED_VERSION=$(cat package.json | jq -r '.version')
if [ $SHARED_VERSION != $next_version ]; then
  yarn version ${next_version}
fi;

cd ..
