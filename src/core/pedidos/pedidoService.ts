import { Injectable, Inject } from '@nestjs/common';
import PedidosPort from './pedidoPort';

interface PedidoData {
  descripcion: string;
  fecha: Date;
  id?: string; 
  estado?: number | string; 
}

interface PedidoDataXid {
  id_pedido: number | string;
}

type PedidoDataXusuario = Pick<PedidoData, 'id'>;


interface PedidoDataUpdate extends PedidoDataXid, Partial<Omit<PedidoData, 'id'>> {}



@Injectable() 
export class PedidoService {
  constructor(
    @Inject('PedidosPort') private pedidoPort: PedidosPort
  ) {}

  async obtenerPedidos() {
    return await this.pedidoPort.obtenerPedidos();
  }

  async crearPedido(pedidoData: PedidoData) {
    return await this.pedidoPort.crearPedidos(pedidoData);
  }

  async obtenerPedidoXusuario(pedidoDataxUsuario: PedidoDataXusuario) {
    return await this.pedidoPort.obtenerPedidosXusuario(pedidoDataxUsuario);
  }

  async obtenerPedidoXid(pedidoData: PedidoDataXid) {
    return await this.pedidoPort.obtenerPedidosXid(pedidoData);
  }

  async upPedido(pedidoData: PedidoDataUpdate) {
    return await this.pedidoPort.actualizaPedido(pedidoData);
  }

  async delPedido(pedidoData: PedidoDataXid) {
    return await this.pedidoPort.delPedido(pedidoData);
  }
}
