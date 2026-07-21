import pool from '../config/db.js';

const InventarioModel = {
  // Consultar inventario disponible cruzando datos con la tabla bandanas
    obtenerTodo: async () => {
        const query = `
        SELECT i.id_inventario, i.codigo_id, b.nombre, i.talla, i.stock
        FROM inventario_tallas i
        INNER JOIN bandanas b ON i.codigo_id = b.codigo_id
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Registrar un nuevo item en inventario
    crear: async (datos) => {
        const { codigo_id, talla, stock } = datos;
        const query = 'INSERT INTO inventario_tallas (codigo_id, talla, stock) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [codigo_id, talla, stock]);
        return result;
    }
};

export default InventarioModel;