// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/mongo');
const mqttClient = require('./config/mqttClient');

dotenv.config();
const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

// Middleware
app.use(express.json());

// Rutas
app.use('/', userRoutes);  // Define una ruta base para los usuarios

// Conectar a MongoDB
connectDB();

// Conectar al broker MQTT
mqttClient();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
