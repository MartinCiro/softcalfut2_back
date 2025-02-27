import { Module } from '@nestjs/common';
import { UsuarioModule } from './interfaces/api/usuarios/usuario.module';
import { RolxPermisoModule } from './interfaces/api/rolXpermisos/rolxPermiso.module';
import { AuthModule } from './interfaces/api/auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UsuarioModule,
    RolxPermisoModule,
    AuthModule
  ],
  controllers: [AppController],
})
export class AppModule {}
