import paho.mqtt.client as mqtt
import json
import requests
import tempfile

# Nombre del usuario (puedes ajustar esto según tu lógica)
username = "Alberto"
password = "1234"

exec_inDocker = False  # True si estás intentando escribir o leer desde un Docker en la red de Mosquitto

backend_local = "http://localhost:3000"
backend_docker = "http://backend:3000"

# Configuración del broker MQTT
broker_local = "localhost"
broker_docker = "mosquitto"
port = 8883
topic = f"users/{username}/data"

# Obtener certificados desde el endpoint
def get_certificates(username, password):
    url = f"{backend_docker if exec_inDocker else backend_local}/get-certs-from-credentials"
    payload = {
        "name": username,
        "password": password
    }

    urlCA = f"{backend_docker if exec_inDocker else backend_local}/get-ca"

    try:
        response = requests.get(url, json=payload)
        response.raise_for_status()  # Lanza una excepción si la solicitud falla

        responseCA = requests.get(urlCA)
        responseCA.raise_for_status() 

        data = response.json()
        dataCA = responseCA.json()

        if "certificate" in data and "privateKey" in data and "caCert" in dataCA:
            return dataCA["caCert"], data["certificate"], data["privateKey"]
        else:
            raise ValueError("Respuesta incompleta del servidor")

    except requests.RequestException as e:
        print(f"Error al obtener certificados: {e}")
        raise

# Crear archivos temporales para certificados
def create_temp_file(content):
    with tempfile.NamedTemporaryFile(delete=False, mode='w') as temp_file:
        temp_file.write(content)
        return temp_file.name

# Función de callback para recibir mensajes
def on_message(client, userdata, message):
    payload = message.payload.decode('utf-8')
    print(f"Mensaje recibido en {message.topic}: {payload}")

# Obtener los certificados desde el endpoint
try:
    ca_cert, client_cert, client_key = get_certificates(username, password)
except Exception as e:
    print(f"Error al obtener certificados: {e}")
    exit(1)

# Crear cliente MQTT
client = mqtt.Client()

# Crear archivos temporales con los certificados
ca_cert_path = create_temp_file(ca_cert)
client_cert_path = create_temp_file(client_cert)
client_key_path = create_temp_file(client_key)

# Configurar TLS usando los archivos temporales
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
client.subscribe(topic)

# Mantener el cliente en espera de mensajes
client.loop_forever()
