/**
 * Configura las rutas para la gestión y procesamiento de pedidos y transacciones en la API.
 */
import express from 'express';
import pedidoController from '../controllers/pedidoController.js';
import upload from '../middlewares/uploadMiddleware.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Define la ruta GET para obtener el listado general de todos los pedidos registrados
router.get('/', verificarToken, pedidoController.obtenerTodos);

// Define las rutas GET para consultar el historial de pedidos asociados al cliente autenticado o por identificador
router.get('/mis-pedidos', verificarToken, pedidoController.obtenerPorCliente);
router.get('/cliente/:id', verificarToken, pedidoController.obtenerPorCliente);

// Define la ruta POST para procesar la creación de un nuevo pedido incluyendo archivos físicos mediante Multer
router.post('/', verificarToken, upload.any(), pedidoController.crearPedido);

// Define la ruta PUT para actualizar el estado administrativo de un pedido específico
router.put('/:id/estado', verificarToken, pedidoController.cambiarEstado);

export default router;