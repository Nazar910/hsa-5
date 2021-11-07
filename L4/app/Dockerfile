FROM node:16-buster

COPY ./src ./src
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --production

ENTRYPOINT [ "npm", "start" ]
