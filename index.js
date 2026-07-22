import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/config/db.js';
import estiloRoutes from './src/routes/estiloRoutes.js';
import bandanaRoutes from './src/routes/bandanaRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import inventarioRoutes from './src/routes/inventarioRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import disenoRoutes from './src/routes/disenoRoutes.js';
import recursoRoutes from './src/routes/recursoRoutes.js';
import pedidoRoutes from './src/routes/pedidoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de middlewares globales
app.use(cors());
app.use(express.json());

// Servir la carpeta de archivos estáticos (imágenes de comprobantes, stickers, etc.)
app.use('/uploads', express.static('uploads'));

// Registro de los módulos de rutas del sistema
app.use('/api/estilos', estiloRoutes);
app.use('/api/bandanas', bandanaRoutes);
app.use('/api/materiales', materialRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/disenos', disenoRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta base para verificación del estado del servidor
app.get('/', (req, res) => {
    res.send('Servidor de PeluditosEQ operando correctamente.');
});

// Inicialización del servicio
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});