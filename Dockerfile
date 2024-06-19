FROM node:22-bullseye-slim AS base

RUN apt update
RUN apt install -y curl libcurl3-gnutls ca-certificates
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app/
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app/
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm astro build
RUN pnpm prune --prod

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/node_modules ./node_modules

ENTRYPOINT ["node", "dist/server/entry.mjs"]