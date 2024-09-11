// controllers/userController.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const User = require('../models/userModel');
const Certificado = require('../models/certificadoModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Promisificar exec para usar async/await
const execAsync = util.promisify(exec);

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

        // Rutas para almacenar temporalmente los archivos de claves y certificados
        const certsDir = path.join(__dirname, 'certs');

        // Crear el directorio si no existe
        if (!fs.existsSync(certsDir)) {
            fs.mkdirSync(certsDir, { recursive: true });
        }

        const userKeyPath = path.join(certsDir, `${name}.key`);
        const userCsrPath = path.join(certsDir, `${name}.csr`);
        const userCertPath = path.join(certsDir, `${name}.crt`);

        // Generar la clave privada del usuario usando OpenSSL
        await execAsync(`openssl genpkey -algorithm RSA -out ${userKeyPath}`);

        // Crear CSR para el usuario
        const subj = `/CN=${name}`;
        await execAsync(`openssl req -new -key ${userKeyPath} -out ${userCsrPath} -subj "${subj}"`);

        // Recuperar la CA desde la base de datos
        const caData = await Certificado.findOne();
        if (!caData) {
            return res.status(500).json({ msg: 'CA no encontrada en la base de datos' });
        }

        // Escribir la CA y su clave privada en archivos temporales
        const caCertPath = path.join(certsDir, 'ca.crt');
        const caKeyPath = path.join(certsDir, 'ca.key');
        fs.writeFileSync(caCertPath, caData.caCert);
        fs.writeFileSync(caKeyPath, caData.caKey);

        // Firmar el CSR del usuario con la CA para generar el certificado del usuario
        await execAsync(`openssl x509 -req -in ${userCsrPath} -CA ${caCertPath} -CAkey ${caKeyPath} -CAcreateserial -out ${userCertPath} -days 365 -sha256`);
        fs.unlinkSync(caCertPath);
        fs.unlinkSync(userCsrPath);
        fs.unlinkSync(caKeyPath);

        // Leer el certificado y la clave privada generada en formato PEM
        const pemCert = fs.readFileSync(userCertPath, 'utf8');
        fs.unlinkSync(userCertPath);

        const pemKey = fs.readFileSync(userKeyPath, 'utf8');
        fs.unlinkSync(userKeyPath);

        fs.rmdirSync(certsDir, { recursive: true });

        // Almacenar el certificado y la clave privada en MongoDB
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
};

exports.getUsers = async () => {
    try {
        return await User.find().select('-password -__v -_id');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw new Error('Error en el servidor');
    }
};

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