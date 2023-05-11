FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

ARG CACHEBUST=9
RUN yarn plugin import workspace-tools
RUN yarn workspaces focus --all &> /dev/null
