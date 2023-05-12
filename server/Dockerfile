ARG DEPS_CONTEXT=release

FROM ghcr.io/mission-apprentissage/mna_bal_deps_installer:latest as deps_installer-release
WORKDIR /app
COPY . .

FROM node:18-alpine as deps_installer-local
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

RUN yarn plugin import workspace-tools
RUN yarn workspaces focus server &> /dev/null

# Rebuild the source code only when needed
FROM deps_installer-${DEPS_CONTEXT} AS builder
WORKDIR /app

# COPY --from=deps /app/. .
# COPY . .

RUN yarn --cwd server build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder ./app/. .

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "dist/index.js"]
