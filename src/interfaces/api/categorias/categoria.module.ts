import { Module } from '@nestjs/common';
import { CategoriaService } from 'core/categorias/categoriaService';
import { CategoriaController } from './categoriaController';
import { RedisService } from 'shared/cache/redis.service';

import  CategoriasAdapter  from 'db/categoriaAdapter';
import { CategoriasPortToken } from './categoria-port.token';

@Module({
  controllers: [CategoriaController],
  providers: [
    CategoriaService,
    {
      provide: CategoriasPortToken, 
      useClass: CategoriasAdapter,   
    },
    RedisService
  ],
  exports: [CategoriaService],
})
export class CategoriaModule {}
