import { Module } from '@nestjs/common';
import { AfiliadoService } from '@core/afiliados/afiliadoService';
import { AfiliadoController } from './afiliadoController';
import { RedisService } from '@shared/cache/redis.service';

import  AfiliadosAdapter  from '@db/afiliadoAdapter';
import { AfiliadosPortToken } from './afiliado-port.token';

@Module({
  controllers: [AfiliadoController],
  providers: [
    AfiliadoService,
    {
      provide: AfiliadosPortToken, 
      useClass: AfiliadosAdapter,   
    },
    RedisService
  ],
  exports: [AfiliadoService],
})
export class AfiliadoModule {}
