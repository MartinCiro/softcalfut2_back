# Usar la imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de la aplicación
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la app
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
