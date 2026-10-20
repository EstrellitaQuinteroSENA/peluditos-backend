/**
 * Configura las rutas para la autenticación y registro de usuarios en la API.
 */
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Define la ruta POST para procesar el registro de nuevos usuarios en el sistema
router.post('/registro', authController.registro);

// Define la ruta POST para gestionar el inicio de sesión y autenticación de usuarios
router.post('/login', authController.login);

export default router;