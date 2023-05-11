FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app
# RUN mkdir -p node_modules
ADD node_modules.tar.gz /app/
COPY . .
# RUN ls -l node_modules.tar.gz
RUN tar zxvf node_modules.tar.gz
# RUN ls -l node_modules
# ARG CACHEBUST=9
# RUN yarn plugin import workspace-tools
# RUN yarn workspaces focus --all &> /dev/null
RUN yarn install --prefer-offline &> /dev/null
