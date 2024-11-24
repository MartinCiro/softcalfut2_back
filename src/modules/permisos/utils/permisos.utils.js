const { getConnection } = require("../../../interface/DBConn.js");
const generic = require("../../generic");

async function getPermiso(options) {

  let query = "SELECT * FROM permiso";
  const queryParams = [];

  if (options.id !== undefined) {
    query = `SELECT * FROM permiso WHERE id = $1`;
    queryParams.push(options.id); 
  }
  try {
    return await generic.ejecutarConsulta(
      query, queryParams, 
      "Error al consultar los permisos", 
      "Permisos consultados correctamente"
    );
  } catch (error) {
    throw error; 
  }
}

/**
 * @param {{
*          descripcion: string,
*          monto: float,
*          fecha_ingreso: Date,
*      }} ingreso
*/
async function insertarPermiso({ nombre, descripcion }) {
 try {
  return await generic.insertarDatos("permiso", {
     nombre,
     descripcion,
     estado: 1 
   });
 } catch (error) {
   console.error("Error al insertar el permiso:", error);
 }
}


async function actualizaPermiso(data) {
  const { id } = data;
  const columnas = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    estado: data.estado
  };

  const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

  const actualizacionesSQL = columnasFiltradas
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(', ');

  const valores = columnasFiltradas.map(([_, value]) => value);

  const consulta = `
    UPDATE permiso
    SET ${actualizacionesSQL}
    WHERE id = ${ id }
  `;
  
  try {
    return await generic.ejecutarConsulta(consulta, valores, 
      "Error al actualizar el permiso", 
      "Permiso actualizado correctamente");
  } catch (error) {
    throw error; 
  }
}


async function deletePermisos(dato) {
  const params = [dato.id];
  query = `delete from permiso where id=$1`;
  
  try {
    return await generic.ejecutarConsulta(query, params, 
      "Error al eliminar el permiso", 
      "Permiso eliminado correctamente"); 
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPermiso,
  actualizaPermiso,
  insertarPermiso,
  deletePermisos
};
