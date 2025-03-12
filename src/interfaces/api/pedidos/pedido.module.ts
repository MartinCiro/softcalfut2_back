import { Module } from '@nestjs/common';
import { PedidoService } from '../../../core/pedidos/pedidoService';
import { PedidoController } from './pedidoController';

import  PedidosAdapter  from '../../db/pedidoAdapter';
import { PedidosPortToken } from './pedido-port.token';
import { CacheModule } from '../../../shared/cache/cache.module';

@Module({
  controllers: [PedidoController],
  imports: [CacheModule],
  providers: [
    PedidoService,
    {
      provide: PedidosPortToken, 
      useClass: PedidosAdapter,   
    },
  ],
  exports: [PedidoService],
})
export class PedidoModule {}
