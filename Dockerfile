FROM mcr.microsoft.com/playwright:v1.49.1-jammy AS app

EXPOSE 465

WORKDIR /tmp/app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

RUN npx playwright install --with-deps --only-shell chromium

ENTRYPOINT npm run start
