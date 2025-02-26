import { Module } from '@nestjs/common';
import { RoleModule } from './interfaces/api/roleApi.module';
import { EstadoModule } from './interfaces/api/estadosApi.module';
import { UsuarioModule } from './interfaces/api/usuariosApi.module';
import { AuthModule } from './interfaces/api/authApi.module';
import { RolxPermisoModule } from './interfaces/api/rolXpermisoApi.module';
import { PermisoModule } from './interfaces/api/permisosApi.module';
import { OrdenEnviosModule } from './interfaces/api/ordenEnviosApi.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    RoleModule,
    EstadoModule,
    UsuarioModule,
    AuthModule,
    RolxPermisoModule,
    PermisoModule,
    OrdenEnviosModule
  ],
  controllers: [AppController],
})
export class AppModule {}
