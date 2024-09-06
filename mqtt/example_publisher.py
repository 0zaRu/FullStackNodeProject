import paho.mqtt.client as mqtt

# Configuración de TLS
ca_cert = "./mqtt/simulated_sensor/certs/ca.crt"
client_cert = "./mqtt/simulated_sensor/certs/simulated_sensor.crt"
client_key = "./mqtt/simulated_sensor/certs/simulated_sensor.key"

# Crear cliente MQTT
client = mqtt.Client()

# Configurar TLS
client.tls_set(ca_cert, certfile=client_cert, keyfile=client_key)
client.tls_insecure_set(True)  # Configurar como False en producción

# Conectar al broker (en este caso, localhost en el puerto 1883)
client.connect("localhost", 8883, 60)

# Publicar un mensaje en el tema deseado
client.publish("usr/simulated_sensor/data", "Hello from Publisher!")

# Desconectarse del broker
client.disconnect()
