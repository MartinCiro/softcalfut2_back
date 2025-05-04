import { Module } from '@nestjs/common';
import { EquipoService } from 'core/equipos/equipoService';
import { EquipoController } from './equipoController';
import { RedisService } from 'shared/cache/redis.service';

import  EquiposAdapter  from 'db/equipoAdapter';
import { EquiposPortToken } from './equipo-port.token';

@Module({
  controllers: [EquipoController],
  providers: [
    EquipoService,
    {
      provide: EquiposPortToken, 
      useClass: EquiposAdapter,   
    },
    RedisService
  ],
  exports: [EquipoService],
})
export class EquipoModule {}
