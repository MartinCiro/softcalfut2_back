import PermisoPort from './permisoPort';
import PermisoAdapter from '../../interfaces/db/permisoAdapter';


interface PermisoData {
  nombre: string;
  descripcion: string;
}

interface PermisoDataXid {
  id_permiso: string | number;
}

interface PermisoDataConId extends Partial<PermisoData>, PermisoDataXid {}

class PermisoService {
  private permisoPort: PermisoPort;

  constructor(permisoPort: PermisoPort) {
    this.permisoPort = permisoPort;
  }

  async crearPermisos(permisoDat: PermisoData) {
    return await this.permisoPort.crearPermisos(permisoDat);
  }

  async obtenerPermisos() {
    return await this.permisoPort.obtenerPermisos();
  }

  async obtenerPermisoXid(permisoDataId: PermisoDataXid) {
    return await this.permisoPort.obtenerPermisosXid(permisoDataId);
  }

  async delPermiso(permisoDataId: PermisoDataXid) {
    return await this.permisoPort.delPermiso(permisoDataId);
  }

  async upPermiso(permisoDataId: PermisoDataConId) {
    return await this.permisoPort.actualizaPermiso(permisoDataId);
  }
  
}

const permisoService = new PermisoService(new PermisoAdapter());
export default PermisoService;
