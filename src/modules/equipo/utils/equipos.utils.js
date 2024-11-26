const generic = require("../../generic.js");

async function getEquipo(options) {
  let query = `
  SELECT
      equipo.nom_equipo,
      usuario.documento,
      usuario.nombres,
      usuario.apellido,
      usuario.num_contacto,
      usuario.estado,
      usuario.fecha_nacimiento
  FROM equipo
  LEFT JOIN usuario ON equipo.documento = usuario.documento
  ORDER BY equipo.nom_equipo, usuario.apellido, usuario.nombres;
  `;
  const queryParams = [];

  if (options.id !== undefined) {
    query = `
    SELECT
        equipo.nom_equipo,
        usuario.documento,
        usuario.nombres,
        usuario.apellido,
        usuario.num_contacto,
        usuario.estado,
        usuario.fecha_nacimiento
    FROM equipo
    LEFT JOIN usuario ON equipo.documento = usuario.documento
    WHERE equipo.id = '$1' 
    ORDER BY equipo.nom_equipo, usuario.apellido, usuario.nombres;
    `;
    queryParams.push(options.id); 
  }
  try {
    return await generic.ejecutarConsulta(
      query, queryParams, 
      "Error al consultar los equipos", 
      "Equipos consultados correctamente"
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
async function insertarEquipo(options) {
  const { nom_user, pass, nombres, apellido, email, num_contacto, documento, estado, id_rol, fecha_nacimiento, info_perfil } = options;
  try {
    return await generic.insertarDatos("equipo", { nom_user, pass, nombres, apellido, email, num_contacto, documento, estado, id_rol, fecha_nacimiento, info_perfil });
  } catch (error) {
    throw generic.existe(error);
  }
}

async function actualizaEquipo(data) {
  const { numero_documento } = data;
  const columnas = {
    documento: data.numero_documento,
    nom_user: data.user,
    nombres: data.nombre,
    apellido: data.apellidos,
    email: data.correo,
    num_contacto: data.numero_contacto,
    estado: data.status,
    id_rol: data.id_rol,
    fecha_nacimiento: data.fecha_nacimiento,
    info_perfil: data.info_p
  };

  const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

  const actualizacionesSQL = columnasFiltradas
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(', ');

  const valores = columnasFiltradas.map(([_, value]) => value);

  const consulta = `
    UPDATE equipo
    SET ${actualizacionesSQL}
    WHERE documento = '${ numero_documento }'
  `;
  
  try {
    return await generic.ejecutarConsulta(consulta, valores, 
      "Error al actualizar el equipo", 
      "Equipo actualizado correctamente");
  } catch (error) {
    throw error; 
  }
}


async function deleteEquipos(dato) {
  const params = [dato.id];
  query = `delete from equipo where id=$1`;
  
  try {
    return await generic.ejecutarConsulta(query, params, 
      "Error al eliminar el equipo", 
      "Equipo eliminado correctamente"); 
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getEquipo,
  actualizaEquipo,
  insertarEquipo,
  deleteEquipos
};
