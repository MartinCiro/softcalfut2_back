const { loginUser, verifyJWT } = require("../controller/login.controller");
const ResponseBody = require('../../../shared/model/ResponseBody.model');
const { createUser, listarUsuarios, modificarUsuario, listarPermisos, listarPermisoXUsuario, listarRoles } = require("../controller/manager.controller");
const config = require('../../../config.js');

/**
 * Callback para el endpoint `/auth/login`
 * @param { { body: {username: string, enpass: string}} } req 
 * @param { Express.Response } res 
 */
const loginAPI = async (req, res) => {
    const { username, enpass: password } = req.body;
    let message, loginResponse;

    try {
        loginResponse = await loginUser({ user: username, pass: password });
        message = new ResponseBody(loginResponse.ok, loginResponse.status_cod, loginResponse.data);
    } catch (error) {
        error.message === 'Usuario o contraseña inválida' ? message = new ResponseBody(false, 401, { message: 'Usuario o contraseña incorrectos' }) : message = new ResponseBody(false, 500, { message: 'Ocurrido un error inesperado. Por favor intente nuevamente o comuníquese con el administrador' });
    }
    return res.json(message);
};

/**
 * Callback para el endpoint `/auth/create/user`
 * @param { { body: {
 *              usuario: string,
 *              id_rol: string,
 *              habilitado: string,
 *              encpass: string,
 *            }
 *          } } req 
 * @param { Express.Response } res 
 */
const createUserAPI = async (req, res) => {
    const { username, passwd, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p  } = req.body;
    let message, createUserResponse;
    try {
        createUserResponse = await createUser({ username, passwd, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p });
        message = new ResponseBody(createUserResponse.ok, createUserResponse.status_cod, createUserResponse.data);
    } catch (error) {
        error.status_cod ? message = new ResponseBody(error.ok, error.status_cod, error.data) : message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde.' });
    }
    return res.json(message);
}


/**
 * Callback para el middleware de verificación de JWT
 * next: 
 *      req.userData = {
 *          id_user: string,
 *          correo: string,
 *          usuario: string,
 *          nombre: string,
 *          apellidos: string,
 *          id_rol: number
 *      }
 */
const isAuthenticatedMW = async (req, res, next) => {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

    const token = req.get("jwt") || req.get("Authorization");

    if (!token) return res.json( new ResponseBody(false, 403, { message: 'No se ha proporcionado token' }) );

    // Este condicional valida que el jwt proporcionado
    // tenga formato de jwt y no sea una cadena cualquiera
    if (!jwtRegex.test(token))  return res.json( new ResponseBody(false, 403, { message: 'No se ha proporcionado un token válido' }) );
    
    let verifyResponse;

    try {
        verifyResponse = await verifyJWT(token);
    } catch (error) {
        return error.message ? res.json(new ResponseBody(false, 403, error)) : res.json(new ResponseBody(false, 500, { message: 'Ocurrió un error validando el token del cliente. Por favor intente más tarde' }));
    }

    /**
     * Tras verificarse exitosamente, verifyResponse tiene la propiedad userInfo, 
     * que es la decodificación del JWT en objeto.
     * 
     * NOTA:
     * Cuando se trabaja en el ambiente de desarrollo, verifyJWT tiene una regla 
     * para no verificar la autenticidad del token. Es decir, se pueden proporcionar
     * tokens vencidos e incorrectos, mas no corruptos.
     */
    req.userData = verifyResponse.userInfo;

    // Asignación a los headers de la respuesta el nuevo token auto-regenerado
    if (verifyResponse && verifyResponse.jwt) res.set('new_token', verifyResponse.jwt)
    next();
}

/**
 * @param {number[]} roles
 * @returns {(req, res, next) => *}
 */
const checkPermissions = (roles) => {

    if (!(roles instanceof Array)) {
        throw {
            message: 'Se debe un especificar un array de números para especificar los roles'
        }
    }

    /**
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    
    return (req, res, next) => {
        const { id_rol } = req.userData;
        if (!id_rol && config.env === 'Dev') {
            console.warn('No se encontró `id_rol` en el entorno de desarrollo. Permitiendo el acceso.');
            next();
            return;
        }

        
        if (!id_rol || !roles.includes(id_rol)) {
            return res.status(403).json(new ResponseBody(
                false,
                403,
                { message: 'No posee permisos para realizar esta acción' }
            ));
        }

        next();
    }
}

/**
 * 
 * @param {{body: {
 *      correo:string, 
 *      id_sede:number, 
 *      id_rol: number, 
 *      numero_contacto: string, 
 *      habilitado: number, 
 *      id_cargo: number,
 *      clientes: any[]
 *  }
 * }} req 
 * @param {*} res 
 * @returns 
 */
const actualizarUsuarioAPI = async (req, res) => {
    const { username, id_rol, status, nombres, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = req.body;

    try {
        const updateUsuarioResponse = await modificarUsuario({ username, id_rol, status, nombres, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p });
        message = new ResponseBody(true, 200, updateUsuarioResponse);
    } catch (error) {
        error.status_cod ? message = new ResponseBody(error.ok, error.status_cod, error.data) : message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde.' });
    }
    return res.json(message);
}

module.exports = {
    loginAPI,
    createUserAPI,
    isAuthenticatedMW,
    checkPermissions,
    actualizarUsuarioAPI
}
