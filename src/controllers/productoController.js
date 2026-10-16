import pool from '../config/db.js';

const productoController = {
    // Obtener todas las bandanas (para el Admin y el Catálogo Público)
    obtenerProductos: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM productos ORDER BY id_producto DESC');
            res.json(rows);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ message: 'Error al obtener productos', error: error.message });
        }
    },

    // Crear bandana
    crearProducto: async (req, res) => {
        try {
            const { codigo, nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion, imagen } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            const [result] = await pool.query(
                `INSERT INTO productos (codigo, nombre, estilo, material, stock_xs, stock_s, stock_m, stock_l, stock_xl, stock_total, precio, descripcion, imagen_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [codigo, nombre, estilo, material, stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, precioLimpio, descripcion, imagen]
            );

            res.status(201).json({ message: 'Bandana creada exitosamente', id: result.insertId });
        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).json({ message: 'Error al crear producto en MySQL', error: error.message });
        }
    },

    // Actualizar bandana
    actualizarProducto: async (req, res) => {
        try {
            // Decodificar la URL para transformar %23 en # y limpiar espacios
            let rawId = req.params.id;
            const idDecodificado = decodeURIComponent(rawId).trim();
            const idSinNumeral = idDecodificado.replace('#', '');

            const { nombre, estilo, material, stockXS, stockS, stockM, stockL, stockXL, stockTotal, precio, descripcion, imagen } = req.body;
            const precioLimpio = typeof precio === 'string' ? precio.replace(',', '.') : precio;

            // Intentamos actualizar buscando tanto por el código exacto, como limpio o por su id numérico
            const [result] = await pool.query(
                `UPDATE productos SET 
                    nombre = ?, estilo = ?, material = ?, 
                    stock_xs = ?, stock_s = ?, stock_m = ?, stock_l = ?, stock_xl = ?, stock_total = ?, 
                    precio = ?, descripcion = ?, imagen_url = ? 
                 WHERE codigo = ? OR codigo = ? OR id_producto = ?`,
                [
                    nombre, estilo, material, 
                    stockXS || 0, stockS || 0, stockM || 0, stockL || 0, stockXL || 0, stockTotal || 0, 
                    precioLimpio, descripcion, imagen, 
                    idDecodificado, idSinNumeral, idSinNumeral
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró la bandana para actualizar' });
            }

            res.json({ message: 'Bandana actualizada exitosamente' });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
        }
    },

    // Eliminar bandana
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