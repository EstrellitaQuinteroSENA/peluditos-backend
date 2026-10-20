/**
 * Controlador de lógica para la gestión integral de pedidos y transacciones.
 */
import PedidoModel from '../models/pedidoModel.js';
import pool from '../config/db.js';

const pedidoController = {
    // Obtiene el listado completo de todos los pedidos registrados en el sistema
    obtenerTodos: async (req, res) => {
        try {
            const pedidos = await PedidoModel.getAll();
            res.json(pedidos);
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
            res.status(500).json({ message: 'Error al obtener los pedidos.', error: error.message });
        }
    },

    // Consulta los pedidos asociados a un cliente específico utilizando identificadores de sesión o parámetros
    obtenerPorCliente: async (req, res) => {
        try {
            let id_usuario = req.usuario ? req.usuario.id_usuario : (req.params.id || req.body.id_usuario);

            let pedidos = [];
            if (id_usuario) {
                pedidos = await PedidoModel.getByCliente(id_usuario);
            }

            if (!pedidos || pedidos.length === 0) {
                const [rows] = await pool.query(`
                    SELECT 
                        p.id_pedido,
                        p.id_usuario,
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
                    LEFT JOIN productos prod ON (p.id_producto = prod.id_producto OR p.id_producto = prod.codigo)
                    ORDER BY p.id_pedido DESC 
                    LIMIT 10
                `);
                pedidos = rows;
            }

            res.json(pedidos);
        } catch (error) {
            console.error("Error al consultar pedidos del cliente:", error);
            res.status(500).json({ message: 'Error al consultar tus pedidos.', error: error.message });
        }
    },

    // Procesa la creación de un nuevo pedido validando datos de envío y el comprobante de pago adjunto
    crearPedido: async (req, res) => {
        console.log("🔥 ¡LLEGÓ UNA PETICIÓN A CREAR PEDIDO!");
        console.log("BODY RECIBIDO:", req.body);
        console.log("ARCHIVO RECIBIDO:", req.file || req.files);

        try {
            const {
                id_usuario: usuarioBody,
                id_producto,
                productoId,
                id,
                codigo,
                talla_seleccionada,
                talla,
                cantidad,
                precio_total,
                total,
                telefono_contacto,
                telefono_cliente,
                tipo_entrega,
                cedula_cliente,
                ciudad,
                direccion_envio,
                direccion_entrega
            } = req.body;

            // Prioriza el usuario autenticado en la solicitud, seguido del cuerpo y un valor predeterminado como respaldo
            const id_usuario = req.usuario ? req.usuario.id_usuario : (usuarioBody || 5);
            
            const productoFinal = id_producto || productoId || id || codigo;
            const telFinal = telefono_contacto || telefono_cliente;
            const precioFinal = precio_total || total;
            const tallaFinal = talla_seleccionada || talla || 'M';
            const cantidadFinal = cantidad || 1;
            const direccionFinal = direccion_envio || direccion_entrega || 'Recogida en tienda';

            let comprobante_url = null;
            if (req.file) {
                comprobante_url = `/uploads/comprobantes/${req.file.filename}`;
            } else if (req.files && req.files.length > 0) {
                comprobante_url = `/uploads/comprobantes/${req.files[0].filename}`;
            }

            if (!comprobante_url) {
                return res.status(400).json({ message: 'Debes adjuntar el comprobante de pago.' });
            }

            if (!telFinal || !precioFinal) {
                return res.status(400).json({ message: 'El teléfono y el total son obligatorios.' });
            }

            const idPedido = await PedidoModel.create({
                id_usuario,
                id_producto: productoFinal,
                talla_seleccionada: tallaFinal,
                cantidad: cantidadFinal,
                precio_total: precioFinal,
                telefono_contacto: telFinal,
                tipo_entrega: tipo_entrega || 'Recoger',
                cedula_cliente: cedula_cliente || null,
                ciudad: ciudad || null,
                direccion_envio: direccionFinal,
                comprobante_nequi: comprobante_url
            });

            return res.status(201).json({
                message: '¡Pedido registrado con éxito!',
                id_pedido: idPedido,
                estado: 'Pendiente de verificación'
            });

        } catch (error) {
            console.error("🔥 ERROR CRÍTICO EN CONTROLADOR CREAR PEDIDO:", error);
            return res.status(500).json({ message: 'Error interno al guardar el pedido.', error: error.message });
        }
    },

    // Actualiza el estado administrativo de un pedido específico dentro del sistema
    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado_pedido } = req.body;
            const actualizado = await PedidoModel.updateEstado(id, estado_pedido);
            if (!actualizado) return res.status(404).json({ message: 'Pedido no encontrado.' });
            res.json({ message: `Estado actualizado a "${estado_pedido}".` });
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar estado.', error: error.message });
        }
    }
};

export default pedidoController;