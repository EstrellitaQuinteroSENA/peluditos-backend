import pool from '../config/db.js';

const PedidoModel = {
    // Obtener todos los pedidos (Para el Administrador)
    getAll: async () => {
        const [rows] = await pool.query(`
            SELECT p.*, d.talla, d.precio_total 
            FROM pedidos p 
            INNER JOIN disenos d ON p.id_diseno = d.id_diseno 
            ORDER BY p.fecha_pedido DESC
        `);
        return rows;
    },

    // Obtener los pedidos de un cliente específico (Para la vista "Mis Pedidos")
    getByCliente: async (identificador) => {
        const [rows] = await pool.query(`
            SELECT p.*, d.talla, d.precio_total, d.configuracion_canvas 
            FROM pedidos p 
            INNER JOIN disenos d ON p.id_diseno = d.id_diseno 
            WHERE p.cedula_cliente = ? OR p.telefono_cliente = ?
            ORDER BY p.fecha_pedido DESC
        `, [identificador, identificador]);
        return rows;
    },

    // Crear el pedido registrado desde los modales de Check-out
    create: async (nuevoPedido) => {
        const {
            id_diseno,
            nombre_cliente,
            telefono_cliente,
            tipo_entrega,
            cedula_cliente,
            departamento,
            ciudad,
            barrio,
            direccion_entrega,
            nota,
            comprobante_url,
            costo_envio,
            total
        } = nuevoPedido;

        const [result] = await pool.query(
            `INSERT INTO pedidos 
            (id_diseno, nombre_cliente, telefono_cliente, tipo_entrega, cedula_cliente, departamento, ciudad, barrio, direccion_entrega, nota, comprobante_url, costo_envio, total, estado_pedido) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente de verificación')`,
            [
                id_diseno,
                nombre_cliente,
                telefono_cliente,
                tipo_entrega,
                tipo_entrega === 'Envio' ? cedula_cliente : null,
                tipo_entrega === 'Envio' ? departamento : null,
                tipo_entrega === 'Envio' ? ciudad : null,
                tipo_entrega === 'Envio' ? barrio : null,
                tipo_entrega === 'Envio' ? direccion_entrega : 'Recogida en punto / Acordar por WhatsApp',
                nota || '',
                comprobante_url,
                tipo_entrega === 'Envio' ? (costo_envio || 0) : 0,
                total
            ]
        );

        return result.insertId;
    },

    // Cambiar estado del pedido (Solo Administrador)
    updateEstado: async (id_pedido, nuevoEstado) => {
        const [result] = await pool.query(
            'UPDATE pedidos SET estado_pedido = ? WHERE id_pedido = ?',
            [nuevoEstado, id_pedido]
        );
        return result.affectedRows > 0;
    }
};

export default PedidoModel;