import pool from '../config/db.js';

const EstiloModel = {
  // Obtener todos los estilos registrados
    obtenerTodos: async () => {
    const [rows] = await pool.query('SELECT * FROM estilos');
    return rows;
    },

  // Insertar un nuevo estilo en la base de datos
    crear: async (nombre, descripcion) => {
    const [result] = await pool.query(
        'INSERT INTO estilos (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
    );
    return result.insertId;
    }
};

export default EstiloModel;