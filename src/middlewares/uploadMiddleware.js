/**
 * Middleware para la gestión de carga y almacenamiento de archivos en la nube mediante Cloudinary.
 */
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuración de credenciales de Cloudinary mediante variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración del almacenamiento en Cloudinary (versión síncrona y segura)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        let folderName = 'peluditos_uploads/comprobantes';
        let prefix = 'comprobante';

        if (file.fieldname === 'imagen' || (req.baseUrl && req.baseUrl.includes('productos'))) {
            folderName = 'peluditos_uploads/productos';
            prefix = 'bandana';
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        return {
            folder: folderName,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            public_id: `${prefix}-${uniqueSuffix}`
        };
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite máximo de 5 MB por archivo
});

export default upload;