FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN yarn set version 3.3.1
COPY .yarn /app/.yarn
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarnrc.yml .yarnrc.yml
COPY ui/package.json ui/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json
COPY node_modules node_modules
COPY server/node_module server/node_modules
COPY ui/node_module ui/node_modules
COPY shared/node_module shared/node_modules

ARG YARN_FLAGS

RUN yarn install ${YARN_FLAGS}
