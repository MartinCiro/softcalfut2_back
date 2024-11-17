//const sql = require('pg');
const { Pool } = require("pg");
const config = require("../config.js");

const dbauth = {
    user: config.UserDB,
    password: config.PasswordBD,
    host: config.ServerDB,
    port: config.PortDB,
    database: config.Database
};

const dbauth_impuestos = {
  user: config.UserDBImpuestos,
  password: config.PasswordBDImpuestos,
  host: config.ServerDB,
  port: config.PortDB,
  database: config.DatabaseImpuestos
};
/**
 * Método para conectarse a la base de datos de nexia automation
 * @returns {Promise<Pool>}
 */
function getConnection() {
  return new Pool(dbauth);
}

/**
 * Método para conectarse a la base de datos de impuestos nacionales
 * @returns {Promise<Pool>}
 */
function getImpuestosConnection() {
  return new Pool(dbauth_impuestos);
}

module.exports = { getConnection, getImpuestosConnection };