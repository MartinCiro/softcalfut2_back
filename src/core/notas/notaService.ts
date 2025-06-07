import { Injectable, Inject } from '@nestjs/common';
import NotasPort from './notaPort';

interface NotaData {
  nombre: string;
  descripcion?: string;
}
  
interface NotaDataXid {
  id: number | string;
}

type NotaDataUpdate = Partial<Omit<NotaData, 'id'>> & NotaDataXid;

@Injectable() 
export class NotaService {
  constructor(
    @Inject('NotasPort') private notaPort: NotasPort
  ) {}

  async obtenerNotas(): Promise<any> {
    return await this.notaPort.obtenerNotas();
  }

  async crearNota(notaData: NotaData) {
    return await this.notaPort.crearNotas(notaData);
  }

  async upNota(notaData: NotaDataUpdate) {
    return await this.notaPort.actualizaNota(notaData);
  }
}