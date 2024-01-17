FROM node:slim AS app

COPY --chown=node:node --chmod=755 fonts/ /usr/share/fonts
RUN apt-get update; apt-get install -y fontconfig && fc-cache -f -v
# RUN fc-cache -f -v

WORKDIR /tmp/app

COPY package.json package-lock.json ./

# COPY --chown=node:node --chmod=755 fonts/ ./usr/local/share/fonts

RUN npm ci

COPY ./ ./

RUN npm run build

ENTRYPOINT npm run start:stream