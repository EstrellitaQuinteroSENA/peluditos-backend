/**
 * Configura las rutas para la gestión y procesamiento de pedidos y transacciones en la API.
 */
import express from 'express';
import pedidoController from '../controllers/pedidoController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Define la ruta GET para obtener el listado general de todos los pedidos registrados
router.get('/', pedidoController.obtenerTodos);

// Define las rutas GET para consultar el historial de pedidos asociados al cliente autenticado o por identificador
router.get('/mis-pedidos', pedidoController.obtenerPorCliente);
router.get('/cliente/:id', pedidoController.obtenerPorCliente);

// Define la ruta POST para procesar la creación de un nuevo pedido incluyendo archivos físicos mediante Multer
router.post('/', upload.any(), pedidoController.crearPedido);

// Define la ruta PATCH para actualizar el estado administrativo de un pedido específico
router.patch('/:id/estado', pedidoController.cambiarEstado);

export default router;