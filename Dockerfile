ARG NODE_VERSION=20
ARG DEBIAN_VERSION=12
ARG DEBIAN_CODENAME=bookworm

# installer
FROM node:${NODE_VERSION}-${DEBIAN_CODENAME}-slim AS base

ENV LANG C.UTF-8
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store

# You may need to copy more files than just package.json in your code
COPY packages/frontend/package.json /app/package.json
COPY packages/frontend/tsconfig* /app/

RUN sed -i -e "s|\.\.\/\.\.|\.|" /app/tsconfig.build.json

WORKDIR /app
RUN pnpm -r install

COPY packages/frontend/views packages/frontend/lib packages/frontend/public packages/frontend/config.yml /app/

EXPOSE 3000
ENTRYPOINT ["node",  '/app/index.js', 'server']