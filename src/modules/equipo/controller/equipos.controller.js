const equipoUtils = require("../utils/equipos.utils.js");
const generic = require("../../generic.js");
const Usuario = require('../../auth/model/equipo.js');

async function listarEquipos(options) {
  try {
    generic.validar(options.nombre_equipo, "el nombre del equipo");
    generic.validar(options.documento, "el identificador del usuario");
    return await equipoUtils.getEquipo(options);
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
 *        }} equipo
 * @param {number[]} obligaciones_tributarias
 */
async function modificarEquipos(options) {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = options;

  generic.validar(numero_documento, "el identificador del equipo");
  
  const campos = { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p };

  const camposDefinidos = Object.values(campos).filter(value => value !== undefined && value !== null);

  if (camposDefinidos.length === 0) throw {
      ok: false,
      status_cod: 400,
      data: "No se ha proporcionado ningún valor a actualizar",
    };

  return generic.manejarOperacionGenerica(equipoUtils.actualizaEquipo, options, {
    mensajeError: "Ocurrió un error inesperado al modificar el equipo",
    mensajeExito: "Equipos actualizado correctamente"
  });
}

async function crearEquipos(options) {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = options;
  generic.validar(user, 'el equipo');
  generic.validar(pass, 'la contraseña');
  generic.validar(id_rol, 'el rol');
  generic.validar(correo, 'el correo');
  generic.validar(numero_contacto, 'el numero de contacto');
  generic.validar(numero_documento, 'el numero de documento');
  generic.validar(nombre, 'el nombre');
  generic.validar(apellidos, 'los apellidos');
  generic.validar(fecha_nacimiento, 'la fecha de nacimiento');
  
  const equipo = Usuario(user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p);
  const userObj = {
    "nom_user": equipo.user,
    "pass": equipo.getEncryptedPassword(),
    "nombres": equipo.nombre,
    "apellido": equipo.apellidos,
    "email": equipo.correo,
    "num_contacto": equipo.numero_contacto,
    "documento": equipo.numero_documento,
    "estado": equipo.status,
    "id_rol": equipo.id_rol,
    "fecha_nacimiento": equipo.fecha_nacimiento,
    "info_perfil": equipo.info_p
  }
  return generic.manejarOperacionGenerica(equipoUtils.insertarEquipo, {...userObj}, {
    mensajeError: "Ocurrió un error inesperado y el registro no ha sido creado",
    mensajeExito: "Registro creado correctamente"
  });
}

async function deleteEquipos(options) {
  const { id } = options;

  generic.validar(id, "el id");
  try {
    return await equipoUtils.deleteEquipos({ id });
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
  listarEquipos,
  modificarEquipos,
  crearEquipos,
  deleteEquipos
};
