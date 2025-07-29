import { config as dotenvConfig } from 'dotenv'; // Importa la función 'config' de dotenv

dotenvConfig(); // Ejecuta la carga de variables de entorno

export default {
  // Server Config
  port: process.env.PORT_API || 3000,
  env: process.env.env || 'production',
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
  REDIS_URL: process.env.REDIS_URL || 'redis://:pass@redis_service:6379',

  // Nats
  NATS_URL: process.env.NATS_URL || 'nats://127.0.0.1:4222',

  TOKEN_AUTH_GIT: process.env.TOKEN_AUTH_GIT,
  TITLE_TOKEN_AUTH: process.env.TITLE_TOKEN_AUTH,
  EMAIL_GIT: process.env.EMAIL_GIT,
  REPO_IMG: process.env.REPO_IMG,
  USERNAME_GIT: process.env.USERNAME_GIT,
  BRANCH_IMG: process.env.BRANCH_IMG || 'main',
  CORS_ORIGINS: process.env.CORS_ORIGINS ||  [
    'http://localhost:*',
    'http://192.168.0.20:*',
  ],
  ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || '1h',
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '1h',
};
