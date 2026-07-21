/**
 * Rutas de Autenticación.
 */
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', authController.registro);
router.post('/login', authController.login);

export default router;