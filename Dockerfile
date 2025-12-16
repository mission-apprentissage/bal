FROM node:24-slim AS builder_root
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest-10

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY .npmrc .npmrc
COPY ui/package.json ui/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm typecheck

FROM builder_root AS root
WORKDIR /app

##############################################################
######################    SERVER    ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_server
WORKDIR /app

RUN pnpm --filter server build

RUN mkdir -p /app/shared/node_modules && mkdir -p /app/server/node_modules

# Production image, copy all the files and run next
FROM node:24-slim AS server
WORKDIR /app

RUN apt-get update \
  && apt-get install -y curl ca-certificates debsecan \
  && update-ca-certificates \
  && codename=$(sh -c '. /etc/os-release; echo $VERSION_CODENAME') \
  && apt-get install $(debsecan --suite $codename --format packages --only-fixed) \
  && apt-get purge -y --auto-remove debsecan \
  && apt-get clean

# Install pnpm (needed for migrations and other CLI commands)
RUN npm install -g pnpm@latest-10

RUN curl -so - https://cert.certigna.com/CertignaServerAuthenticationOVCPEUCAG1.cer \
  | openssl x509 -inform der -out /usr/local/share/ca-certificates/CertignaServerAuthenticationOVCPEUCAG1.crt \
  && openssl verify /usr/local/share/ca-certificates/CertignaServerAuthenticationOVCPEUCAG1.crt \
  && update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/CertignaServerAuthenticationOVCPEUCAG1.pem

ENV NODE_ENV=production

ARG PUBLIC_VERSION
ENV PUBLIC_VERSION=$PUBLIC_VERSION

COPY --from=builder_server /app/server ./server
COPY --from=builder_server /app/shared ./shared
COPY --from=builder_server /app/node_modules ./node_modules
COPY --from=builder_server /app/server/node_modules ./server/node_modules
COPY --from=builder_server /app/shared/node_modules ./shared/node_modules
COPY ./server/static /app/server/static

EXPOSE 5000
WORKDIR /app/server
ENV NODE_OPTIONS=--max_old_space_size=2048
CMD ["node", "dist/index.js", "start"]


##############################################################
######################      UI      ##########################
##############################################################

# Rebuild the source code only when needed
FROM root AS builder_ui
WORKDIR /app

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ARG PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=$PUBLIC_ENV

RUN pnpm --filter ui build
# RUN --mount=type=cache,target=/app/ui/.next/cache pnpm --filter ui build

# Production image, copy all the files and run next
FROM oven/bun:1-slim AS ui
WORKDIR /app

RUN apt-get update \
  && apt-get install -y curl ca-certificates \
  && update-ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

ARG PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$PUBLIC_VERSION

ARG PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=$PUBLIC_ENV

RUN groupadd --system --gid 1001 nextjs \
  && useradd --system --uid 1001 --gid nextjs nextjs

# You only need to copy next.config.mjs if you are NOT using the default configuration
COPY --from=builder_ui --chown=nextjs:nextjs /app/ui/next.config.mjs /app/
COPY --from=builder_ui --chown=nextjs:nextjs /app/ui/public /app/ui/public
COPY --from=builder_ui --chown=nextjs:nextjs /app/ui/package.json /app/ui/package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder_ui --chown=nextjs:nextjs /app/ui/.next/standalone /app/
COPY --from=builder_ui --chown=nextjs:nextjs /app/ui/.next/static /app/ui/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["bun", "--bun", "ui/server.js"]
