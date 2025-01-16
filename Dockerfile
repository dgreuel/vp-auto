FROM mcr.microsoft.com/playwright:v1.49.1-jammy AS app

EXPOSE 465

WORKDIR /tmp/app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

ENTRYPOINT npm run start