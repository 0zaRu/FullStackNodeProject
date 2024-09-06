import paho.mqtt.client as mqtt
import time
import json
import random
import pymongo
import os

# Nombre del usuario (puedes ajustar esto según tu lógica)
username = "admin"
mongo_inDocker = False

# Configuración de MongoDB
mongo_uri_local = "mongodb://root:1234@localhost:27017"
mongo_uri_docker = "mongodb://root:1234@mongodb:27017"
db_name = "test"
users_coll = "users"
certificados_coll = "certificados"

# Configuración del broker MQTT
mqtt_inDocker = True
broker_local = "localhost"
broker_docker = "mosquitto"
port = 8883
topic = f"{username}/simulated_sensor/data"

# Crear archivos temporales para almacenar certificados y claves
def create_temp_files(ca_cert, client_cert, client_key):
    temp_dir = "/tmp/mqtt_certs"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    ca_cert_path = os.path.join(temp_dir, "ca_cert.pem")
    client_cert_path = os.path.join(temp_dir, "client_cert.pem")
    client_key_path = os.path.join(temp_dir, "client_key.pem")
    
    with open(ca_cert_path, 'w') as f:
        f.write(ca_cert)
    
    with open(client_cert_path, 'w') as f:
        f.write(client_cert)
    
    with open(client_key_path, 'w') as f:
        f.write(client_key)
    
    return ca_cert_path, client_cert_path, client_key_path

# Eliminar archivos temporales
def delete_temp_files(*file_paths):
    for file_path in file_paths:
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error al eliminar el archivo {file_path}: {e}")

# Conectarse a MongoDB y obtener certificados
def get_certificates(username):    
    client = pymongo.MongoClient(mongo_uri_local if not mongo_inDocker else mongo_uri_docker)

    # Buscar el usuario por su nombre (Common Name - CN)
    user = client[db_name][users_coll].find_one({"name": username})
    certificado = client[db_name][certificados_coll].find_one()
    
    if user and "certificate" in user and "privateKey" in user and "caCert" in certificado:
        return certificado["caCert"], user["certificate"], user["privateKey"]
    
    else:
        raise ValueError("No se encontraron certificados para el usuario")

# Función para generar datos simulados
def generate_sensor_data():
    return {
        "temperature": random.uniform(20.0, 25.0),
        "humidity": random.uniform(30.0, 60.0)
    }

# Obtener los certificados desde MongoDB
try:
    ca_cert, client_cert, client_key = get_certificates(username)
except Exception as e:
    print(f"Error al obtener certificados: {e}")
    exit(1)

# Crear archivos temporales con los certificados
ca_cert_path, client_cert_path, client_key_path = create_temp_files(ca_cert, client_cert, client_key)

# Crear cliente MQTT
client = mqtt.Client()

# Configurar TLS con los archivos temporales
client.tls_set(ca_cert_path, certfile=client_cert_path, keyfile=client_key_path)

# Conectar al broker
try:
    client.connect(broker_local if not mqtt_inDocker else broker_docker, port)
    
    # Eliminar archivos temporales después de conectar al broker
    delete_temp_files(ca_cert_path, client_cert_path, client_key_path)
    
except Exception as e:
    print(f"Error al conectar al broker: {e}")
    delete_temp_files(ca_cert_path, client_cert_path, client_key_path)
    exit(1)

# Publicar datos en el topic
while True:
    data = generate_sensor_data()
    payload = json.dumps(data)
    client.publish(topic, payload)
    print(f"Publicado: {payload}", flush=True)
    time.sleep(2)  # Publica cada 2 segundos
