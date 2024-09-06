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





# # Dockerfile para el frontend Vite en modo producción

# # Usa una imagen base con Node.js para construir la aplicación
# FROM node:18 AS build

# # Crear y establecer el directorio de trabajo
# WORKDIR /usr/src/app

# # Copiar package.json y package-lock.json
# COPY ./frontend/package*.json ./

# # Instalar dependencias
# RUN npm install

# # Copiar el resto del código
# COPY ./frontend .

# # Construir el proyecto
# RUN npm run build

# # Usa una imagen base ligera para servir la aplicación
# FROM nginx:alpine

# # Copiar los archivos de build desde el contenedor de build
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# # Exponer el puerto en el que Nginx servirá la aplicación
# EXPOSE 80

# # Comando para ejecutar Nginx
# CMD ["nginx", "-g", "daemon off;"]
