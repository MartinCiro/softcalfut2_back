import { Injectable, Inject } from '@nestjs/common';
import EquiposPort from './equipoPort';

interface EquipoData {
  nom_equipo: string; 
  encargado: string; 
  jugadores?: (number | string)[];
}

type EquipoDataUpdate = Partial<Omit<EquipoData, 'id'>> & { id: string | number };

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

  async upEquipo(equipoData: EquipoDataUpdate) {
    return await this.equipoPort.actualizaEquipo(equipoData);
  }
}
