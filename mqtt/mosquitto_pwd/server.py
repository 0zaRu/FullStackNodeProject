from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

PASSWORD_FILE_PATH = '/mosquitto/config/passwords'

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Ejecutar mosquitto_passwd para agregar el usuario
    try:
        # Ejecutar el comando mosquitto_passwd
        command = ['mosquitto_passwd', '-b', PASSWORD_FILE_PATH, username, password]
        subprocess.run(command, check=True)
        return jsonify({'message': 'User added successfully'}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Asegúrate de que el directorio de contraseñas exista
    os.makedirs('/mosquitto/config', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
