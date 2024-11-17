const permisoUtils = require("../utils/permisos.utils");
const generic = require("../../generic");

async function listarPermisos(options) {
  try {
    return await permisoUtils.getPermiso(options);
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

async function modificarPermisos(options) {
  const { id, nombre, descripcion, estado} = options;

  generic.validar(id, "el identificador del permiso");
  
  const campos = { nombre, descripcion, estado };

  const camposDefinidos = Object.values(campos).filter(value => value !== undefined && value !== null);

  if (camposDefinidos.length === 0) throw {
      ok: false,
      status_cod: 400,
      data: "No se ha proporcionado ningún valor a actualizar",
    };

  return generic.manejarOperacionGenerica(permisoUtils.actualizaPerfil, options, {
    mensajeError: "Ocurrió un error inesperado al modificar el permiso",
    mensajeExito: "Permiso actualizado correctamente"
  });
}

async function crearPermisos(options) {
  const { nombre, descripcion } = options;
  generic.validar(nombre, "el nombre del permiso");
  generic.validar(descripcion, "la descripción");

  return generic.manejarOperacionGenerica(permisoUtils.insertarPermiso, options, {
    mensajeError: "Ocurrió un error inesperado y el registro no ha sido creado",
    mensajeExito: "Registro creado correctamente"
  });
}


async function deletePermisos(iden) {
  const { id, tipo } = iden;

  permisoUtils.validar(id, "el id");
  permisoUtils.validar(tipo, "el tipo");
  try {
    return await permisoUtils.deletePermisos({ id, tipo });
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
  listarPermisos,
  modificarPermisos,
  crearPermisos,
  deletePermisos
};
