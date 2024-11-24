const { getConnection } = require("../../../interface/DBConn.js");
const generic = require("../../generic.js");

async function getRoles(options) {

  let query = "SELECT * FROM rol";
  const queryParams = [];

  if (options.id !== undefined) {
    query = `SELECT * FROM rol WHERE id = $1`;
    queryParams.push(options.id); 
  }
  try {
    return await generic.ejecutarConsulta(
      query, queryParams, 
      "Error al consultar los roles", 
      "Roles consultados correctamente"
    );
  } catch (error) {
    throw error; 
  }
}

async function obtenerPermisosDelRol(id_rol) {
  const consulta = `
    SELECT id_permiso
    FROM rolxpermiso
    WHERE id_rol = $1
  `;

  try {
    const result = await generic.ejecutarConsulta(consulta, [id_rol], "Error al obtener permisos del rol");
    return result.rows.map(row => row.id_permiso);
  } catch (error) {
    console.error("Error al obtener permisos del rol:", error.message);
    throw new Error("Error al obtener los permisos del rol");
  }
}

/**
 * @param {{
*          descripcion: string,
*          monto: float,
*          fecha_ingreso: Date,
*      }} ingreso
*/
async function insertarRoles(data) {
  const { nombre, descripcion, permisos } = data;
  let id_rol = 0;
  try {
    const result = await generic.insertarDatos("rol", {
      nombre,
      descripcion,
      estado: 1,
    });
    result > 0 ? id_rol = result : (() => { throw new Error('No se pudo crear el rol'); })();
    const permisosList = permisos.split(',').map(Number).filter(Number);

    const insertPermisosPromises = permisosList.map(async (id_permiso) => {
      console.log(`Insertando permiso ${id_permiso} para rol ${id_rol}`);
      await generic.insertarDatos("rolxpermiso", {
        id_rol,
        id_permiso
      });
    });
    await Promise.all(insertPermisosPromises);

    return { result: "Rol y permisos insertados correctamente", ok: true, status_cod: 200 };
  } catch (error) {
    return generic.existe(error);
  }
}

async function actualizaRoles(data) {
  const { id, permisos } = data;

  const columnas = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    estado: data.estado,
  };

  const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

  const actualizacionesSQL = columnasFiltradas
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(', ');

  const valores = columnasFiltradas.map(([_, value]) => value);
  valores.push(id); 

  const consulta = `
    UPDATE rol
    SET ${actualizacionesSQL}
    WHERE id = $${valores.length}
  `;

  try {
    // 1. Actualización del rol
    await generic.ejecutarConsulta(consulta, valores, 
      "Error al actualizar el rol", 
      "Rol actualizado correctamente");

    // 2. Verificar y actualizar permisos
    if (permisos && permisos.length > 0) {
      const permisosNuevos = permisos.split(',').map(Number).filter(Number);

      // Obtener permisos actuales
      let permisosActuales = await obtenerPermisosDelRol(id);
      permisosActuales = [...new Set(permisosActuales)]

      const permisosAAgregar = permisosNuevos.filter(p => !permisosActuales.includes(p));
      
      const permisosAEliminar = permisosActuales.filter(p => !permisosNuevos.includes(p));

      // 3. Eliminar permisos antiguos
      if (permisosAEliminar.length > 0) {
        const deletePermisosPromises = permisosAEliminar.map(id_permiso => {
          return eliminarDatos(id, id_permiso);
        });
        await Promise.all(deletePermisosPromises);
      }

      // 4. Agregar permisos nuevos
      if (permisosAAgregar.length > 0) {
        const insertPermisosPromises = permisosAAgregar.map(id_permiso => {
          return generic.insertarDatos("rolxpermiso", {
            id_rol: id,
            id_permiso
          });
        });
        await Promise.all(insertPermisosPromises);
      }
    }

    return { result: "Rol y permisos actualizados correctamente", ok: true, status_cod: 200 };
  } catch (error) {
    return {
      result: `Ocurrió un error al actualizar el rol y permisos: ${error.message}`,
      ok: false,
      status_cod: 500
    };
  }
}


async function obtenerPermisosDelRol(id_rol) {
  const consulta = `
    SELECT id_permiso
    FROM rolxpermiso
    WHERE id_rol = $1
  `;

  try {
    const result = await generic.ejecutarConsulta(consulta, [id_rol], "Error al obtener permisos del rol");
    if (!result || !result.data) return [];
    return result.data.map(row => row.id_permiso);
  } catch (error) {
    console.error("Error al obtener permisos del rol:", error.message);
    throw new Error("Error al obtener los permisos del rol");
  }
}

async function deleteRoles(dato) {
  const params = [dato.id];
  query = `delete from rol where id=$1`;
  
  try {
    return await generic.ejecutarConsulta(query, params, 
      "Error al eliminar el rol", 
      "Rol eliminado correctamente"); 
  } catch (error) {
    throw error;
  }
}

async function eliminarDatos(id_rol, id_permiso) {
  const params = [id_rol, id_permiso];
  const query = `DELETE FROM rolxpermiso WHERE id_rol = $1 AND id_permiso = $2`;

  try {
    const result = await generic.ejecutarConsulta(query, params, 
      "Error al eliminar el rolxpermiso", 
      "RolxPermiso eliminado correctamente");

    return result.rows.length > 0 ? result : "Error al eliminar el rolxpermiso";
  } catch (error) {
    console.error("Error al eliminar rolxpermiso:", error.message);
    throw error;
  }
}

module.exports = {
  getRoles,
  actualizaRoles,
  insertarRoles,
  deleteRoles
};
