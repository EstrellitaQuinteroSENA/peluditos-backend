/**
 * Controlador de lógica para la Personalización interactiva de Bandanas.
 */
import DisenoModel from '../models/disenoModel.js';

const disenoController = {
    obtenerDisenos: async (req, res) => {
        try {
            const disenos = await DisenoModel.getAll();
            res.json(disenos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los diseños.', error: error.message });
        }
    },

    obtenerDisenoPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const diseno = await DisenoModel.getById(id);

            if (!diseno) {
                return res.status(404).json({ message: 'Diseño no encontrado.' });
            }

            // Parsear JSON de canvas para enviarlo estructurado al frontend
            if (diseno.configuracion_canvas && typeof diseno.configuracion_canvas === 'string') {
                diseno.configuracion_canvas = JSON.parse(diseno.configuracion_canvas);
            }

            res.json(diseno);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el diseño.', error: error.message });
        }
    },

    crearDiseno: async (req, res) => {
        try {
            const {
                id_usuario,
                talla,
                tipo_fondo,
                fondo_val,
                configuracion_canvas,
                precio_total
            } = req.body;

            // Validación de campos esenciales
            if (!talla || !tipo_fondo || !fondo_val || !precio_total) {
                return res.status(400).json({ 
                    message: 'Faltan datos requeridos (talla, tipo_fondo, fondo_val y precio_total).' 
                });
            }

            const idDisenoGuardado = await DisenoModel.create({
                id_usuario,
                talla,
                tipo_fondo,
                fondo_val,
                configuracion_canvas: configuracion_canvas || {},
                precio_total
            });

            res.status(201).json({
                message: 'Personalización guardada con éxito.',
                id_diseno: idDisenoGuardado
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al guardar la personalización.', error: error.message });
        }
    }
};

export default disenoController;