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


async function actualizaPerfil(data) {
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
    const resultado = await generic.ejecutarConsulta(consulta, valores, 
      "Error al actualizar el permiso", 
      "Perfil actualizado correctamente");

    return resultado; 
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
    const respuesta = await generic.insertarDatos("permiso", {
      nombre,
      descripcion,
      estado: 1 
    });
    return respuesta;
  } catch (error) {
    console.error("Error al insertar el permiso:", error);
  }
}

async function deleteFechas(dato) {
  const pool = await getConnection();
  const params = [dato.id];
  return pool
    .query(`delete from ${dato.tipo} where id=$1`, params)
    .then((data) => {
      return data.rowCount > 0
        ? `El ${dato.tipo} se elimino correctamente`
        : `El ${dato.tipo} no existe`;
    })
    .catch((error) => {
      console.log(error);
      if (error.status_cod) throw error;
      error.status_cod ? error : null;
      throw {
        ok: false,
        status_cod: 500,
        data: "Ha ocurrido un error consultando la información en la base de datos",
      };
    })
    .finally(() => pool.end());
}


module.exports = {
  getPermiso,
  actualizaPerfil,
  insertarPermiso,
  deleteFechas
};
