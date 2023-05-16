# FROM ghcr.io/mission-apprentissage/mna_bal_deps_installer:latest as deps_installer-release
# WORKDIR /app
# COPY . .

# Rebuild the source code only when needed
FROM mna_bal_deps_installer:local AS builder
WORKDIR /app

# COPY --from=deps /app/. .
COPY . .

RUN yarn --cwd server build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder ./app/. .

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "dist/index.js"]
