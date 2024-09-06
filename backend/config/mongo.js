// config/mongo.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1); // Detener la app si no puede conectar
    }
};

module.exports = connectDB;
