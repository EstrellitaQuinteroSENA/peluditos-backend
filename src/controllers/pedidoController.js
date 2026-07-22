import PedidoModel from '../models/pedidoModel.js';

const pedidoController = {
    obtenerTodos: async (req, res) => {
        try {
            const pedidos = await PedidoModel.getAll();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pedidos.', error: error.message });
        }
    },

    obtenerPorCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const pedidos = await PedidoModel.getByCliente(id);
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al consultar tus pedidos.', error: error.message });
        }
    },

    crearPedido: async (req, res) => {
        try {
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
                costo_envio,
                total
            } = req.body;

            // Foto del comprobante subida con Multer
            const comprobante_url = req.file ? `/uploads/comprobantes/${req.file.filename}` : null;

            if (!comprobante_url) {
                return res.status(400).json({ message: 'Debes adjuntar obligatoriamente el comprobante de pago.' });
            }

            if (!id_diseno || !nombre_cliente || !telefono_cliente || !tipo_entrega || !total) {
                return res.status(400).json({ message: 'Los datos de contacto son obligatorios.' });
            }

            // Si seleccionó Envío, exigimos los datos completos
            if (tipo_entrega === 'Envio') {
                if (!cedula_cliente || !departamento || !ciudad || !barrio || !direccion_entrega) {
                    return res.status(400).json({ 
                        message: 'Completa todos los campos de dirección requeridos para el envío.' 
                    });
                }
            }

            const idPedido = await PedidoModel.create({
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
            });

            res.status(201).json({
                message: '¡Pedido registrado con éxito!',
                id_pedido: idPedido,
                estado: 'Pendiente de verificación'
            });

        } catch (error) {
            res.status(500).json({ message: 'Error interno al guardar el pedido.', error: error.message });
        }
    },

    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado_pedido } = req.body;

            const actualizado = await PedidoModel.updateEstado(id, estado_pedido);

            if (!actualizado) {
                return res.status(404).json({ message: 'Pedido no encontrado.' });
            }

            res.json({ message: `Estado del pedido #${id} actualizado a "${estado_pedido}".` });
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar estado.', error: error.message });
        }
    }
};

export default pedidoController;