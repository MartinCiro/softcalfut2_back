const config = require('../../../config.js');
const { insertNewUser, updateUsuario, validator } = require('../utils/manager.utils.js');
const Usuario = require('../model/usuario.js');


/**
 * Método para crear un nuevo usuario
 * @param {{
 *          usuario: string,
 *          nombre: string,
 *          apellidos: string,
 *          numero_documento: string,
 *          id_sede: string,
 *          id_rol: string,
 *          correo: string,
 *          numero_contacto: string,
 *          habilitado: string,
 *          pass: string,
 *        }} nuevoUsuario
 * @param {number[] || string[]} clientes 
 */
async function createUser(nuevoUsuario) {
    const { username, passwd, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = nuevoUsuario;
    validator(username, 'el usuario');
    validator(passwd, 'la contraseña');
    validator(id_rol, 'el rol');
    validator(correo, 'el correo');
    validator(numero_contacto, 'el numero de contacto');
    validator(numero_documento, 'el numero de documento');
    validator(nombre, 'el nombre');
    validator(apellidos, 'los apellidos');
    validator(fecha_nacimiento, 'la fecha de nacimiento');

    const usuario = Usuario(username, passwd, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p);

    const id_usuario = await insertNewUser({ ...usuario })
        .catch(error => {
            if (error.status_cod) throw error;
            console.log(error);
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado y el usuario no ha sido creado',
            }
        });

    return {
        ok: true,
        status_cod: 200,
        data: {
            id_usuario,
            message: 'El usuario fue creado con éxito',
        }
    }
}

/**
 * @param {{
 *      correo:string, 
 *      id_sede:number, 
 *      id_rol: number, 
 *      numero_contacto: string, 
 *      habilitado: number, 
 *      id_cargo:number,
 *      clientes: any[]
 *  }} options 
 */
async function modificarUsuario(options) {
    const { username, id_rol, status, nombres, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = options;

    validator(numero_documento, 'el identificador del usuario');
    validator(id_rol, 'el rol');

    await updateUsuario(options)
        .then(() => { actualizado = true; })
        .catch(error => {
            if (error.status_cod) throw error;
            throw {
                ok: false,
                status_cod: 500,
                data: 'Ocurrió un error inesperado y el usuario no ha sido actualizado',
            }
        });

    return {
        message: 'El usuario fue actualizado con éxito'
    }
}

module.exports = {
    createUser,
    modificarUsuario
}