import { Module } from '@nestjs/common';
import { UsuarioModule } from './interfaces/api/usuarios/usuario.module';
import { AuthModule } from './interfaces/api/auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UsuarioModule,
    AuthModule
  ],
  controllers: [AppController],
})
export class AppModule {}
