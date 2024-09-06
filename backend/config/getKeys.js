// config/getKeys.js
const Certificado = require('../models/certificadoModel');

const getKeys = async () => {
    // Recuperar la CA desde la base de datos
    const ca = await Certificado.findOne();
    if (!ca) {
        throw new Error('CA no encontrada en la base de datos');
    }

    return { ca };
}

module.exports = getKeys;