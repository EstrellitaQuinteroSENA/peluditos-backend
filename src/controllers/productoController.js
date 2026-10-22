/**
 * Controlador de lógica para la gestión del catálogo de productos y control de inventario.
 */
import pool from '../config/db.js';

const productoController = {
    // Obtiene el listado completo de bandanas registradas para el panel de administración y el catálogo público
    obtenerProductos: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM productos ORDER BY id_producto DESC');
            res.json(rows);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ message: 'Error al obtener productos', error: error.message });
        }
    },

    // Registra una nueva bandana procesando la carga de archivos en Cloudinary y el desglose de inventario por tallas
    crearProducto: async (req, res) => {
        try {
            const { nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            let imagen_url = null;
            if (req.file) {
                // Cloudinary nos otorga la URL pública directamente en req.file.path
                imagen_url = req.file.path;
            } else if (req.body.imagen && typeof req.body.imagen === 'string') {
                imagen_url = req.body.imagen;
            }

            // Generar un código único seguro basado en el último ID o timestamp si está vacía
            const [rowsMax] = await pool.query('SELECT MAX(id_producto) as maxId FROM productos');
            const ultimoId = rowsMax[0] && rowsMax[0].maxId ? rowsMax[0].maxId : 0;
            const codigoGenerado = `#${String(ultimoId + 1).padStart(3, '0')}`;

            const [result] = await pool.query(
                `INSERT INTO productos (codigo, nombre, estilo, material, stock_xs, stock_s, stock_m, stock_l, stock_xl, stock_total, precio, descripcion, imagen_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [codigoGenerado, nombre, estilo, material, stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, precioLimpio, descripcion, imagen_url]
            );

            res.status(201).json({ message: 'Bandana creada exitosamente', id: result.insertId });
        } catch (error) {
            console.error("Error detallado al crear producto:", error.message, error.stack);
            res.status(500).json({ message: 'Error al crear producto en MySQL', error: error.message });
        }
    },

    // Actualiza la información de una bandana existente de forma segura por su ID único
    actualizarProducto: async (req, res) => {
        try {
            let rawId = req.params.id;
            
            // Validación estricta para evitar que un ID vacío afecte toda la tabla
            if (!rawId || rawId === 'undefined' || rawId === 'null') {
                return res.status(400).json({ message: 'ID de producto inválido o no proporcionado' });
            }

            const idDecodificado = decodeURIComponent(rawId).trim();
            const idSinNumeral = idDecodificado.replace('#', '');

            const { nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            let imagen_url = null;
            if (req.file) {
                // Nueva URL pública de Cloudinary si se adjunta archivo nuevo
                imagen_url = req.file.path;
            } else if (req.body.imagen && typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
                imagen_url = req.body.imagen;
            }

            let queryUpdate = `UPDATE productos SET 
                nombre = ?, estilo = ?, material = ?, 
                stock_xs = ?, stock_s = ?, stock_m = ?, stock_l = ?, stock_xl = ?, stock_total = ?, 
                precio = ?, descripcion = ?`;
            
            let params = [
                nombre, estilo, material, 
                stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, 
                precioLimpio, descripcion
            ];

            if (imagen_url) {
                queryUpdate += `, imagen_url = ?`;
                params.push(imagen_url);
            }

            // Filtro estricto y seguro utilizando id_producto como prioridad absoluta
            queryUpdate += ` WHERE id_producto = ? OR codigo = ?`;
            params.push(idSinNumeral, idDecodificado);

            const [result] = await pool.query(queryUpdate, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró la bandana para actualizar' });
            }

            res.json({ message: 'Bandana actualizada exitosamente' });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
        }
    },

    // Elimina un producto del sistema asegurando que solo borre el registro con el ID correspondiente
    eliminarProducto: async (req, res) => {
        try {
            let rawId = req.params.id;

            // Validación estricta para prevenir borrados masivos accidentales
            if (!rawId || rawId === 'undefined' || rawId === 'null') {
                return res.status(400).json({ message: 'ID de producto inválido o no proporcionado' });
            }

            const idDecodificado = decodeURIComponent(rawId).trim();
            const idSinNumeral = idDecodificado.replace('#', '');

            const [result] = await pool.query(
                'DELETE FROM productos WHERE id_producto = ? OR codigo = ?', 
                [idSinNumeral, idDecodificado]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró la bandana para eliminar' });
            }

            res.json({ message: 'Bandana eliminada exitosamente' });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
        }
    },

    // Obtiene el catálogo de estilos desde la base de datos
    obtenerEstilos: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM estilos');
            res.json(rows);
        } catch (error) {
            console.error("Error al obtener estilos:", error);
            res.status(500).json({ message: 'Error al obtener estilos', error: error.message });
        }
    },

    // Obtiene el catálogo de materiales desde la base de datos
    obtenerMateriales: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM materiales');
            res.json(rows);
        } catch (error) {
            console.error("Error al obtener materiales:", error);
            res.status(500).json({ message: 'Error al obtener materiales', error: error.message });
        }
    }
};

export default productoController;