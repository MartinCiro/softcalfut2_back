import { Injectable, Inject } from '@nestjs/common';
import AfiliadosPort from './afiliadoPort';
import { AfiliadoData, AfiliadoDataUpdate } from '@api/afiliados/models/afiliado.model';


@Injectable() 
export class AfiliadoService {
  constructor(
    @Inject('AfiliadosPort') private afiliadoPort: AfiliadosPort
  ) {}

  async obtenerAfiliados(rol?: any): Promise<any[]> {
    return await this.afiliadoPort.obtenerAfiliados(rol);
  }

  async crearAfiliado(afiliadoData: AfiliadoData) {
    return await this.afiliadoPort.crearAfiliados(afiliadoData);
  }

  async upAfiliado(afiliadoData: AfiliadoDataUpdate) {
    return await this.afiliadoPort.actualizaAfiliado(afiliadoData);
  }
}