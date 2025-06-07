import { Injectable, Inject } from '@nestjs/common';
import ProgramacionesPort from './programacionPort';
import { ProgramacionData, ProgramacionDataUpdate, ProgramacionDataXid } from 'api/programaciones/models/programacion.model';

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
