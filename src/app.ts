import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config'; // Importación de config.ts sin '.ts' al ser manejado por TypeScript
import routes from './routes';  // Importación de rutas

const app = express();

// Configuración
app.set('port', config.port); // Se asume que config.ts exporta un objeto con la propiedad 'port'

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '25mb' }));

// Rutas
app.use(routes); 

// Exportar la app para su uso en otros lugares (por ejemplo, en un archivo de servidor principal)
export default app;
