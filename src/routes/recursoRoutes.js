import express from 'express';
import recursoController from '../controllers/recursoController.js';

const router = express.Router();

router.get('/', recursoController.obtenerRecursosDiseñador);

export default router;