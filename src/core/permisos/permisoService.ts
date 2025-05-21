import { Injectable, Inject } from '@nestjs/common';
import PermisosPort from './permisoPort';

interface PermisoData {
  permisos: string[];
  descripcion?: string;
}

@Injectable() 
export class PermisoService {
  constructor(
    @Inject('PermisosPort') private permisoPort: PermisosPort
  ) {}

  async obtenerPermisos() {
    return await this.permisoPort.obtenerPermisos();
  }

  async crearPermiso(permisoData: PermisoData) {
    return await this.permisoPort.crearPermisos(permisoData);
  }

  async upPermiso(permisoData: PermisoData) {
    return await this.permisoPort.actualizaPermisos(permisoData);
  }
}
