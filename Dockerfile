FROM node:8-alpine

ADD . src/

WORKDIR /src

RUN npm i

EXPOSE 3000

CMD npm start