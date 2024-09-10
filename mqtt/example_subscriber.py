import paho.mqtt.client as mqtt
import os

# Nombre del usuario (puedes ajustar esto según tu lógica)
username1 = "Alberto"
username2 = "Alberto0"
username3 = "admin"
password = "1234"

exec_inDocker = False  # True si estás intentando escribir o leer desde un Docker en la red de Mosquitto

backend_local = "http://localhost:3000"
backend_docker = "http://backend:3000"

# Configuración del broker MQTT
broker_local = "localhost"
broker_docker = "mosquitto"
port = 8883
topic1 = f"users/{username1}/data"
topic2 = f"users/{username2}/data"
topic3 = f"users/{username3}/data"

# Rutas de certificados y claves
certs_dir = "./mqtt/mosquitto/config/certs/"
ca_cert_path = os.path.join(certs_dir, 'ca.crt')
client_cert_path = os.path.join(certs_dir, 'server.crt')
client_key_path = os.path.join(certs_dir, 'server.key')

# Función de callback para recibir mensajes
def on_message(client, userdata, message):
    payload = message.payload.decode('utf-8')
    print(f"Mensaje recibido en {message.topic}: {payload}")

# Crear cliente MQTT
client = mqtt.Client()

# Configurar TLS usando los archivos de certificados y clave
client.tls_set(ca_cert_path, certfile=client_cert_path, keyfile=client_key_path)

# Configurar el callback para recibir mensajes
client.on_message = on_message

# Conectar al broker
try:
    client.connect(broker_docker if exec_inDocker else broker_local, port)
except Exception as e:
    print(f"Error al conectar al broker: {e}")
    exit(1)

# Suscribirse al topic
client.subscribe(topic1)
client.subscribe(topic2)
client.subscribe(topic3)

# Mantener el cliente en espera de mensajes
client.loop_forever()
