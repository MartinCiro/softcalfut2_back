const { getConnection } = require('../../../interface/DBConn.js');

/**
 * Método para obtener el perfil de base de datos del usuario.
 * @param {{username: string} | {id_user: string}} usuario 
 * @returns {Promise<{
 *              id_user: string,
 *              correo: string, 
 *              usuario: string, 
 *              contrasena: string,
 *              nombre: string,
 *              apellidos: string,
 *              id_rol: number,
 *              habilitado: number} | undefined }
 * @throws {{message: string} | any}
 */
async function retrieveUser(usuario) {
    const pool = await getConnection();
    const params = [];
    let queryWHERE;
    if (usuario.user) {
        params.push(usuario.user);
        queryWHERE = 'WHERE LOWER(u.nom_user) = LOWER($1)';
    } else if (usuario.id_user) {
        params.push(usuario.id_user);
        queryWHERE = 'WHERE u.documento = $1';
    } else {
        throw {
            ok: false,
            status_cod: 400,
            data: 'No se ha proporcionado un identificador para el usuario',
        };
    }
    return pool
        .query(`
        SELECT 
            u.documento AS id_user,
            u.nom_user AS usuario,
            u.pass AS contrasena,
            u.nombres, 
            u.apellido,
            u.id_rol
        FROM usuario u
        ${queryWHERE}
        `, params)
        .then(data => {
            return data.rowCount > 0 ? data.rows[0] : null;
        })
        .catch(error => {
            throw {
                ok: false,
                status_cod: 400,
                data: 'Ocurrió un error consultando usuario',
            };
        }).finally(() => pool.end());
}


module.exports = {
    retrieveUser
}
