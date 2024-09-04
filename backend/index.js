const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:8080', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], 
}));

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.log('Error al conectar a la base de datos', error));

// Middleware
app.use(express.json());

// Rutas
app.use('/', userRoutes);  // Define una ruta base para los usuarios

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
