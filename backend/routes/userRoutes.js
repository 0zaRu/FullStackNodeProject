// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const certificadoController = require('../controllers/certificadoController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/main', authMiddleware, userController.getAllUsers);

router.post('/upload-ca', certificadoController.uploadCA);
router.get('/get-ca', certificadoController.getCA);

module.exports = router;