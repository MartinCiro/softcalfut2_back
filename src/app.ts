import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes';


async function createApp() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS para desarrollo/producción
  //app.enableCors({credentials: true});
  app.enableCors({
    origin: config.CORS_ORIGINS,
    credentials: true, // Necesario para cookies en cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Middleware para cookies (importante el '*' antes de cookieParser)
  app.use(cookieParser());

  // Global Pipe para validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  return app;
}

export default createApp();