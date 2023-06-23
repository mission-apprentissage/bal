# Rebuild the source code only when needed
FROM bal_root:latest AS builder
WORKDIR /app

COPY .yarn .yarn
COPY ./server ./server
COPY ./shared ./shared

RUN yarn --cwd server build
# Removing dev dependencies
RUN yarn workspaces focus --all --production

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

ENV NODE_ENV production

COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "dist/index.js", "start"]
