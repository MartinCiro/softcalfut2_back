import { Injectable, Inject } from '@nestjs/common';
import AnunciosPort from './anuncioPort';

interface AnuncioData {
  nombre: string;
  contenido: string;
  imagenUrl: string;
  estado?: boolean;
}

interface AnuncioDataXid {
  id: number | string;
}

type AnuncioDataUpdate = Partial<Omit<AnuncioData, 'id'>> & AnuncioDataXid;

@Injectable() 
export class AnuncioService {
  constructor(
    @Inject('AnunciosPort') private AnuncioPort: AnunciosPort
  ) {}

  async obtenerAnuncios() {
    return await this.AnuncioPort.obtenerAnuncios();
  }

  async crearAnuncio(AnuncioData: AnuncioData) {
    return await this.AnuncioPort.crearAnuncios(AnuncioData);
  }

  async obtenerAnuncioXid(AnuncioData: AnuncioDataXid) {
    return await this.AnuncioPort.obtenerAnunciosXid(AnuncioData);
  }

  async upAnuncio(AnuncioData: AnuncioDataUpdate) {
    return await this.AnuncioPort.actualizaAnuncio(AnuncioData);
  }

  async delAnuncio(AnuncioData: AnuncioDataXid) {
    return await this.AnuncioPort.delAnuncio(AnuncioData);
  }
}
