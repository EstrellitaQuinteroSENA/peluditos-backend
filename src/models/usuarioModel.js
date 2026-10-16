/**
 * Modelo de datos para la gestión de usuarios y autenticación.
 */
import pool from '../config/db.js';

const UsuarioModel = {
    // Buscar un usuario por su correo electrónico
    findByCorreo: async (correo) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

    // Buscar usuario por ID (omite la contraseña por seguridad)
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, telefono, direccion, ciudad, rol, fecha_registro FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    },

    // Registro inicial: solo Nombre, Correo y Contraseña (asigna rol 'cliente')
    create: async (nuevoUsuario) => {
        const { nombre_completo, correo, password } = nuevoUsuario;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo, password, rol) VALUES (?, ?, ?, "cliente")',
            [nombre_completo, correo, password]
        );
        return result.insertId;
    },

    // Actualizar datos de contacto/envío cuando el usuario proceda con el checkout
    updateDatosEnvio: async (id_usuario, datosEnvio) => {
        const { telefono, direccion, ciudad } = datosEnvio;
        const [result] = await pool.query(
            'UPDATE usuarios SET telefono = ?, direccion = ?, ciudad = ? WHERE id_usuario = ?',
            [telefono, direccion, ciudad, id_usuario]
        );
        return result.affectedRows > 0;
    },

    // Obtener todos los usuarios (útil para el panel de administración)
    findAll: async () => {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, telefono, direccion, ciudad, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC'
        );
        return rows;
    }
};

export default UsuarioModel;