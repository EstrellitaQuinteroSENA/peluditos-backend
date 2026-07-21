/**
 * Controlador de lógica para Registro y Login de Usuarios.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usuarioModel.js';

const authController = {
    // Registro sencillo (Nombre, Correo, Password)
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

            // Encriptar la contraseña por seguridad
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);

            // Guardar usuario
            const idUsuario = await UsuarioModel.create({
                nombre_completo,
                correo,
                password: passwordHashed
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente.',
                id_usuario: idUsuario
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor al registrar usuario.', error: error.message });
        }
    },

    // Inicio de sesión
    login: async (req, res) => {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
            }

            const usuario = await UsuarioModel.findByCorreo(correo);
            if (!usuario) {
                return res.status(404).json({ message: 'Credenciales inválidas.' });
            }

            // Verificar contraseña encriptada (y dar paso al admin de prueba)
            let esValido = await bcrypt.compare(password, usuario.password);
            if (!esValido && password === usuario.password) {
                esValido = true;
            }

            if (!esValido) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            // Generar Token JWT de sesión
            const secretKey = process.env.JWT_SECRET || 'secreto_peluditos_key';
            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, rol: usuario.rol },
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
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor al iniciar sesión.', error: error.message });
        }
    }
};

export default authController;