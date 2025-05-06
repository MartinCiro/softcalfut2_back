import { Module } from '@nestjs/common';
import { CedulaDeportivaService } from 'core/cedulaDeportiva/cedulaDeportivaService';
import { CedulaDeportivaController } from './cedulaDeportivaController';
import { RedisService } from 'shared/cache/redis.service';

import  CedulaDeportivaAdapter  from 'db/cedulaDeportivaAdapter';
import { CedulaDeportivaPortToken } from './cedulaDeportiva-port.token';

@Module({
  controllers: [CedulaDeportivaController],
  providers: [
    CedulaDeportivaService,
    {
      provide: CedulaDeportivaPortToken, 
      useClass: CedulaDeportivaAdapter,   
    },
    RedisService
  ],
  exports: [CedulaDeportivaService],
})
export class CedulaDeportivaModule {}
