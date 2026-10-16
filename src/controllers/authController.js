/**
 * Controlador de lógica para Registro y Login de Usuarios.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usuarioModel.js';

const authController = {
    // Registro de nuevo usuario con Lista Blanca de Administradores
    registro: async (req, res) => {
        try {
            const { nombre_completo, correo, password } = req.body;

            if (!nombre_completo || !correo || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }

            // Validar si el correo ya está registrado
            const usuarioExistente = await UsuarioModel.findByCorreo(correo);
            if (usuarioExistente) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
            }

            // Encriptar la contraseña por seguridad con cost factor 10
            const passwordHashed = await bcrypt.hash(password, 10);

            // 🛡️ LISTA BLANCA DE ADMINISTRADORES AUTORIZADOS
            // Agrega aquí los correos electrónicos que tendrán acceso exclusivo al panel de administración
            const correosAdministradoresAutorizados = [
                'admin@peluditos.com',
                'estrellita@peluditos.com' 
            ];

            // Evaluar de forma segura en el servidor si el correo está autorizado como admin
            const rolAsignado = correosAdministradoresAutorizados.includes(correo.toLowerCase().trim()) 
                ? 'admin' 
                : 'cliente';

            // Guardar usuario usando el modelo con el rol determinado
            const idUsuario = await UsuarioModel.create({
                nombre_completo,
                correo,
                password: passwordHashed,
                rol: rolAsignado
            });

            res.status(201).json({
                message: `Usuario registrado exitosamente como ${rolAsignado}.`,
                id_usuario: idUsuario
            });
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            res.status(500).json({ 
                message: 'Error en el servidor al registrar usuario.', 
                error: error.message 
            });
        }
    },

    // Inicio de sesión (Validación segura con bcrypt)
    login: async (req, res) => {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
            }

            const usuario = await UsuarioModel.findByCorreo(correo);
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const esValido = await bcrypt.compare(password, usuario.password);
            if (!esValido) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            // Generar Token JWT de sesión incluyendo el rol real del usuario
            const secretKey = process.env.JWT_SECRET || 'secreto_peluditos_key';
            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, rol: usuario.rol || 'cliente' },
                secretKey,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Inicio de sesión exitoso.',
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre_completo: usuario.nombre_completo,
                    correo: usuario.correo,
                    rol: usuario.rol || 'cliente'
                }
            });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).json({ 
                message: 'Error en el servidor al iniciar sesión.', 
                error: error.message 
            });
        }
    }
};

export default authController;