# Fase de construcción
FROM node:21-alpine3.19 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --include=dev && \
    npm ci --only=production

COPY prisma ./prisma

RUN npm install --include=dev --no-optional

COPY . .
RUN npm run build

# Fase de producción final
FROM node:21-alpine3.19

WORKDIR /usr/src/app

RUN npm install -g pm2

# Copia solo lo necesario desde la fase de construcción
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist 

RUN npm install --omit=dev

# Limpieza y configuración
RUN npm cache clean --force && \
    rm -rf /tmp/*

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Usa PM2 para producción
CMD ["pm2-runtime", "start", "dist/index.js"] 