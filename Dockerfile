FROM node:18-alpine as builder_root
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

FROM builder_root as root
WORKDIR /app
# Cache is not needed anymore
RUN rm -rf .yarn/cache && \
  mkdir -p /app/node_modules && \
  mkdir -p /app/server/node_modules && \
  mkdir -p /app/shared/node_modules && \
  mkdir -p /app/ui/node_modules;

##############################################################
######################    SERVER    ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_server
WORKDIR /app

COPY .yarn .yarn
COPY ./server ./server
COPY ./shared ./shared

RUN yarn --cwd server build
# Removing dev dependencies
RUN yarn workspaces focus --all --production

# Production image, copy all the files and run next
FROM node:18-alpine AS server
WORKDIR /app
RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

ENV NODE_ENV production

COPY --from=builder_server /app/server ./server
COPY --from=builder_server /app/shared ./shared
COPY --from=builder_server /app/node_modules ./node_modules

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "dist/index.js", "start"]


##############################################################
######################    UI    ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_ui
WORKDIR /app
COPY .yarn .yarn
COPY ./ui ./ui
COPY ./shared ./shared

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn --cwd ui build
# Removing dev dependencies
RUN yarn workspaces focus --all --production

# Production image, copy all the files and run next
FROM node:18-alpine AS ui
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder_ui /app/next.config.js ./
COPY --from=builder_ui /app/ui/public ./ui/public
COPY --from=builder_ui /app/ui/package.json ./ui/package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/.next/standalone ./
COPY --from=builder_ui --chown=nextjs:nodejs /app/ui/.next/static ./ui/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "ui/server"]
