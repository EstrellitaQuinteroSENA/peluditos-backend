/**
 * Controlador de Recursos para el Diseñador (Colores CMYK, Patrones y Stickers)
 */
const recursoController = {
    obtenerRecursosDiseñador: async (req, res) => {
        try {
            // Paleta de colores planos segura para impresión (HEX mapeado a CMYK)
            const coloresPlanos = [
                { id: 1, nombre: 'Verde Peluditos', hex: '#1e4d3b', cmyk: '80, 30, 70, 40' },
                { id: 2, nombre: 'Menta Suave', hex: '#a8d5ba', cmyk: '30, 0, 25, 0' },
                { id: 3, nombre: 'Mostaza Cálido', hex: '#d4a326', cmyk: '15, 30, 100, 0' },
                { id: 4, nombre: 'Negro Puro', hex: '#111111', cmyk: '60, 40, 40, 100' },
                { id: 5, nombre: 'Blanco Marfil', hex: '#fdfbf7', cmyk: '0, 1, 3, 0' },
                { id: 6, nombre: 'Rojo Terracota', hex: '#b84a39', cmyk: '20, 80, 80, 10' }
            ];

            // Patrones de fondo iniciales
            const patronesFondo = [
                { id: 1, nombre: 'Patrón Huellitas', url: '/uploads/patrones/patron-huellas.png' },
                { id: 2, nombre: 'Patrón Huesitos', url: '/uploads/patrones/patron-huesos.png' },
                { id: 3, nombre: 'Patrón Estrellas', url: '/uploads/patrones/patron-estrellas.png' }
            ];

            // Stickers por defecto
            const stickers = [
                { id: 1, nombre: 'Huella Coronita', url: '/uploads/stickers/huella-corona.png', categoria: 'Iconos' },
                { id: 2, nombre: 'Corazón Peludo', url: '/uploads/stickers/corazon.png', categoria: 'Iconos' },
                { id: 3, nombre: 'Huesito Feliz', url: '/uploads/stickers/hueso.png', categoria: 'Iconos' }
            ];

            // Tipografías permitidas
            const fuentes = ['Fredoka', 'Montserrat', 'Comic Neue', 'Pacifico', 'Impact'];

            res.json({
                coloresPlanos,
                patronesFondo,
                stickers,
                fuentes
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al cargar recursos del personalizador.', error: error.message });
        }
    }
};

export default recursoController;