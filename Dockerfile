ARG DEPS_CONTEXT=local

FROM node:18-alpine as deps_installer-local

RUN echo "toto"

FROM node:18-alpine as deps_installer-test

RUN ls -l

FROM deps_installer-${DEPS_CONTEXT} as final
# FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY node_modules.tar.gz node_modules.tar.gz
RUN tar zxf node_modules.tar.gz
RUN rm node_modules.tar.gz
