/**
 * Modelo de datos para la gestión de Diseños y Personalizaciones de Bandanas.
 */
import pool from '../config/db.js';

const DisenoModel = {
    // Obtener todos los diseños
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM disenos ORDER BY fecha_creacion DESC');
        return rows;
    },

    // Buscar un diseño por su ID
    getById: async (id_diseno) => {
        const [rows] = await pool.query('SELECT * FROM disenos WHERE id_diseno = ?', [id_diseno]);
        return rows[0];
    },

    // Guardar una nueva personalización completa
    create: async (nuevoDiseno) => {
        const {
            id_usuario,
            talla,
            tipo_fondo,
            fondo_val,
            configuracion_canvas, // Estructura JSON con stickers, textos, posiciones, rotación y escala
            precio_total
        } = nuevoDiseno;

        // Convertir la configuración del canvas a string JSON si viene como objeto
        const canvasJSON = typeof configuracion_canvas === 'object' 
            ? JSON.stringify(configuracion_canvas) 
            : configuracion_canvas;

        const [result] = await pool.query(
            `INSERT INTO disenos 
            (id_usuario, talla, tipo_fondo, fondo_val, configuracion_canvas, precio_total) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario || null, talla, tipo_fondo, fondo_val, canvasJSON, precio_total]
        );

        return result.insertId;
    }
};

export default DisenoModel;