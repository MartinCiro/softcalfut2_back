import { Injectable, Inject } from '@nestjs/common';
import EquiposPort from './equipoPort';

interface EquipoData {
  nombre_equipo: string;
  num_doc: number | string;
}

interface EquipoDataXid {
  id: number | string;
}

type EquipoDataUpdate = Partial<Omit<EquipoData, 'id'>> & EquipoDataXid;

@Injectable() 
export class EquipoService {
  constructor(
    @Inject('EquiposPort') private equipoPort: EquiposPort
  ) {}

  async obtenerEquipos() {
    return await this.equipoPort.obtenerEquipos();
  }

  async crearEquipo(equipoData: EquipoData) {
    return await this.equipoPort.crearEquipos(equipoData);
  }

  async obtenerEquipoXid(equipoData: EquipoDataXid) {
    return await this.equipoPort.obtenerEquiposXid(equipoData);
  }

  async upEquipo(equipoData: EquipoDataUpdate) {
    return await this.equipoPort.actualizaEquipo(equipoData);
  }

  async delEquipo(equipoData: EquipoDataXid) {
    return await this.equipoPort.delEquipo(equipoData);
  }
}
