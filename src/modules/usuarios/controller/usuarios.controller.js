const usuarioUtils = require("../utils/usuarios.utils");
const generic = require("../../generic");
const Usuario = require('../../auth/model/usuario.js');

async function listarUsuarios(options) {
  try {
    return await usuarioUtils.getUsuario(options);
  } catch (error) {
    if (error.status_cod) throw error;
    throw {
      ok: false,
      status_cod: 500,
      data: "Ha ocurrido un error consultando la información en base de datos",
    };
  }
}

/**
 *
 * @param {{
 *          nombre: string,
 *          nit: string,
 *          id_sede: string
 *        }} usuario
 * @param {number[]} obligaciones_tributarias
 */

async function modificarUsuarios(options) {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = options;

  generic.validar(numero_documento, "el identificador del usuario");
  
  const campos = { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p };

  const camposDefinidos = Object.values(campos).filter(value => value !== undefined && value !== null);

  if (camposDefinidos.length === 0) throw {
      ok: false,
      status_cod: 400,
      data: "No se ha proporcionado ningún valor a actualizar",
    };

  return generic.manejarOperacionGenerica(usuarioUtils.actualizaUsuario, options, {
    mensajeError: "Ocurrió un error inesperado al modificar el usuario",
    mensajeExito: "Usuarios actualizado correctamente"
  });
}

async function crearUsuarios(options) {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = options;
  generic.validar(user, 'el usuario');
  generic.validar(pass, 'la contraseña');
  generic.validar(id_rol, 'el rol');
  generic.validar(correo, 'el correo');
  generic.validar(numero_contacto, 'el numero de contacto');
  generic.validar(numero_documento, 'el numero de documento');
  generic.validar(nombre, 'el nombre');
  generic.validar(apellidos, 'los apellidos');
  generic.validar(fecha_nacimiento, 'la fecha de nacimiento');
  
  const usuario = Usuario(user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p);
  const userObj = {
    "nom_user": usuario.user,
    "pass": usuario.getEncryptedPassword(),
    "nombres": usuario.nombre,
    "apellido": usuario.apellidos,
    "email": usuario.correo,
    "num_contacto": usuario.numero_contacto,
    "documento": usuario.numero_documento,
    "estado": usuario.status,
    "id_rol": usuario.id_rol,
    "fecha_nacimiento": usuario.fecha_nacimiento,
    "info_perfil": usuario.info_p
  }
  return generic.manejarOperacionGenerica(usuarioUtils.insertarUsuario, {...userObj}, {
    mensajeError: "Ocurrió un error inesperado y el registro no ha sido creado",
    mensajeExito: "Registro creado correctamente"
  });
}


async function deleteUsuarios(options) {
  const { id } = options;

  generic.validar(id, "el id");
  try {
    return await usuarioUtils.deleteUsuarios({ id });
  } catch (error) {
    if (error.status_cod) throw error;
    console.log(error);
    throw {
      ok: false,
      status_cod: 500,
      data: "Ha ocurrido un error consultando la información en base de datos",
    };
  }
}

module.exports = {
  listarUsuarios,
  modificarUsuarios,
  crearUsuarios,
  deleteUsuarios
};
