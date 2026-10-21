/**
 * Controlador de lógica para el registro y el inicio de sesión de usuarios.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usuarioModel.js';

const authController = {
    // Procesa el registro de un nuevo usuario aplicando una lista blanca de administradores
    registro: async (req, res) => {
        try {
            const { nombre_completo, correo, password } = req.body;

            if (!nombre_completo || !correo || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }

            // Valida si el correo electrónico ya se encuentra registrado en el sistema
            const usuarioExistente = await UsuarioModel.findByCorreo(correo);
            if (usuarioExistente) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
            }

            // Encripta la contraseña por seguridad utilizando un factor de costo de 10
            const passwordHashed = await bcrypt.hash(password, 10);

            // Define la lista blanca con los correos electrónicos autorizados para el acceso administrativo
            const correosAdministradoresAutorizados = [
                'admin@peluditos.com',
                'estrellita@peluditos.com' 
            ];

            // Evalúa de forma segura en el servidor si el correo ingresado pertenece a un administrador autorizado
            const rolAsignado = correosAdministradoresAutorizados.includes(correo.toLowerCase().trim()) 
                ? 'admin' 
                : 'cliente';

            // Almacena el nuevo usuario en la base de datos utilizando el modelo correspondiente
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
            console.error("🔴 ERROR EXACTO AL REGISTRAR:", error);
            // Esto enviará el error técnico exacto al frontend para verlo sin adivinar
            res.status(500).json({ 
                message: 'Error en el servidor al registrar usuario.', 
                error: error.message,
                detalles: error.sqlMessage || error.stack
            });
        }
    },

    // Gestiona el inicio de sesión mediante validación segura de credenciales con bcrypt
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

            // Genera el token JWT de sesión incorporando el rol real del usuario
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
            console.error("🔴 ERROR EXACTO AL INICIAR SESIÓN:", error);
            res.status(500).json({ 
                message: 'Error en el servidor al iniciar sesión.', 
                error: error.message,
                detalles: error.sqlMessage || error.stack
            });
        }
    }
};

export default authController;