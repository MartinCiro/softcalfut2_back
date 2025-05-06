FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install -g nodemon typescript ts-node
RUN npm install --save-dev prisma
RUN npm install @prisma/client
RUN npx prisma generate

COPY . .

EXPOSE 3002