FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY node_modules.tar.gz node_modules.tar.gz
RUN tar zxf node_modules.tar.gz
RUN rm node_modules.tar.gz
