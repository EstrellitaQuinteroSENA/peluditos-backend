import express from 'express';
import productoController from '../controllers/productoController.js';

const router = express.Router();

router.get('/', productoController.obtenerProductos);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

export default router;