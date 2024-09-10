FROM eclipse-mosquitto:latest

# Copiar el script de entrada al contenedor
COPY entrypoint.sh /entrypoint.sh

# Hacer que el script sea ejecutable
RUN chmod +x /entrypoint.sh

# Usar el script de entrada como el punto de entrada
ENTRYPOINT ["/entrypoint.sh"]
