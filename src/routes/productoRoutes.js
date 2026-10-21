/**
 * Configura las rutas para la gestión, consulta y administración del catálogo de productos en la API.
 */
import express from 'express';
import productoController from '../controllers/productoController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Define la ruta GET para obtener el listado completo de productos registrados
router.get('/', productoController.obtenerProductos);

// ----------------------------------------------------
// NUEVAS RUTAS PARA ESTILOS Y MATERIALES DINÁMICOS
// ----------------------------------------------------
router.get('/estilos', productoController.obtenerEstilos);
router.get('/materiales', productoController.obtenerMateriales);

// Define la ruta POST para registrar un nuevo producto incorporando el archivo de imagen mediante Multer
router.post('/', upload.single('imagen'), productoController.crearProducto);

// Define la ruta PUT para actualizar la información y la imagen de un producto específico según su identificador
router.put('/:id', upload.single('imagen'), productoController.actualizarProducto);

// Define la ruta DELETE para eliminar un producto del sistema a partir de su identificador
router.delete('/:id', productoController.eliminarProducto);

export default router;