#!/bin/sh
set -euo pipefail

next_version="${1}"

cd ./ui
npm version ${next_version} --allow-same-version
cd ../server
npm version ${next_version} --allow-same-version
cd ../shared
npm version ${next_version} --allow-same-version

cd ..
