import { Module } from '@nestjs/common';
import { ProgramacionService } from 'core/programaciones/programacionService';
import { ProgramacionController } from './programacionController';
import { RedisService } from 'shared/cache/redis.service';

import  ProgramacionesAdapter  from 'db/programacionAdapter';
import { ProgramacionesPortToken } from './programacion-port.token';

@Module({
  controllers: [ProgramacionController],
  providers: [
    ProgramacionService,
    {
      provide: ProgramacionesPortToken, 
      useClass: ProgramacionesAdapter,   
    },
    RedisService
  ],
  exports: [ProgramacionService],
})
export class ProgramacionModule {}
