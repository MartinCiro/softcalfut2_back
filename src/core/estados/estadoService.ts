import { Injectable, Inject } from '@nestjs/common';
import EstadosPort from './estadoPort';

interface EstadoData {
  nombre: string;
  descripcion?: string;
}

  
interface EstadoDataXid {
  id: number | string;
}

type EstadoDataUpdate = Partial<Omit<EstadoData, 'id'>> & EstadoDataXid;


@Injectable() 
export class EstadoService {
  constructor(
    @Inject('EstadosPort') private estadoPort: EstadosPort
  ) {}

  async obtenerEstados() {
    return await this.estadoPort.obtenerEstados();
  }

  async crearEstado(estadoData: EstadoData) {
    return await this.estadoPort.crearEstados(estadoData);
  }

  async obtenerEstadoXid(estadoData: EstadoDataXid) {
    return await this.estadoPort.obtenerEstadosXid(estadoData);
  }

  async upEstado(estadoData: EstadoDataUpdate) {
    return await this.estadoPort.actualizaEstado(estadoData);
  }

  async delEstado(estadoData: EstadoDataXid) {
    return await this.estadoPort.delEstado(estadoData);
  }
}
