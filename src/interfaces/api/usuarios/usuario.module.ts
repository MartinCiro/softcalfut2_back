import { Module } from '@nestjs/common';
import { UsuarioService } from '../../../core/usuarios/usuarioService';
import { UsuarioController } from './usuarioController';

import  UsuariosAdapter  from '../../db/usuarioAdapter';
import { UsuariosPortToken } from './usuario-port.token';

@Module({
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: UsuariosPortToken, 
      useClass: UsuariosAdapter,   
    },
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
