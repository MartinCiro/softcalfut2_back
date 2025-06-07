import { Module } from '@nestjs/common';
import { LugarEncuentroService } from 'core/lugarEncuentro/lugarEncuentroService';
import { LugarEncuentroController } from './lugarEncuentroController';
import { RedisService } from 'shared/cache/redis.service';

import LugarEncuentrosAdapter from 'db/lugarEncuentroAdapter';
import { LugarEncuentroPortToken } from './lugarEncuentro-port.token';

@Module({
  controllers: [LugarEncuentroController],
  providers: [
    LugarEncuentroService,
    {
      provide: LugarEncuentroPortToken, 
      useClass: LugarEncuentrosAdapter,   
    },
    RedisService
  ],
  exports: [LugarEncuentroService],
})
export class LugarEncuentroModule {}
