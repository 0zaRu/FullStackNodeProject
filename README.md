# FullStackNodeProject

# Proyecto de Aplicación con MQTT, Node.js, Vue.js, Docker y Mongo.

Este proyecto es una aplicación que utiliza MQTT para la comunicación entre un sensor simulado y un servidor backend construido con Node.js. El frontend está desarrollado con Vue.js y se gestiona con Docker para simplificar la implementación y el despliegue.

## Descripción

- **Backend**: Un servidor Node.js con Express que maneja el registro de usuarios, autenticación y almacenamiento de datos.
- **Frontend**: Una aplicación Vue.js para la autenticación de usuarios y visualización de datos.
- **MQTT**: Un sensor simulado que publica datos en un broker MQTT protegido por TLS.
- **Docker**: Contenedores para el backend, frontend, broker MQTT, MongoDB y herramientas relacionadas.

## Requisitos

- Docker y Docker Compose instalados.
- Node.js y npm (para desarrollo local si no, no hace falta).

## Estructura del Proyecto

- **/frontend**: Código fuente del frontend Vue.js.
- **/backend**: Código fuente del backend Node.js.
- **/mqtt/simulated_sensor**: Código del sensor simulado.
- **/mqtt/mosquitto**: Configuración del broker MQTT.
- **/mongo**: Datos y configuración de MongoDB.

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   ```
2. **Construir y ejecutar los contenedores** :

   ```
   docker-compose up -d 
   ```

   Y ya estaría ejecutándose todo.Para más detalles sobre la configuración de cada componente, revisa los archivos `Dockerfile` y `docker-compose.yml`, así como los archivos de configuración en sus respectivos directorios.

## Uso

* **Frontend** : Accede a la aplicación en `http://localhost:8080`. Puedes registrar nuevos usuarios, iniciar sesión y ver la lista de usuarios.
* **Backend** : El servidor backend está disponible en `http://localhost:3000`.
* **MQTT** : El broker MQTT está disponible en `localhost:8883` (TLS) y `localhost:1883` (sin TLS). La interfaz gráfica de MQTT Explorer está en `http://localhost:8082`.
* **MongoDB** : La base de datos MongoDB está accesible en `localhost:27017`. Mongo Express está disponible en `http://localhost:8081`.

## Configuración

* **Backend** : Configura las variables de entorno en el archivo `docker-compose.yml` para conectar con MongoDB.
* **Frontend** : La configuración de Axios para las llamadas HTTP se encuentra en `src/axios.js`.
* **MQTT** : Los certificados y claves para TLS están en `mqtt/mosquitto/config/certs/`.

## Desarrollo

Para desarrollar localmente el frontend y el backend, puedes usar los siguientes comandos:

1. Frontend

   ```
   cd frontend
   npm install
   npm run serve
   ```
2. Backend

   ```
   cd backend
   npm install
   npm start
   ```

Para más detalles sobre la configuración de cada componente, revisa los archivos `Dockerfile` y `docker-compose.yml`, así como los archivos de configuración en sus respectivos directorios.
