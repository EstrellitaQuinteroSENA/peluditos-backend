import InventarioModel from '../models/inventarioModel.js';

export const getInventario = async (req, res) => {
    try {
        const inventario = await InventarioModel.obtenerTodo();
        res.status(200).json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar el inventario.' });
    }
};

export const createInventario = async (req, res) => {
    const { codigo_id, talla, stock } = req.body;

    if (!codigo_id || !talla || stock === undefined) {
        return res.status(400).json({ error: 'El código de la bandana, la talla y el stock son obligatorios.' });
    }

    try {
        const result = await InventarioModel.crear({ codigo_id, talla, stock });
        res.status(201).json({
        message: 'Inventario registrado correctamente.',
        id_inventario: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el stock en inventario.' });
    }
};