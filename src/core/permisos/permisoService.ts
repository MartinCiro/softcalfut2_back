import { Injectable, Inject } from '@nestjs/common';
import PermisosPort from './permisoPort';

interface PermisoData {
  nombre: string;
  descripcion?: string;
  estado?: number | string;
}

  
interface PermisoDataXid {
  id: number | string;
}

type PermisoDataUpdate = Partial<Omit<PermisoData, 'id'>> & PermisoDataXid;


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

  async obtenerPermisoXid(permisoData: PermisoDataXid) {
    return await this.permisoPort.obtenerPermisosXid(permisoData);
  }

  async upPermiso(permisoData: PermisoDataUpdate) {
    return await this.permisoPort.actualizaPermiso(permisoData);
  }

  async delPermiso(permisoData: PermisoDataXid) {
    return await this.permisoPort.delPermiso(permisoData);
  }
}
