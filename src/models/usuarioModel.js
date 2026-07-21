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

    // Buscar usuario por ID
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id_usuario, nombre_completo, correo, telefono, direccion, ciudad, rol FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    },

    // Registro inicial: solo Nombre, Correo y Contraseña
    create: async (nuevoUsuario) => {
        const { nombre_completo, correo, password } = nuevoUsuario;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo, password) VALUES (?, ?, ?)',
            [nombre_completo, correo, password]
        );
        return result.insertId;
    },

    // Para cuando el usuario vaya a pagar y complete teléfono, dirección y ciudad
    updateDatosEnvio: async (id_usuario, datosEnvio) => {
        const { telefono, direccion, ciudad } = datosEnvio;
        const [result] = await pool.query(
            'UPDATE usuarios SET telefono = ?, direccion = ?, ciudad = ? WHERE id_usuario = ?',
            [telefono, direccion, ciudad, id_usuario]
        );
        return result.affectedRows > 0;
    }
};

export default UsuarioModel;