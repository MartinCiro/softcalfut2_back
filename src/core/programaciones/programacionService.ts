import { Injectable, Inject } from '@nestjs/common';
import ProgramacionesPort from './programacionPort';

interface ProgramacionData {
  nombreCompetencia: string;
  lugarEncuentro: string;
  fechaEncuentro: string;
  equipoLocal: number;
  equipoVisitante: number;
  categoriaEncuentro: number;
  rama: string;
}

interface ProgramacionDataXid {
  id: number | string;
}

type ProgramacionDataUpdate = Partial<Omit<ProgramacionData, 'id'>> & ProgramacionDataXid;

@Injectable() 
export class ProgramacionService {
  constructor(
    @Inject('ProgramacionesPort') private programacionPort: ProgramacionesPort
  ) {}

  async obtenerProgramaciones() {
    return await this.programacionPort.obtenerProgramaciones();
  }

  async crearProgramacion(programacionData: ProgramacionData) {
    return await this.programacionPort.crearProgramaciones(programacionData);
  }

  async obtenerProgramacionXid(programacionData: ProgramacionDataXid) {
    return await this.programacionPort.obtenerProgramacionesXid(programacionData);
  }

  async upProgramacion(programacionData: ProgramacionDataUpdate) {
    return await this.programacionPort.actualizaProgramacion(programacionData);
  }

  async delProgramacion(programacionData: ProgramacionDataXid) {
    return await this.programacionPort.delProgramacion(programacionData);
  }
}
