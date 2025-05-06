import { Module } from '@nestjs/common';
import { TorneoService } from 'core/torneos/torneoService';
import { TorneoController } from './torneoController';
import { RedisService } from 'shared/cache/redis.service';

import  TorneosAdapter  from 'db/torneoAdapter';
import { TorneosPortToken } from './torneo-port.token';

@Module({
  controllers: [TorneoController],
  providers: [
    TorneoService,
    {
      provide: TorneosPortToken, 
      useClass: TorneosAdapter,   
    },
    RedisService
  ],
  exports: [TorneoService],
})
export class TorneoModule {}
