FROM node:16-buster

WORKDIR /app
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./nest-cli.json ./nest-cli.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm install
RUN pnpm build

ENTRYPOINT [ "pnpm", "run", "start:prod" ]
