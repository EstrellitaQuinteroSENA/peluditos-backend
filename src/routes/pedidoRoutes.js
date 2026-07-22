import express from 'express';
import pedidoController from '../controllers/pedidoController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', pedidoController.obtenerTodos);
router.get('/cliente/:id', pedidoController.obtenerPorCliente);
router.post('/', upload.single('comprobante'), pedidoController.crearPedido);
router.patch('/:id/estado', pedidoController.cambiarEstado);

export default router;