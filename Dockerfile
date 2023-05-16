FROM node:18-alpine as deps_installer

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

