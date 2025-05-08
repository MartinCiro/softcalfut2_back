import { Module } from '@nestjs/common';
import { AnuncioService } from 'core/anuncios/anuncioService';
import { AnuncioController } from './anuncioController';
import { RedisService } from 'shared/cache/redis.service';

import  AnunciosAdapter  from 'db/anuncioAdapter';
import { AnunciosPortToken } from './anuncio-port.token';

@Module({
  controllers: [AnuncioController],
  providers: [
    AnuncioService,
    {
      provide: AnunciosPortToken, 
      useClass: AnunciosAdapter,   
    },
    RedisService
  ],
  exports: [AnuncioService],
})
export class AnuncioModule {}
