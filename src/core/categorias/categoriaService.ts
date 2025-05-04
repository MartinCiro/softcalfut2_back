import { Injectable, Inject } from '@nestjs/common';
import CategoriasPort from './categoriaPort';

interface CategoriaData {
  nombre: string;
}

interface CategoriaDataXid {
  id: number | string;
}

type CategoriaDataUpdate = Partial<Omit<CategoriaData, 'id'>> & CategoriaDataXid;

@Injectable() 
export class CategoriaService {
  constructor(
    @Inject('CategoriasPort') private categoriaPort: CategoriasPort
  ) {}

  async obtenerCategorias() {
    return await this.categoriaPort.obtenerCategorias();
  }

  async crearCategoria(categoriaData: CategoriaData) {
    return await this.categoriaPort.crearCategorias(categoriaData);
  }

  async obtenerCategoriaXid(categoriaData: CategoriaDataXid) {
    return await this.categoriaPort.obtenerCategoriasXid(categoriaData);
  }

  async upCategoria(categoriaData: CategoriaDataUpdate) {
    return await this.categoriaPort.actualizaCategoria(categoriaData);
  }

  async delCategoria(categoriaData: CategoriaDataXid) {
    return await this.categoriaPort.delCategoria(categoriaData);
  }
}
