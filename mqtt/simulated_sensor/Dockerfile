# Dockerfile
FROM python:3.9-slim

RUN pip install paho-mqtt
RUN pip install requests

RUN mkdir /mqtt
RUN mkdir /mqtt/simulated_sensor

# Copiar certificados al contenedor
COPY . /mqtt/simulated_sensor

WORKDIR /mqtt/..

ENTRYPOINT ["python", "/mqtt/simulated_sensor/sensor.py"]
