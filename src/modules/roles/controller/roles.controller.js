const permisoUtils = require("../utils/roles.utils");
const generic = require("../../generic");

async function listarRoles(options) {
  try {
    return await permisoUtils.getRoles(options);
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
 *        }} permiso
 * @param {number[]} obligaciones_tributarias
 */

async function modificarRoles(options) {
  const { id, nombre, descripcion, estado, permisos} = options;

  generic.validar(id, "el identificador del permiso");
  generic.validar(permisos, "el identificador del permiso");
  
  const campos = { nombre, descripcion, estado, permisos };
  const camposDefinidos = Object.values(campos).filter(value => value !== undefined && value !== null);

  if (camposDefinidos.length === 0) throw {
      ok: false,
      status_cod: 400,
      data: "No se ha proporcionado ningún valor a actualizar",
    };

  return generic.manejarOperacionGenerica(permisoUtils.actualizaRoles, options, {
    mensajeError: "Ocurrió un error inesperado al modificar el permiso",
    mensajeExito: "Role actualizado correctamente"
  });
}

async function crearRoles(options) {
  const { nombre, descripcion, permisos } = options;
  generic.validar(nombre, "el nombre del permiso");
  generic.validar(descripcion, "la descripción");
  generic.validar(permisos, "ningun permiso");

  return generic.manejarOperacionGenerica(permisoUtils.insertarRoles, options, {
    mensajeError: "Ocurrió un error inesperado y el registro no ha sido creado",
    mensajeExito: "Registro creado correctamente"
  });
}


async function deleteRoles(options) {
  const { id } = options;

  generic.validar(id, "el id");
  try {
    return await permisoUtils.deleteRoles({ id });
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
  listarRoles,
  modificarRoles,
  crearRoles,
  deleteRoles
};
