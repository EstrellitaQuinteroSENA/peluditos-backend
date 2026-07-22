/**
 * Rutas para la gestión de Personalizaciones / Diseños.
 */
import express from 'express';
import disenoController from '../controllers/disenoController.js';

const router = express.Router();

router.get('/', disenoController.obtenerDisenos);
router.get('/:id', disenoController.obtenerDisenoPorId);
router.post('/', disenoController.crearDiseno);

export default router;