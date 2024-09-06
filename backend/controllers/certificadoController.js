// controllers/certificadoController.js
const Certificado = require('../models/certificadoModel');

// Subir CA a la base de datos
exports.uploadCA = async (req, res) => {
    const { caCert, caKey, serverCert, serverKey } = req.body;
    
    try {
        // Verificar si ya existe una CA en la base de datos
        const existingCA = await Certificado.findOne();
        if (existingCA) {
            return res.status(400).json({ msg: 'La CA ya existe en la base de datos' });
        }

        // Crear un nuevo documento de CA
        const certificado = new Certificado({
            caCert,
            caKey,
            serverCert,
            serverKey,
        });

        await certificado.save();
        res.json({ msg: 'CA guardada con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al guardar la CA' });
    }
};

// Obtener CA de la base de datos
exports.getCA = async (req, res) => {
    try {
        const ca = await Certificado.findOne();
        if (!ca) {
            return res.status(404).json({ msg: 'CA no encontrada' });
        }

        res.json(ca);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la CA' });
    }
};
