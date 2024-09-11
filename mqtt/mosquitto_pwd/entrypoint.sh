#!/bin/sh

# Ajustar permisos para el archivo de contraseñas y ACLs
chmod 0700 /mosquitto/config/passwords
chown mosquitto: /mosquitto/config/passwords
chmod 0700 /mosquitto/config/acls
chown mosquitto: /mosquitto/config/acls

# Iniciar el servidor Flask en segundo plano
python3 /server.py &

# Iniciar Mosquitto
exec /usr/sbin/mosquitto -c /mosquitto/config/mosquitto.conf
