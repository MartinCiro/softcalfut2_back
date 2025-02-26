import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes';

async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  return app;
}

export default createApp();
