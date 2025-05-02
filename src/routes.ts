import { RolModule } from 'api/roles/rol.module';
import { AuthModule } from 'api/auth/auth.module';
import { AppController } from 'src/app.controller';
import { EstadoModule } from 'api/estados/estado.module';
import { PermisoModule } from 'api/permisos/permiso.module';
import { UsuarioModule } from 'api/usuarios/usuario.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/api-docs'
    }),
    UsuarioModule,
    PermisoModule,
    RolModule,
    EstadoModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
