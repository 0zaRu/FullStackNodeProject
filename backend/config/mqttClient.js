// config/mqttClient.js
const mqtt = require('mqtt');
const getKeys = require('./getKeys'); // Importar la función getKeys
const User = require('../models/userModel');
const userController = require('../controllers/userController');
const sensorDataController = require('../controllers/sensorDataController');


const connectMQTT = async () => {
  // console.log('Eliminada función de conexióna mqtt (config/mqttClient.js)');
  // return;

  try {
    let options = {};

    if (process.env.TYPE_CERT === 'CERT'){
      console.log('Conectando al broker MQTT con certificados');

      // Recuperar la CA y las claves del servidor desde la base de datos
      const { ca } = await getKeys(); // Usar la función getKeys para obtener la CA
      if (!ca) {
        throw new Error('CA no encontrada en la base de datos');
      }

      // Configuración para conectarse al broker MQTT con TLS
      options = {
        host: process.env.MQTT_HOST || 'mosquitto',
        port: process.env.MQTT_PORT || 8883,
        protocol: 'mqtts',
        ca: [ca.caCert], // Enviar el CA como un array de certificados
        cert: ca.serverCert,
        key: ca.serverKey,
        rejectUnauthorized: true,  // Verificar la validez del certificado
        checkServerIdentity: (host, cert) => {
          // Validar el commonName del certificado del servidor
          if (cert && cert.subject && cert.subject.CN !== 'mosquitto') {
            throw new Error('El certificado del servidor no es válido.');
          }
        }
      };
    }else if (process.env.TYPE_CERT === 'PWD'){
      console.log('Conectando al broker MQTT con usuario y contraseña');

      options = {
        host: process.env.MQTT_HOST || 'mosquitto',
        port: process.env.MQTT_PORT || 1883,
        protocol: 'mqtt',
        
        // Autenticación con usuario y contraseña
        username: 'mosquitto',  // Usuario MQTT
        password: process.env.MQTT_SERVER_PWD,  // Contraseña MQTT
      };
    }

    let mqttClient = null;

    try{
      
      // Conectar al broker MQTT
      mqttClient = mqtt.connect(options);

    }catch(error){
      options.host = 'localhost';
      mqttClient = mqtt.connect(options);
    }

    mqttClient.on('connect', async () => {
      console.log('Conectado al broker MQTT');

      try {
      // Obtener todos los usuarios
      const users = await userController.getUsers();

      // Suscribirse a los topics de cada usuario
      users.forEach(user => {
        mqttClient.subscribe(`users/${user.name}/data`);
      });

      } catch (error) {
      console.error('Error al suscribirse a los topics de los usuarios:', error);
      }

    });

    mqttClient.on('message', async (topic, message) => {
      try {
        const topicParts = topic.split('/');
        const username = topicParts[1];  // Obtener el nombre del usuario del topic
        const sensorData = JSON.parse(message.toString());  // Parsear el mensaje a JSON

        // Guardar los datos del sensor en la base de datos
        await sensorDataController.saveSensorData(username, sensorData);
        console.log(`Datos guardados para el usuario: ${username}`);
      } catch (error) {
        console.error('Error al procesar mensaje MQTT:', error);
      }
    });

    mqttClient.on('error', (err) => {
      console.error('Error en el cliente MQTT:', err);
    });

  } catch (error) {
    console.error('Error conectando al broker MQTT:', error);
  }
};

module.exports = connectMQTT;
