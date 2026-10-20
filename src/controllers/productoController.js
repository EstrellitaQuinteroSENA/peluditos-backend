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

    // Registra una nueva bandana procesando la carga de archivos físicos y el desglose de inventario por tallas
    crearProducto: async (req, res) => {
        try {
            const { codigo, nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            // Determina la ruta del archivo de imagen recibido a través de la interfaz de carga
            let imagen_url = null;
            if (req.file) {
                imagen_url = `/uploads/productos/${req.file.filename}`;
            } else if (req.body.imagen && typeof req.body.imagen === 'string') {
                // Mantiene la ruta relativa en caso de recibir la cadena de texto de la imagen
                const match = req.body.imagen.match(/\/uploads\/productos\/.+/);
                imagen_url = match ? match[0] : req.body.imagen;
            }

            const [result] = await pool.query(
                `INSERT INTO productos (codigo, nombre, estilo, material, stock_xs, stock_s, stock_m, stock_l, stock_xl, stock_total, precio, descripcion, imagen_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [codigo, nombre, estilo, material, stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, precioLimpio, descripcion, imagen_url]
            );

            res.status(201).json({ message: 'Bandana creada exitosamente', id: result.insertId });
        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).json({ message: 'Error al crear producto en MySQL', error: error.message });
        }
    },

    // Actualiza la información de una bandana existente según su código o identificador único
    actualizarProducto: async (req, res) => {
        try {
            let rawId = req.params.id;
            const idDecodificado = decodeURIComponent(rawId).trim();
            const idSinNumeral = idDecodificado.replace('#', '');

            const { nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            let imagen_url = null;
            if (req.file) {
                imagen_url = `/uploads/productos/${req.file.filename}`;
            } else if (req.body.imagen && typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
                const match = req.body.imagen.match(/\/uploads\/productos\/.+/);
                imagen_url = match ? match[0] : req.body.imagen;
            }

            // Construye de forma dinámica la consulta SQL de actualización
            let queryUpdate = `UPDATE productos SET 
                nombre = ?, estilo = ?, material = ?, 
                stock_xs = ?, stock_s = ?, stock_m = ?, stock_l = ?, stock_xl = ?, stock_total = ?, 
                precio = ?, descripcion = ?`;
            
            let params = [
                nombre, estilo, material, 
                stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, 
                precioLimpio, descripcion
            ];

            // Incorpora la actualización de la imagen únicamente cuando se proporciona un nuevo archivo o ruta
            if (imagen_url) {
                queryUpdate += `, imagen_url = ?`;
                params.push(imagen_url);
            }

            queryUpdate += ` WHERE codigo = ? OR codigo = ? OR id_producto = ?`;
            params.push(idDecodificado, idSinNumeral, idSinNumeral);

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

    // Elimina un producto del sistema identificándolo por su código o identificador en la base de datos
    eliminarProducto: async (req, res) => {
        try {
            let rawId = req.params.id;
            const idDecodificado = decodeURIComponent(rawId).trim();
            const idSinNumeral = idDecodificado.replace('#', '');

            const [result] = await pool.query(
                'DELETE FROM productos WHERE codigo = ? OR codigo = ? OR id_producto = ?', 
                [idDecodificado, idSinNumeral, idSinNumeral]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró la bandana para eliminar' });
            }

            res.json({ message: 'Bandana eliminada exitosamente' });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
        }
    }
};

export default productoController;