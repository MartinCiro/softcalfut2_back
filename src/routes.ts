import { Module } from '@nestjs/common';
import { UsuarioModule } from './interfaces/api/usuarios/usuario.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UsuarioModule
  ],
  controllers: [AppController],
})
export class AppModule {}
