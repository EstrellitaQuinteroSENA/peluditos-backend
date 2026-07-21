import { Router } from 'express';
import { getBandanas, getBandanaByCodigo, createBandana } from '../controllers/bandanaController.js';

const router = Router();

router.get('/', getBandanas);
router.get('/:codigo', getBandanaByCodigo);
router.post('/', createBandana);

export default router;