/**
 * Middleware para la gestión de carga y almacenamiento de archivos físicos mediante Multer.
 */
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determina el directorio de destino según el campo del formulario o la ruta del recurso
        if (file.fieldname === 'imagen' || req.baseUrl.includes('productos')) {
            cb(null, 'uploads/productos/');
        } else {
            // Asigna los comprobantes de pago a la carpeta de almacenamiento correspondiente
            cb(null, 'uploads/comprobantes/');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        
        // Asigna un prefijo identificador según el tipo de archivo procesado
        const prefijo = (file.fieldname === 'imagen' || req.baseUrl.includes('productos')) ? 'bandana' : 'comprobante';
        
        cb(null, `${prefijo}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Define un límite máximo de almacenamiento de 5 MB por archivo
});

export default upload;