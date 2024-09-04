# Dockerfile para el frontend Vite en modo desarrollo
# Usa una imagen base con Node.js para el desarrollo
FROM node:18

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY ./frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY ./frontend .

# Exponer el puerto en el que Vite sirve la aplicación
EXPOSE 8080

# Comando para ejecutar el servidor de desarrollo de Vite
CMD ["npm", "run", "serve"]
