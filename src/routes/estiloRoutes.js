import { Router } from 'express';
import { getEstilos, createEstilo } from '../controllers/estiloController.js';

const router = Router();

// Definición de endpoints para el recurso 'estilos'
router.get('/', getEstilos);
router.post('/', createEstilo);

export default router;