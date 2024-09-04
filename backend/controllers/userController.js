const User = require('../models/userModel');
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar usuario
exports.registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        const payload = { userid: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m'});

        res.json({token});
    
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

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