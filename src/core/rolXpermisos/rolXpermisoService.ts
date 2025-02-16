// src/core/rolXpermisos/rolXpermisoService.ts
import RolxPermisoPort from './rolXpermisoPort';
import RolxPermisoAdapter from '../../interfaces/db/rolXpermisoAdapter';


interface RolxPermisoData {
  id_rol: string | number; 
  id_permiso: Array<string | number>;
}

interface RolxPermisoDataXid {
  id_rol: string | number;
}


class RolxPermisoService {
  private rolXpermisoPort: RolxPermisoPort;

  constructor(rolXpermisoPort: RolxPermisoPort) {
    this.rolXpermisoPort = rolXpermisoPort;
  }

  // Lógica de negocio para crear un rol
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

const rolXpermisoService = new RolxPermisoService(new RolxPermisoAdapter());
export default RolxPermisoService;
