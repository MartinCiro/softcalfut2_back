const { getConnection } = require('../../../interface/DBConn.js');

const validator = (valor, nombre) => {
    if (!valor)
        throw {
        ok: false,
        status_cod: 400,
        data: `No se ha proporcionado ${nombre}`,
    };
};

 
const existe = (error, datos) => {
    const errorMessages = {
        duplicateEntry: (field) => `No se ha podido insertar el registro. El ${field} ya existe`,
    };

    if (error.code === "23505") {
        const field = datos;
        throw {
        ok: false,
        status_cod: 409,
        data: errorMessages.duplicateEntry(field),
        };
    }
}

/**
 * Insertar un nuevo usuario en la base de datos
 * @param {Object} usuario - Objeto con los datos del usuario (incluyendo la contraseña encriptada)
 */

async function insertNewUser(usuario) {
    const { user, getEncryptedPassword, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = usuario;
    const params = [];
    const pool = await getConnection();

    // Agregar la contraseña encriptada al array de parámetros
    params.push(nombre);
    params.push(apellidos);
    params.push(correo);
    params.push(numero_contacto);
    params.push(user);
    params.push(getEncryptedPassword());
    params.push(numero_documento);
    params.push(status);
    params.push(id_rol);
    params.push(fecha_nacimiento);
    params.push(info_p);

    return pool.query(`
        INSERT INTO usuario (nombres, apellido, email, num_contacto, nom_user, pass, documento, id_rol, estado, fecha_nacimiento, info_perfil)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING documento;
    `, params)
    .then(data => {
        return data.rows[0].id; // Retorna el ID del nuevo usuario
    })
    .catch(error => {
        existe(error, "user");
        console.log(error);
        throw {
            ok: false,
            status_cod: 500,
            data: 'Ocurrió un error insertando nuevo usuario'
        };
    })
    .finally(() => pool.end);
}

/**
 * @param {{
 *      correo:string, 
 *      id_sede:number, 
 *      id_rol: number, 
 *      numero_contacto: string, 
 *      habilitado: number, 
 *      id_cargo: number,
 *      clientes: any[]
 *  }} options 
 */
async function updateUsuario(options) {
    const { id, ...fields } = options;

    const params = [id];
    const setClauses = [];

    Object.keys(fields).forEach((field, index) => {
        if (fields[field] !== undefined && fields[field] !== null) {
            params.push(fields[field]);
            setClauses.push(`${field} = $${params.length}`);
        }
    });

    if (setClauses.length === 0) {
        throw {
            ok: false,
            status_cod: 400,
            data: 'No se han proporcionado campos para actualizar'
        };
    }

    // Construye la consulta SQL
    const query = `
        UPDATE usuario
        SET ${setClauses.join(', ')}
        WHERE documento = $1;
    `;
    const pool = await getConnection();

    try {
        const result = await pool.query(query, params);
        console.log(result);
        if (result.rowCount === 0) {
            throw {
                ok: false,
                status_cod: 500,
                data: 'No se pudo actualizar el usuario'
            };
        }
    } catch (err) {
        if (err.status_cod) throw err;
        console.error('Ocurrió un error actualizando usuario en la base de datos', err);
        throw {
            ok: false,
            status_cod: 500,
            data: 'Ocurrió un error en la base de datos actualizando el usuario'
        };
    } finally {
        pool.end(); // Asegúrate de cerrar la conexión
    }
}


module.exports = {
    insertNewUser,
    updateUsuario,
    validator
}
