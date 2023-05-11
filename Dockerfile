FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN tar zxf node_modules.tar.gz
RUN rm node_modules.tar.gz
