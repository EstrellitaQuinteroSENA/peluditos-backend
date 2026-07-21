import { Router } from 'express';
import { getInventario, createInventario } from '../controllers/inventarioController.js';

const router = Router();

router.get('/', getInventario);
router.post('/', createInventario);

export default router;