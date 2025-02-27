import RolxPermisoPort from './rolXpermisoPort';
import { Injectable, Inject } from '@nestjs/common';

interface RolxPermisoData {
  id_rol: string | number;
  id_permiso: Array<string | number>;
}

interface RolxPermisoDataXid {
  id_rol: string | number;
}

@Injectable()
export class RolxPermisoService {
  constructor(
    @Inject('RolxPermisoPort') private rolXpermisoPort: RolxPermisoPort
  ) { }
  
  async crearRolxPermisos(rolXpermisoDat: RolxPermisoData) {
    return await this.rolXpermisoPort.crearRolxPermisos(rolXpermisoDat);
  }

  async obtenerRolxPermisos() {
    return await this.rolXpermisoPort.obtenerRolxPermisos();
  }

  async obtenerRolxPermisoXid(rolXpermisoDataId: RolxPermisoDataXid) {
    return await this.rolXpermisoPort.obtenerRolxPermisosXid(rolXpermisoDataId);
  }
}
