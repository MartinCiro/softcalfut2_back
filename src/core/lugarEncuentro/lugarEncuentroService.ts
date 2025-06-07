import { Injectable, Inject } from '@nestjs/common';
import LugarEncuentroPort from './lugarEncuentroPort';
import { LugarEncuentroData, LugarEncuentroDataUpdate } from 'api/lugarEncuentro/models/lugarEncuentro.model';


@Injectable() 
export class LugarEncuentroService {
  constructor(
    @Inject('LugarEncuentroPort') private lugarEncuentroPort: LugarEncuentroPort
  ) {}

  async obtenerLugarEncuentro(): Promise<any> {
    return await this.lugarEncuentroPort.obtenerLugarEncuentro();
  }

  async crearLugarEncuentro(lugarEncuentroData: LugarEncuentroData) {
    return await this.lugarEncuentroPort.crearLugarEncuentro(lugarEncuentroData);
  }

  async upLugarEncuentro(lugarEncuentroData: LugarEncuentroDataUpdate) {
    return await this.lugarEncuentroPort.actualizaLugarEncuentro(lugarEncuentroData);
  }
}