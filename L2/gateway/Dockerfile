FROM node:16-buster

COPY ./index.js .
COPY ./constants.js .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

ENTRYPOINT [ "npm", "start" ]
