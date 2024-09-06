import paho.mqtt.client as mqtt

# Función de callback que se ejecuta cuando se recibe un mensaje
def on_message(client, userdata, message):
    print(f"Received message on topic {message.topic}: {message.payload.decode('utf-8')}")

# Configuración de TLS
ca_cert = "./mqtt/simulated_sensor/certs/ca.crt"
client_cert = "./mqtt/mosquitto/config/certs/server.crt"
client_key = "./mqtt/mosquitto/config/certs/server.key"

# Crear cliente MQTT
client = mqtt.Client()

# Configurar TLS
client.tls_set(ca_cert, certfile=client_cert, keyfile=client_key)
client.tls_insecure_set(True)  # Configurar como False en producción

# Asignar la función de callback
client.on_message = on_message

# Conectar al broker (en este caso, localhost en el puerto 1883)
# client.connect("localhost", 1883, 60)
client.connect("localhost", 8883, 60)

# Suscribirse al tema deseado
client.subscribe("usr/simulated_sensor/data")

# Iniciar el loop para mantener la conexión y procesar mensajes
client.loop_forever()
