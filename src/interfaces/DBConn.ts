import { Pool } from 'pg';
import config from 'src/config';

const dbauth = {
  user: config.UserDB,
  password: config.PasswordBD,
  host: config.ServerDB,
  port: parseInt(config.PortDB ?? '', 10),
  database: config.Database,
};

/**
 * Método para conectarse a la base de datos
 * @returns {Promise<Pool>}
 */
function getConnection() {
  return new Pool(dbauth);
}

export default getConnection;