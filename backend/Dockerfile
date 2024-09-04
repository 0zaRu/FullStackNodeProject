# Dockerfile para el backend Node.js
FROM node:18

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY ./backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY ./backend .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "./index.js"]
