/**
 * Modelo de datos para la gestión y persistencia de pedidos en la base de datos MySQL.
 */
import pool from '../config/db.js';

const PedidoModel = {
    // Obtiene el listado completo de todos los pedidos registrados en el sistema, incorporando datos del cliente y del producto asociado (Usado por el administrador)
    getAll: async () => {
        const [rows] = await pool.query(`
            SELECT 
                p.id_pedido,
                p.id_usuario,
                COALESCE(u.nombre_completo, u.correo, 'Cliente') AS cliente_nombre,
                p.id_producto,
                p.talla_seleccionada AS talla,
                p.cantidad,
                p.precio_total AS total,
                p.telefono_contacto,
                p.tipo_entrega,
                p.cedula_cliente,
                p.ciudad,
                p.direccion_envio,
                p.comprobante_nequi,
                p.estado_pedido,
                p.fecha_pedido,
                COALESCE(prod.nombre, 'Bandana') AS nombre_producto,
                prod.imagen_url AS imagen
            FROM pedidos p 
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN productos prod ON (p.id_producto = prod.id_producto OR p.id_producto = prod.codigo)
            ORDER BY p.id_pedido DESC
        `);
        return rows;
    },

    // Consulta el historial de pedidos pertenecientes a un cliente específico filtrando por su identificador de usuario (Usado en "Mis Pedidos")
    getByCliente: async (id_usuario) => {
        const [rows] = await pool.query(`
            SELECT 
                p.id_pedido,
                p.id_usuario,
                COALESCE(u.nombre_completo, u.correo, 'Cliente') AS cliente_nombre,
                p.id_producto,
                p.talla_seleccionada AS talla,
                p.cantidad,
                p.precio_total AS total,
                p.telefono_contacto,
                p.tipo_entrega,
                p.cedula_cliente,
                p.ciudad,
                p.direccion_envio,
                p.comprobante_nequi,
                p.estado_pedido,
                p.fecha_pedido,
                COALESCE(prod.nombre, 'Bandana') AS nombre_producto,
                prod.imagen_url AS imagen
            FROM pedidos p 
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN productos prod ON (p.id_producto = prod.id_producto OR p.id_producto = prod.codigo)
            WHERE p.id_usuario = ?
            ORDER BY p.id_pedido DESC
        `, [id_usuario]);
        return rows;
    },

    // Registra un nuevo pedido en la base de datos validando los datos de envío y asignando el estado inicial predeterminado
    create: async (datos) => {
        const {
            id_usuario,
            id_producto,
            talla_seleccionada,
            cantidad,
            precio_total,
            telefono_contacto,
            tipo_entrega,
            cedula_cliente,
            ciudad,
            direccion_envio,
            comprobante_nequi
        } = datos;

        const esEnvio = tipo_entrega === 'Envio' || tipo_entrega === 'Domicilio';

        const [result] = await pool.query(
            `INSERT INTO pedidos 
            (id_usuario, id_producto, talla_seleccionada, cantidad, precio_total, telefono_contacto, tipo_entrega, cedula_cliente, ciudad, direccion_envio, comprobante_nequi, estado_pedido) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente de verificación')`,
            [
                id_usuario,
                id_producto,
                talla_seleccionada,
                cantidad,
                precio_total,
                telefono_contacto,
                tipo_entrega || 'Recoger',
                esEnvio ? cedula_cliente : null,
                esEnvio ? ciudad : null,
                esEnvio ? direccion_envio : 'Recogida en tienda',
                comprobante_nequi
            ]
        );

        return result.insertId;
    },

    // Actualiza el estado administrativo de un pedido específico según su identificador único
    updateEstado: async (id_pedido, nuevoEstado) => {
        const [result] = await pool.query(
            'UPDATE pedidos SET estado_pedido = ? WHERE id_pedido = ?',
            [nuevoEstado, id_pedido]
        );
        return result.affectedRows > 0;
    }
};

export default PedidoModel;