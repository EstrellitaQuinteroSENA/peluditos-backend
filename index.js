import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas de la aplicación
import authRoutes from './src/routes/authRoutes.js';
import pedidoRoutes from './src/routes/pedidoRoutes.js';
import productoRoutes from './src/routes/productoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de rutas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());

// Aumentamos el límite de payload a 50mb para recibir imágenes en Base64 sin error 413
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servidor de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definición de rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de PeluditosEQ operando correctamente 🐾');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});