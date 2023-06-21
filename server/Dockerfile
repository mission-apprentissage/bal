# Rebuild the source code only when needed
FROM bal_root:latest AS builder
WORKDIR /app

COPY . .

RUN yarn --cwd server build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

ENV NODE_ENV production

COPY --from=builder ./app/. .

EXPOSE 5000
WORKDIR /app/server
CMD ["node", "dist/index.js", "start"]
