import pool from '../config/db.js';

const BandanaModel = {
// Obtener todas las bandanas con información del estilo y material asociado
obtenerTodas: async () => {
    const query = `
    SELECT b.codigo_id, b.nombre, b.precio, e.nombre_estilo, m.nombre_material
    FROM bandanas b
    LEFT JOIN estilos e ON b.id_estilo = e.id_estilo
    LEFT JOIN materiales m ON b.id_material = m.id_material
    `;
    const [rows] = await pool.query(query);
    return rows;
},

// Obtener una bandana por su código de negocio (ej. B-001)
obtenerPorCodigo: async (codigoId) => {
    const query = `
    SELECT b.codigo_id, b.nombre, b.precio, e.nombre_estilo, m.nombre_material
    FROM bandanas b
    LEFT JOIN estilos e ON b.id_estilo = e.id_estilo
    LEFT JOIN materiales m ON b.id_material = m.id_material
    WHERE b.codigo_id = ?
    `;
    const [rows] = await pool.query(query, [codigoId]);
    return rows[0];
},

// Registrar una nueva bandana
crear: async (datos) => {
    const { codigo_id, nombre, precio, id_estilo, id_material } = datos;
    const query = `
    INSERT INTO bandanas (codigo_id, nombre, precio, id_estilo, id_material)
    VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [codigo_id, nombre, precio, id_estilo, id_material]);
    return result;
}
};

export default BandanaModel;