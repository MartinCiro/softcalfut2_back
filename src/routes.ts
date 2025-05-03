import { RolModule } from 'api/roles/rol.module';
import { AuthModule } from 'api/auth/auth.module';
import { EstadoModule } from 'api/estados/estado.module';
import { PermisoModule } from 'api/permisos/permiso.module';
import { AppController } from 'src/app.controller';
import { UsuarioModule } from 'api/usuarios/usuario.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
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
