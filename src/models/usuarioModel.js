/**
 * Modelo de datos para la gestión de usuarios y autenticación en la base de datos.
 */
import pool from '../config/db.js';

const UsuarioModel = {
    // Busca y retorna un usuario específico utilizando su correo electrónico
    findByCorreo: async (correo) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

    // Busca un usuario por su identificador único omitiendo la contraseña por razones de seguridad
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, telefono, direccion, ciudad, rol, fecha_registro FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    },

    // Registra un nuevo usuario procesando los datos básicos y asignando de forma predeterminada el rol de cliente
    create: async (nuevoUsuario) => {
        const { nombre_completo, correo, password } = nuevoUsuario;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo, password, rol) VALUES (?, ?, ?, "cliente")',
            [nombre_completo, correo, password]
        );
        return result.insertId;
    },

    // Actualiza los datos de contacto y envío correspondientes al usuario durante el proceso de compra o checkout
    updateDatosEnvio: async (id_usuario, datosEnvio) => {
        const { telefono, direccion, ciudad } = datosEnvio;
        const [result] = await pool.query(
            'UPDATE usuarios SET telefono = ?, direccion = ?, ciudad = ? WHERE id_usuario = ?',
            [telefono, direccion, ciudad, id_usuario]
        );
        return result.affectedRows > 0;
    },

    // Obtiene el listado completo de usuarios registrados ordenados de forma descendente por fecha para el panel de administración
    findAll: async () => {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, telefono, direccion, ciudad, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC'
        );
        return rows;
    }
};

export default UsuarioModel;