#!/bin/sh

next_version="${1}"

echo "${2}"
echo "$@"
echo $SLACK_WEBHOOK

cd ./ui
npm version ${next_version}
cd ../server
npm version ${next_version}
cd ../shared
npm version ${next_version}
