// controllers/userController.js
const User = require('../models/userModel');
const Certificado = require('../models/certificadoModel'); // Esquema de CA en MongoDB
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const forge = require('node-forge');

// Registrar usuario y generar certificado
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        user = new User({
            name,
            email,
            password,
        });

        // Generar el par de claves para el usuario
        const keys = forge.pki.rsa.generateKeyPair(2048);

        // Crear una CSR (Certificate Signing Request)
        const csr = forge.pki.createCertificationRequest();
        csr.publicKey = keys.publicKey;
        csr.setSubject([{ name: 'commonName', value: name }]);
        csr.sign(keys.privateKey, forge.md.sha256.create()); // Usar SHA-256 para firmar la CSR

        // Firmar el CSR para crear el certificado
        const caData = await Certificado.findOne(); // Recuperar CA desde MongoDB
        if (!caData) {
            return res.status(500).json({ msg: 'CA no encontrada en la base de datos' });
        }

        // Parsear el certificado y la clave de la CA
        const caCert = forge.pki.certificateFromPem(caData.caCert);
        const caPrivateKey = forge.pki.privateKeyFromPem(caData.caKey);

        // Generar un número de serie único
        const generateSerialNumber = () => {
            return Math.floor(Math.random() * 1e16).toString(16).toUpperCase();
        };

        const cert = forge.pki.createCertificate();
        cert.serialNumber = generateSerialNumber();
        cert.publicKey = csr.publicKey;
        cert.setSubject(csr.subject.attributes);
        cert.setIssuer(caCert.subject.attributes);
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 100); // Certificado válido por 100 años

        // Firmar el certificado con la clave privada de la CA usando SHA-256
        cert.sign(caPrivateKey, forge.md.sha256.create());

        // Convertir el certificado y la clave privada del usuario a formato PEM
        const pemCert = forge.pki.certificateToPem(cert);
        const pemKey = forge.pki.privateKeyToPem(keys.privateKey);

        // Almacenar el certificado y clave privada en el usuario en MongoDB
        user.certificate = pemCert;
        user.privateKey = pemKey;

        await user.save();

        // Crear y enviar JWT
        const payload = { userid: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });

        res.json({ token, cert: pemCert, key: pemKey });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};


// Iniciar sesión
exports.loginUser = async (req, res) => {
    const {name, password} = req.body;

    try{
        let user = await User.findOne({ name });
        if (!user) {
            return res.status(500).json({msg: 'El usuario o correo no existe'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg: 'Contraseña incorrecta'});
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'});

        res.json({token});
    
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select('-password -__v -_id');
        res.json(users);

    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

// Obtener un usuario a partir de un certificado
exports.getCertsFromCredentials = async (req, res) => {
    const { name, password } = req.body;

    try {
        // Buscar el usuario por el nombre
        const user = await User.findOne({ name });
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Verificar si el usuario tiene certificado y clave privada
        if (!user.certificate || !user.privateKey) {
            return res.status(404).json({ msg: 'Certificado o clave privada no encontrados' });
        }

        // Enviar el certificado y la clave privada en la respuesta
        res.json({
            certificate: user.certificate,
            privateKey: user.privateKey
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};