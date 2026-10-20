/**
 * Archivo principal del servidor backend que inicializa Express, configura los middlewares y define las rutas de la API.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa los módulos de rutas correspondientes a cada entidad de la aplicación
import authRoutes from './src/routes/authRoutes.js';
import pedidoRoutes from './src/routes/pedidoRoutes.js';
import productoRoutes from './src/routes/productoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configura las rutas de directorios y archivos para el funcionamiento con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura los middlewares globales para habilitar CORS y el procesamiento de solicitudes en formato JSON
app.use(cors());

// Amplía el límite del cuerpo de las peticiones (payload) a 50 MB para permitir la recepción de imágenes y archivos pesados
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configura el servidor para la entrega de archivos estáticos desde la carpeta de almacenamiento local
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Asocia los enrutadores principales a los prefijos correspondientes de la interfaz de programación de aplicaciones (API)
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);

// Define una ruta raíz de prueba para verificar el estado operativo del servidor
app.get('/', (req, res) => {
  res.send('Servidor de PeluditosEQ operando correctamente 🐾');
});

// Inicia la ejecución del servidor backend en el puerto asignado
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});