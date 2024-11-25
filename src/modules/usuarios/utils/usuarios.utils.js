const generic = require("../../generic.js");

async function getUsuario(options) {
  let query = `SELECT
                  usuario.documento,
                  usuario.nombres,
                  usuario.apellido,
                  usuario.email,
                  usuario.info_perfil,
                  usuario.fecha_usuario_registro,
                  usuario.num_contacto,
                  usuario.nom_user,
                  usuario.estado,
                  usuario.id_rol,
                  usuario.fecha_nacimiento,
                  rol.id AS rol_id,
                  rol.nombre AS rol_nombre,
                  STRING_AGG(permiso.nombre, ', ') AS permiso_nombre
              FROM usuario
              LEFT JOIN rol ON usuario.id_rol = rol.id
              LEFT JOIN rolxpermiso ON rolxpermiso.id_rol = rol.id
              LEFT JOIN permiso ON rolxpermiso.id_permiso = permiso.id
              GROUP BY usuario.documento, 
                      usuario.nombres,
                      usuario.apellido,
                      usuario.email,
                      usuario.info_perfil,
                      usuario.fecha_usuario_registro,
                      usuario.num_contacto,
                      usuario.nom_user,
                      usuario.estado,
                      usuario.id_rol,
                      usuario.fecha_nacimiento,
                      rol.id, 
                      rol.nombre;
  `;
  const queryParams = [];

  if (options.documento !== undefined) {
    query = `SELECT
                usuario.documento,
                usuario.nombres,
                usuario.apellido,
                usuario.email,
                usuario.info_perfil,
                usuario.fecha_usuario_registro,
                usuario.num_contacto,
                usuario.nom_user,
                usuario.estado,
                usuario.id_rol,
                usuario.fecha_nacimiento,
                rol.id AS rol_id,
                rol.nombre AS rol_nombre,
                STRING_AGG(permiso.nombre, ', ') AS permiso_nombre
            FROM usuario
            LEFT JOIN rol ON usuario.id_rol = rol.id
            LEFT JOIN rolxpermiso ON rolxpermiso.id_rol = rol.id
            LEFT JOIN permiso ON rolxpermiso.id_permiso = permiso.id
            WHERE usuario.documento = $1 
            GROUP BY usuario.documento, 
                    usuario.nombres,
                    usuario.apellido,
                    usuario.email,
                    usuario.info_perfil,
                    usuario.fecha_usuario_registro,
                    usuario.num_contacto,
                    usuario.nom_user,
                    usuario.estado,
                    usuario.id_rol,
                    usuario.fecha_nacimiento,
                    rol.id, 
                    rol.nombre;`;
    queryParams.push(options.documento); 
  }
  try {
    return await generic.ejecutarConsulta(
      query, queryParams, 
      "Error al consultar los usuarios", 
      "Usuarios consultados correctamente"
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
async function insertarUsuario(options) {
  const { nom_user, pass, nombres, apellido, email, num_contacto, documento, estado, id_rol, fecha_nacimiento, info_perfil } = options;
  try {
    return await generic.insertarDatos("usuario", { nom_user, pass, nombres, apellido, email, num_contacto, documento, estado, id_rol, fecha_nacimiento, info_perfil });
  } catch (error) {
    throw generic.existe(error);
  }
}

async function actualizaUsuario(data) {
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
    UPDATE usuario
    SET ${actualizacionesSQL}
    WHERE documento = '${ numero_documento }'
  `;
  
  try {
    return await generic.ejecutarConsulta(consulta, valores, 
      "Error al actualizar el usuario", 
      "Usuario actualizado correctamente");
  } catch (error) {
    throw error; 
  }
}


async function deleteUsuarios(dato) {
  const params = [dato.id];
  query = `delete from usuario where id=$1`;
  
  try {
    return await generic.ejecutarConsulta(query, params, 
      "Error al eliminar el usuario", 
      "Usuario eliminado correctamente"); 
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsuario,
  actualizaUsuario,
  insertarUsuario,
  deleteUsuarios
};
