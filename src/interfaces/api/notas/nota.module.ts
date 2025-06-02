import { Module } from '@nestjs/common';
import { NotaService } from 'core/notas/notaService';
import { NotaController } from './notaController';
import { RedisService } from 'shared/cache/redis.service';

import  NotasAdapter  from 'db/notaAdapter';
import { NotasPortToken } from './nota-port.token';

@Module({
  controllers: [NotaController],
  providers: [
    NotaService,
    {
      provide: NotasPortToken, 
      useClass: NotasAdapter,   
    },
    RedisService
  ],
  exports: [NotaService],
})
export class NotaModule {}
