import EstiloModel from '../models/estiloModel.js';

export const getEstilos = async (req, res) => {
try {
    const estilos = await EstiloModel.obtenerTodos();
    res.status(200).json(estilos);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener los estilos de la base de datos.' });
}
};

export const createEstilo = async (req, res) => {
const { nombre, descripcion } = req.body;

if (!nombre) {
    return res.status(400).json({ error: 'El nombre del estilo es obligatorio.' });
}

try {
    const nuevoId = await EstiloModel.crear(nombre, descripcion);
    res.status(201).json({ message: 'Estilo creado exitosamente.', id: nuevoId });
} catch (error) {
    res.status(500).json({ error: 'Error al registrar el estilo.' });
}
};