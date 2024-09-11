FROM eclipse-mosquitto:latest

# Instalar Python, pip y Flask
RUN apk update && \
    apk add --no-cache python3 py3-pip && \
    pip3 install flask

# Copiar el script de entrada y el servidor Python al contenedor
COPY entrypoint.sh /entrypoint.sh
COPY server.py /server.py

# Hacer que el script de entrada sea ejecutable
RUN chmod +x /entrypoint.sh

# Exponer el puerto para el servidor Python
EXPOSE 5000

# Usar el script de entrada como el punto de entrada
ENTRYPOINT ["/entrypoint.sh"]

# El comando que debe ejecutarse
CMD ["/entrypoint.sh"]
