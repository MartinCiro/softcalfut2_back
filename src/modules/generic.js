const { getConnection } = require("../interface/DBConn.js");
const ResponseBody = require("../shared/model/ResponseBody.model");

const manejarOperacion = async (req, res, nomFuncion, datos, opciones = {}) => {
  let message;
  try {
    const resultado = await nomFuncion(datos);
    message = new ResponseBody(true, 200, resultado);
  } catch (error) {
    message = new ResponseBody(
      error.ok || false,
      error.status_cod || 500,
      error.data || opciones.mensajeError || "Ha ocurrido un error inesperado. Intenta de nuevo más tarde."
    );
  }

  return res.json(message);
};

async function manejarOperacionGenerica(operacion, parametros, opciones = {}) {
  const { mensajeError, mensajeExito } = opciones;
  let message;

  try {
    const resultado = await operacion(parametros);
    message = {
      ok: true,
      status_cod: 200,
      data: mensajeExito || resultado,
    };
  } catch (error) {
    if (error.status_cod) throw error;
    throw {
      ok: false,
      status_cod: 500,
      data: mensajeError || "Ha ocurrido un error inesperado.",
    };
  }

  return message;
}

async function ejecutarConsulta(query, params = [], mensajeError, mensajeExito) {
  const pool = await getConnection();

  try {
    const result = await pool.query(query, params);
    return {
      ok: true,
      status_cod: 200,
      data: result.rowCount > 0 ? result.rows : null,
      mensajeExito: mensajeExito || "Operación realizada correctamente.",
    };
  } catch (error) {
    existe(error);
    throw {
      ok: false,
      status_cod: 500,
      data: mensajeError || "Ha ocurrido un error inesperado en la base de datos.",
    };
  } finally {
    pool.end();
  }
}


async function insertarDatos(tabla, datos) {
  const pool = await getConnection();
  const campos = Object.keys(datos).join(', ');
  const valores = Object.values(datos);
  const placeholders = valores.map((_, index) => `$${index + 1}`).join(', ');

  return pool
    .query(
      `INSERT INTO ${tabla} (${campos}) VALUES (${placeholders}) RETURNING id`,
      valores
    )
    .then((data) => {
      return data.rows[0].id;
    })
    .catch((error) => {
      existe(error);
      throw {
        ok: false,
        status_cod: 500,
        data: "Ocurrió un error insertando los datos",
      };
    })
    .finally(() => pool.end);
}

const existe = (error, datos = null) => {
  const errorMessages = {
    duplicateEntry: (field) => `El ${field} ya existe`,
    foreignKeyViolation: (field) => `La clave foránea del ${field} es inválida o no existe`,
    uniqueViolation: (field) => `El valor del ${field} ya está guardado`,
    notNullViolation: (field) => `El campo ${field} no puede ser nulo`,
  };
  const field = (datos && datos.length > 0 && datos[0] !== undefined) ? datos[0] : "registro";

  if (error.code === "23505")
    throw {
      ok: false,
      status_cod: 400,
      data: errorMessages.duplicateEntry(field),
    };

  if (error.code === "23503")
    throw {
      ok: false,
      status_cod: 400,
      data: errorMessages.foreignKeyViolation(field),
    };

  if (error.code === "23502")
    throw {
      ok: false,
      status_cod: 400,
      data: errorMessages.notNullViolation(field),
    };

  throw {
    ok: false,
    status_cod: 500,
    data: "Ha ocurrido un error inesperado en la base de datos.",
  };
};

const validar = (valor, nombre) => {
  if (!valor)
    throw {
      ok: false,
      status_cod: 400,
      data: `No se ha proporcionado ${nombre}`,
    };
};

module.exports = {
  manejarOperacion,
  manejarOperacionGenerica,
  ejecutarConsulta,
  insertarDatos,
  existe,
  validar
};
