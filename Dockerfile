FROM node:slim AS app

WORKDIR /tmp/app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

ENTRYPOINT npm run start