FROM node:18-bullseye-slim

WORKDIR /app/

COPY package.json /app
RUN pnpm install

COPY dist /app

ENTRYPOINT ["node", "dist/server/entry.mjs"]