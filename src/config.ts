import { config as dotenvConfig } from 'dotenv'; // Importa la función 'config' de dotenv

dotenvConfig(); // Ejecuta la carga de variables de entorno

export default {
  // Server Config
  port: process.env.PORT_API || 3000,
  env: process.env.env || 'Production',
  //env: process.env.env || 'Dev',

  // DBConn
  UserDB: process.env.UserDB,
  PasswordBD: process.env.PasswordDB,
  ServerDB: process.env.ServerDB,
  Database: process.env.Database,
  PortDB: process.env.PortDB,

  // Auth
  JWT_SECRETO: process.env.JWT_SECRET,
  SALT: process.env.JWT_SALT,
  JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA || 3600,

  // Redis
  REDIS_TTL: process.env.REDIS_TTL ? Number(process.env.REDIS_TTL) : 3600,
  REDIS_URL: process.env.REDIS_URL || 'redis://redis_service:6379',

  // Nats
  NATS_URL: process.env.NATS_URL || 'nats://127.0.0.1:4222',

  TOKEN_AUTH_GIT: process.env.TOKEN_AUTH_GIT,
  TITLE_TOKEN_AUTH: process.env.TITLE_TOKEN_AUTH,
  EMAIL_GIT: process.env.EMAIL_GIT,
  REPO_IMG: process.env.REPO_IMG || 'git@github.com:MartinCiro/imagesSoftcalfut.git',
};
