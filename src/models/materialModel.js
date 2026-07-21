import pool from '../config/db.js';

const MaterialModel = {
  // Obtener todos los materiales registrados
    obtenerTodos: async () => {
    const query = 'SELECT * FROM materiales';
    const [rows] = await pool.query(query);
    return rows;
    },

  // Registrar un nuevo material
    crear: async (datos) => {
    const { nombre_material, descripcion } = datos;
    const query = 'INSERT INTO materiales (nombre_material, descripcion) VALUES (?, ?)';
    const [result] = await pool.query(query, [nombre_material, descripcion]);
    return result;
    }
};

export default MaterialModel;