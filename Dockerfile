FROM node:22-bookworm-slim AS base
WORKDIR /app/

RUN apt update
RUN apt install -y curl libcurl3-gnutls ca-certificates
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN pnpm install --prod

FROM base AS build-deps
RUN pnpm install

FROM build-deps AS build
COPY . .
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs

