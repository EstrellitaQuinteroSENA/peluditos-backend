import MaterialModel from '../models/materialModel.js';

export const getMateriales = async (req, res) => {
    try {
        const materiales = await MaterialModel.obtenerTodos();
        res.status(200).json(materiales);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la tabla de materiales.' });
    }
};

export const createMaterial = async (req, res) => {
    const { nombre_material, descripcion } = req.body;

    if (!nombre_material) {
        return res.status(400).json({ error: 'El nombre del material es obligatorio.' });
    }

    try {
        const result = await MaterialModel.crear({ nombre_material, descripcion });
        res.status(201).json({
        message: 'Material registrado correctamente.',
        id_material: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el material.' });
    }
};