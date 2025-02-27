import { Module } from '@nestjs/common';
import { RolxPermisoService } from '../../../core/rolXpermisos/rolXpermisoService';
import { RolxPermisoController } from './rolXpermisoController';

import  RolxPermisosAdapter  from '../../db/rolXpermisoAdapter';
import { RolxPermisoPortToken } from './rolXpermiso-port.token';

@Module({
  controllers: [RolxPermisoController],
  providers: [
    RolxPermisoService,
    {
      provide: RolxPermisoPortToken, 
      useClass: RolxPermisosAdapter,   
    },
  ],
  exports: [RolxPermisoService],
})
export class RolxPermisoModule {}
