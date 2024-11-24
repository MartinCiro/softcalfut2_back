const bcryptjs = require('bcryptjs');
const config = require('../../../config');

/**
 * Módulo para encapsular las funciones de manejo de contraseñas
 * @param {string} user Nombre de usuario
 * @param {string} password Contraseña en texto claro
 * @param {number} id_rol ID del rol a asignar
 * @param {number} status Estado (por defecto 1)
 * @param {string} nombre Nombre del usuario
 * @param {string} apellidos Apellidos del usuario
 * @param {string} numero_documento Número de documento del usuario
 * @param {string} correo Correo electrónico del usuario
 * @param {string} numero_contacto Número de contacto del usuario
 * @returns {{
 *              getEncryptedPassword: () => string, 
 *              comparePassword: (password) => boolean,
 *              encodePassword: (newPass) => string,
 *              comparePasswords: (newPass, oldPassHash) => boolean,
 *              user: string, 
 *              id_rol: number,
 *              status: number,
 *              nombre: string,
 *              apellidos: string,
 *              numero_documento: string,
 *              correo: string,
 *              numero_contacto: string
 *            }}
 */
const Usuario = (user, password, id_rol, status = 1, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p) => {
    const saltRounds = parseInt(config.SALT); // Usar el número de rondas de salt desde la configuración
    const salt = bcryptjs.genSaltSync(saltRounds);
    const encryptedPassword = bcryptjs.hashSync(password || '', salt); // Encriptar la contraseña

    return {
        getEncryptedPassword: () => encryptedPassword, // Devuelve la contraseña encriptada
        comparePassword: (plainPassword) => bcryptjs.compareSync(plainPassword, encryptedPassword), // Verificar la contraseña
        encodePassword: (newPass) => {
            const newSalt = bcryptjs.genSaltSync(saltRounds); // Generar un nuevo salt
            return bcryptjs.hashSync(newPass, newSalt); // Encriptar la nueva contraseña
        },
        comparePasswords: (newPass, oldPassHash) => bcryptjs.compareSync(newPass, oldPassHash), // Comparar contraseñas
        user,
        id_rol,
        status,
        nombre,
        apellidos,
        numero_documento,
        correo,
        numero_contacto,
        fecha_nacimiento, 
        info_p
    };
};

module.exports = Usuario;
