import { RolModule } from 'api/roles/rol.module';
import { AuthModule } from 'api/auth/auth.module';
import { EstadoModule } from 'api/estados/estado.module';
import { PermisoModule } from 'api/permisos/permiso.module';
import { AppController } from 'src/app.controller';
import { UsuarioModule } from 'api/usuarios/usuario.module';
import { CategoriaModule } from 'src/interfaces/api/categorias/categoria.module';
import { EquipoModule } from 'src/interfaces/api/equipos/equipo.module';
import { CedulaDeportivaModule } from 'src/interfaces/api/cedulaDeportiva/cedulaDeportiva.module';
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
    CategoriaModule,
    EquipoModule,
    CedulaDeportivaModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
