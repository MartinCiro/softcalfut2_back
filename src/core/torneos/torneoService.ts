import { Injectable, Inject } from '@nestjs/common';
import TorneosPort from './torneoPort';

interface TorneoData {
  nombre: string;
}

interface TorneoDataXid {
  id: number | string;
}

type TorneoDataUpdate = Partial<Omit<TorneoData, 'id'>> & TorneoDataXid;

@Injectable() 
export class TorneoService {
  constructor(
    @Inject('TorneosPort') private torneoPort: TorneosPort
  ) {}

  async obtenerTorneos() {
    return await this.torneoPort.obtenerTorneos();
  }

  async crearTorneo(torneoData: TorneoData) {
    return await this.torneoPort.crearTorneos(torneoData);
  }

  async obtenerTorneoXid(torneoData: TorneoDataXid) {
    return await this.torneoPort.obtenerTorneosXid(torneoData);
  }

  async upTorneo(torneoData: TorneoDataUpdate) {
    return await this.torneoPort.actualizaTorneo(torneoData);
  }

  async delTorneo(torneoData: TorneoDataXid) {
    return await this.torneoPort.delTorneo(torneoData);
  }
}
