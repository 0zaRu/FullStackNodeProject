// models/certificadoModel.js
const mongoose = require('mongoose');

// Definir el esquema para la colección de certificados de CA
const CertificadoSchema = new mongoose.Schema({
    caCert: {
        type: String,
        required: true,
    },
    caKey: {
        type: String,
        required: true,
    },
    serverCert: {
        type: String,
        required: true,
    },
    serverKey: {
        type: String,
        required: true,
    },
});

// Crear el modelo a partir del esquema
const Certificado = mongoose.model('Certificado', CertificadoSchema);

module.exports = Certificado;
