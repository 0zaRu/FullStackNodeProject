#!/bin/sh

# Ajustar permisos para el archivo de ACLs
chmod 0700 /mosquitto/config/acls

# Iniciar Mosquitto
exec /usr/sbin/mosquitto -c /mosquitto/config/mosquitto.conf
