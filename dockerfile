# Fase de construcción
FROM node:21-alpine3.19 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --only=production

COPY prisma ./prisma
RUN npm run build 

# Fase de producción final
FROM node:21-alpine3.19

WORKDIR /usr/src/app

# Copia solo lo necesario desde la fase de construcción
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist 
COPY . .

# Limpieza y configuración
RUN npm cache clean --force && \
    rm -rf /tmp/*

EXPOSE 3000

# Usa PM2 para producción
RUN npm install -g pm2
CMD ["pm2-runtime", "start", "dist/index.js"] 