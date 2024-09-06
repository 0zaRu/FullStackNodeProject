import paho.mqtt.client as mqtt
import ssl
import time
import json
import random
import os

# Configuración del broker MQTT
broker = "mosquitto"
port = 8883
topic = "usr/simulated_sensor/data"

# Configuración de TLS
ca_cert = "/mqtt/simulated_sensor/certs/ca.crt"
client_cert = "/mqtt/simulated_sensor/certs/simulated_sensor.crt"
client_key = "/mqtt/simulated_sensor/certs/simulated_sensor.key"

# Crear cliente MQTT
client = mqtt.Client()

# Configurar TLS
client.tls_set(ca_cert, certfile=client_cert, keyfile=client_key)
client.tls_insecure_set(True)  # Configurar como False en producción

# try:
    # Conectar al broker
client.connect(broker, port)

# except Exception as e:
#     # client.connect('localhost', port)
#     pass

# Función para generar datos simulados
def generate_sensor_data():
    return {
        "temperature": random.uniform(20.0, 25.0),
        "humidity": random.uniform(30.0, 60.0)
    }

# Publicar datos en el topic
while True:
    data = generate_sensor_data()

    payload = json.dumps(data)
    
    client.publish(topic, payload)
    
    print(f"Publicado: {payload}", flush=True)
    time.sleep(60)  # Publica cada 60 segundos
