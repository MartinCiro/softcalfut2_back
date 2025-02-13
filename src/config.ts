import { config as dotenvConfig } from 'dotenv'; // Importa la función 'config' de dotenv

dotenvConfig(); // Ejecuta la carga de variables de entorno

export default {
  // Server Config
  port: process.env.PORT || 3000,
  env: process.env.env || 'Dev',
  // env: process.env.env || 'prod',

  // DBConn
  UserDB: process.env.UserDB,
  PasswordBD: process.env.PasswordDB,
  ServerDB: process.env.ServerDB,
  Database: process.env.Database,
  PortDB: process.env.PortDB,

  // Auth
  JWT_SECRETO: process.env.JWT_SECRETO,
  SALT: process.env.JWT_SALT,
  JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA || '1h',
};
