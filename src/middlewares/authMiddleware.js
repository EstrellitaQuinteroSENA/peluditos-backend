/**
 * Middleware para verificar la validez del token JWT del usuario.
 */
import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token tras la palabra "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado.' });
    }

    try {
        // Lee la clave secreta configurada en tus variables de entorno de Render
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Inyecta los datos del usuario en la petición
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default verificarToken;