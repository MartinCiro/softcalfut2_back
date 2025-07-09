FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN apk update && apk add --no-cache openssh git

RUN npm install
RUN npm install -g nodemon typescript ts-node
RUN npm install --save-dev prisma
RUN npm install @prisma/client
RUN npx prisma generate

COPY . .
RUN git config --global user.email "martinciro11@gmail.com"
RUN git config --global user.name "martinciro"
EXPOSE 3002