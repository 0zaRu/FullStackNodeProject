// models/sensordataModel.js
const mongoose = require('mongoose');

// Definir el esquema para los datos del sensor
const sensorDataSchema = new mongoose.Schema({
    user: { type: String, required: true },
    dataType: { type: String, required: true },
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Crear el modelo
const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
