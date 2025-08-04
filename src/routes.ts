import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';

import { RolModule } from '@api/roles/rol.module';
import { AuthModule } from '@api/auth/auth.module';
import { NotaModule } from '@api/notas/nota.module';
import { TorneoModule } from '@api/torneos/torneo.module';
import { EquipoModule } from '@api/equipos/equipo.module';
import { EstadoModule } from '@api/estados/estado.module';
import { PermisoModule } from '@api/permisos/permiso.module';
import { UsuarioModule } from '@api/usuarios/usuario.module';
import { AnuncioModule } from '@api/anuncios/anuncio.module';
import { AfiliadoModule } from '@api/afiliados/afiliado.module';
import { CategoriaModule } from '@api/categorias/categoria.module';
import { ProgramacionModule } from '@api/programaciones/programacion.module';
import { LugarEncuentroModule } from '@api/lugarEncuentro/lugarEncuentro.module';
import { CedulaDeportivaModule } from '@api/cedulaDeportiva/cedulaDeportiva.module';

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
    AfiliadoModule,
    CategoriaModule,
    ProgramacionModule,
    LugarEncuentroModule,
    CedulaDeportivaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
