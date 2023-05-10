#!/bin/sh

next_version="${1}"

cd ./ui
npm version ${next_version}
cd ../server
npm version ${next_version}
cd ../shared
npm version ${next_version}

cd ..
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

sleep 3
echo "Push des images locales sur le registry"
echo "Pushing ui:$next_version ..."
docker push ghcr.io/mission-apprentissage/mna_bal_ui:"$next_version"
sleep 3
echo "Pushing server:$next_version ..."
docker push ghcr.io/mission-apprentissage/mna_bal_server:"$next_version"


sed -i "s/app_version=.*/app_version=$next_version/" ".infra/env.ini"
echo "Bump app version in env.ini : $next_version"

sed -i "s/default:.*/default: $next_version/" ".github/workflows/_deploy.yml"
echo "Bump app version in _deploy.yml : $next_version"

# ## Concurrency mode 
git add  CHANGELOG.md \
 CHANGELOG.md \
 .github/workflows/_deploy.yml \
 .infra/env.ini \
 package.json \
 server/package.json \
 shared/package.json \
 ui/package.json
git commit -m "chore(release): bump $next_version [skip ci]"
git merge --no-edit 
git push --tags https://$GH_TOKEN@github.com/mission-apprentissage/bal.git main --force
