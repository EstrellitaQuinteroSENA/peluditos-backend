import BandanaModel from '../models/bandanaModel.js';

export const getBandanas = async (req, res) => {
try {
    const bandanas = await BandanaModel.obtenerTodas();
    res.status(200).json(bandanas);
} catch (error) {
    res.status(500).json({ error: 'Error al consultar las bandanas en la base de datos.' });
}
};

export const getBandanaByCodigo = async (req, res) => {
const { codigo } = req.params;
try {
    const bandana = await BandanaModel.obtenerPorCodigo(codigo);
    if (!bandana) {
    return res.status(404).json({ error: 'Bandana no encontrada.' });
    }
    res.status(200).json(bandana);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener la bandana solicitada.' });
}
};

export const createBandana = async (req, res) => {
const { codigo_id, nombre, precio, id_estilo, id_material } = req.body;

if (!codigo_id || !nombre || !precio) {
    return res.status(400).json({ error: 'El código, nombre y precio son campos obligatorios.' });
}

try {
    await BandanaModel.crear({ codigo_id, nombre, precio, id_estilo, id_material });
    res.status(201).json({ message: 'Bandana registrada exitosamente.', codigo_id });
} catch (error) {
    res.status(500).json({ error: 'Error al registrar la bandana.' });
}
};