import { Injectable, Inject } from '@nestjs/common';
import CedulaDeportivaPort from './cedulaDeportivaPort';

interface CedulaDeportivaData {
  categoria: number;
  torneo: number;
  equipo: number;
  foto?: string;
}

interface CedulaDeportivaDataXid {
  id: number | string;
}

type CedulaDeportivaDataUpdate = Partial<Omit<CedulaDeportivaData, 'id'>> & CedulaDeportivaDataXid;


@Injectable() 
export class CedulaDeportivaService {
  constructor(
    @Inject('CedulaDeportivaPort') private cedulaDeportivaPort: CedulaDeportivaPort
  ) {}

  async CrearCedulaDeportiva(cedulaDeportivaData: CedulaDeportivaData) {
    return await this.cedulaDeportivaPort.crearCedulaDeportiva(cedulaDeportivaData);
  }

  async ObtenerCedulaDeportivaXid(cedulaDeportivaData: CedulaDeportivaDataXid) {
    return await this.cedulaDeportivaPort.obtenerCedulaDeportivaXid(cedulaDeportivaData);
  }

  async UpCedulaDeportiva(cedulaDeportivaData: CedulaDeportivaDataUpdate) {
    return await this.cedulaDeportivaPort.actualizaCedulaDeportiva(cedulaDeportivaData);
  }

  async DelCedulaDeportiva(cedulaDeportivaData: CedulaDeportivaDataXid) {
    return await this.cedulaDeportivaPort.delCedulaDeportiva(cedulaDeportivaData);
  }
}
