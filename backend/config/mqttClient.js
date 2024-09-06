// config/mqttClient.js
const mqtt = require('mqtt');
const getKeys = require('./getKeys'); // Importar la función getKeys
const User = require('../models/userModel');
const sensorDataController = require('../controllers/sensorDataController');


const connectMQTT = async () => {
  try {
    // Recuperar la CA y las claves del servidor desde la base de datos
    const { ca } = await getKeys(); // Usar la función getKeys para obtener la CA
    if (!ca) {
      throw new Error('CA no encontrada en la base de datos');
    }

    
    // Configuración para conectarse al broker MQTT con TLS
    const options = {
      host: process.env.MQTT_HOST || 'mosquitto',
      port: process.env.MQTT_PORT || 8883,
      protocol: 'mqtts',
      ca: [ca.caCert], // Enviar el CA como un array de certificados
      cert: ca.serverCert,
      key: ca.serverKey,
      rejectUnauthorized: true,  // Verificar la validez del certificado
      checkServerIdentity: (host, cert) => {
        // Validar el commonName del certificado del servidor
        if (cert && cert.subject && cert.subject.CN !== 'server') {
          throw new Error('El certificado del servidor no es válido.');
        }
      }
    };

    let mqttClient = null;

    try{
      
      // Conectar al broker MQTT
      mqttClient = mqtt.connect(options);

    }catch(error){
      options.host = 'localhost';
      mqttClient = mqtt.connect(options);
    }

    mqttClient.on('connect', () => {
      console.log('Conectado al broker MQTT');
      mqttClient.subscribe('usr/simulated_sensor/data');  // Suscribirse al topic adecuado
    });

    mqttClient.on('message', async (topic, message) => {
      try {
        const topicParts = topic.split('/');
        const username = topicParts[0];  // Obtener el nombre del usuario del topic
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
