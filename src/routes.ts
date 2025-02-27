import { Module } from '@nestjs/common';
import { UsuarioModule } from './interfaces/api/usuarios/usuario.module';
import { RolxPermisoModule } from './interfaces/api/rolXpermisos/rolxPermiso.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UsuarioModule,
    RolxPermisoModule
  ],
  controllers: [AppController],
})
export class AppModule {}
