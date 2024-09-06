import requests
import os

# Configuración de la API del backend
API_BASE_URL = 'http://localhost:3000/'  # Ajusta la URL de tu API
CERTIFICADOS_ENDPOINT = '/upload-ca'  # Ajusta la ruta de tu endpoint para certificados

# Rutas de los certificados generados
CERTS_DIR = './mqtt/mosquitto/config/certs'  # Carpeta donde están los certificados generados

# Archivos de certificados
CA_CERT_PATH = os.path.join(CERTS_DIR, 'ca.crt')
CA_KEY_PATH = os.path.join(CERTS_DIR, 'ca.key')
SERVER_CERT_PATH = os.path.join(CERTS_DIR, 'server.crt')
SERVER_KEY_PATH = os.path.join(CERTS_DIR, 'server.key')

# Leer el contenido de los archivos de certificados
def read_cert_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()


try: 
    # Preparar datos para enviar
    data = {
        'caCert': read_cert_file(CA_CERT_PATH),
        'caKey': read_cert_file(CA_KEY_PATH),
        'serverCert': read_cert_file(SERVER_CERT_PATH),
        'serverKey': read_cert_file(SERVER_KEY_PATH)
    }
    
    # Enviar la solicitud POST al backend
    response = requests.post(API_BASE_URL + CERTIFICADOS_ENDPOINT, json=data)
    
    if response.status_code == 200:
        print(f"Certificados subidos exitosamente.")
    else:
        print(f"Error al subir el certificado: {response.text}")

except Exception as e:
    print(f"Excepción al subir el certificado: {e}")
