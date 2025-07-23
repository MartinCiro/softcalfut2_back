import { RolModule } from './interfaces/api/roles/rol.module';
import { AuthModule } from './interfaces/api/auth/auth.module';
import { EstadoModule } from './interfaces/api/estados/estado.module';
import { PermisoModule } from './interfaces/api/permisos/permiso.module';
import { AppController } from './app.controller';
import { UsuarioModule } from './interfaces/api/usuarios/usuario.module';
import { CategoriaModule } from './interfaces/api/categorias/categoria.module';
import { EquipoModule } from './interfaces/api/equipos/equipo.module';
import { NotaModule } from './interfaces/api/notas/nota.module';
import { LugarEncuentroModule } from './interfaces/api/lugarEncuentro/lugarEncuentro.module';
import { AnuncioModule } from './interfaces/api/anuncios/anuncio.module';
import { CedulaDeportivaModule } from './interfaces/api/cedulaDeportiva/cedulaDeportiva.module';
import { TorneoModule } from './interfaces/api/torneos/torneo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ProgramacionModule } from './interfaces/api/programaciones/programacion.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api-docs'
    }),
    RolModule,
    AuthModule,
    NotaModule,
    TorneoModule,
    EstadoModule,
    EquipoModule,
    UsuarioModule,
    PermisoModule,
    AnuncioModule,
    CategoriaModule,
    ProgramacionModule,
    LugarEncuentroModule,
    CedulaDeportivaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
