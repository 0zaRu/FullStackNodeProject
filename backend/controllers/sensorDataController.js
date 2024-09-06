// controllers/sensorDataController.js
const SensorData = require('../models/sensorDataModel');

// Función para almacenar datos del sensor
exports.saveSensorData = async (user, sensorData) => {
    try {
        // Procesar datos de temperatura
        if ('temperature' in sensorData) {
            await SensorData.create({
                user: user,
                dataType: 'temperature',
                value: sensorData.temperature,
                timestamp: new Date(),
            });
        }
        // Procesar datos de humedad
        if ('humidity' in sensorData) {
            await SensorData.create({
                user: user,
                dataType: 'humidity',
                value: sensorData.humidity,
                timestamp: new Date(),
            });
        }
    } catch (error) {
        console.error('Error al guardar datos del sensor:', error);
    }
};
