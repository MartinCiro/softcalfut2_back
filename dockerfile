FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install -g typescript
RUN npm install -g ts-node

COPY . .

EXPOSE 3002