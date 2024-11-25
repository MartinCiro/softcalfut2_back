const { getConnection } = require("../interface/DBConn.js");
const ResponseBody = require("../shared/model/ResponseBody.model");

const manejarOperacion = async (req, res, nomFuncion, datos, opciones = {}) => {
  let result;
  try {
    const resultado = await nomFuncion(datos);
    resultado instanceof ResponseBody ? result = resultado : result = new ResponseBody(true, 200, resultado);
  } catch (error) {
    result = new ResponseBody(
      error.ok || false,
      error.status_cod || 500,
      error.data || opciones.mensajeError || "Ha ocurrido un error inesperado. Intenta de nuevo más tarde."
    );
  }

  return res.json(result);
};

const manejarOperacionGenerica = async (operacion, parametros, opciones = {}) => {
  const { mensajeError, mensajeExito } = opciones;
  let result;

  try {
    const resultado = await operacion(parametros);
    result = new ResponseBody(true, 200, mensajeExito || resultado);
  } catch (error) {
    existe(error);
    result = new ResponseBody(
      error.ok || false,
      error.status_cod || 500,
      error.data || opciones.mensajeError || "Ha ocurrido un error inesperado. Intenta de nuevo más tarde."
    );
  }
  return result;
};

async function ejecutarConsulta(query, params = [], mensajeError, mensajeExito) {
  const pool = await getConnection();

  try {
    const result = await pool.query(query, params);
    return new ResponseBody(true, 200, result.rowCount > 0 || result.fields.length > 0 ? result.rows || result.fields : mensajeExito || "Operación realizada correctamente.");
  } catch (error) {
    console.log(error);
    existe(error);
    throw new ResponseBody(false, 500, mensajeError || "Ha ocurrido un error inesperado en la base de datos.")
  } finally {
    pool.end();
  }
}


async function insertarDatos(tabla, datos) {
  const pool = await getConnection();
  const campos = Object.keys(datos).join(', ');
  const valores = Object.values(datos);
  const placeholders = valores.map((_, index) => `$${index + 1}`).join(', ');

  try {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = 'id'`,
      [tabla]
    );

    let query = `INSERT INTO ${tabla} (${campos}) VALUES (${placeholders})`;
    let retorno = null;

    if (result.rows.length > 0) {
      query += ' RETURNING id';
      retorno = 'id';
    } else {
      query += ' RETURNING *';
      retorno = '*';
    }
    const data = await pool.query(query, valores);
    return retorno === 'id' ? data.rows[0].id : data.rows[0];

  } catch (error) {
    existe(error);
    throw new ResponseBody(false, 500, "Ha ocurrido un error inesperado en la base de datos.")
  } finally {
    pool.end();
  }
}

const existe = (error, datos = null) => {
  const errorMessages = {
    duplicateEntry: (field) => `El ${field} ya existe`,
    foreignKeyViolation: (field) => `La clave foránea del ${field} es inválida o no existe`,
    uniqueViolation: (field) => `El valor del ${field} ya está guardado`,
    notNullViolation: (field) => `El campo ${field} no puede ser nulo`,
  };

  const field = (datos && datos.length > 0 && datos[0] !== undefined) ? datos[0] : "registro";

  if (error.code == "23505") 
   console.log()
    return {
      ok: false,
      status_cod: 409,
      data: errorMessages.duplicateEntry(field)
    };
};


const validar = (valor, nombre) => {
  if (!valor) throw new ResponseBody(false, 400, `No se ha proporcionado ${nombre}`);
};

module.exports = {
  manejarOperacion,
  manejarOperacionGenerica,
  ejecutarConsulta,
  insertarDatos,
  existe,
  validar
};
