FROM node:18-alpine as rawDeps
WORKDIR /app
RUN yarn set version 3.3.1
COPY .yarn /app/.yarn
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarnrc.yml .yarnrc.yml
COPY ui/package.json ui/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

ARG YARN_FLAGS

RUN yarn install ${YARN_FLAGS}

FROM node:18-alpine
WORKDIR /app
COPY --from=rawDeps /app /app
# Cache is not needed anymore
RUN rm -rf .yarn/cache && \
  mkdir -p /app/node_modules && \
  mkdir -p /app/server/node_modules && \
  mkdir -p /app/shared/node_modules && \
  mkdir -p /app/ui/node_modules;
