// src/core/roles/roleService.ts
import RolePort from './rolePort';
import RoleAdapter from '../../interfaces/db/roleAdapter';

interface RolData {
  nombre: string;
  descripcion: string;
}

interface RolDataXid {
  id_rol: string | number;
}

interface RolDataConId extends Partial<RolData>, RolDataXid { }

class RolService {
  private rolePort: RolePort;

  constructor(rolePort: RolePort) {
    this.rolePort = rolePort;
  }

  // Lógica de negocio para crear un rol
  async crearRol(rolData: RolData) {
    return await this.rolePort.crearRol(rolData);
  }

  async obtenerRol() {
    return await this.rolePort.obtenerRol();
  }

  async obtenerRolXid(rolDataId: RolDataXid) {
    return await this.rolePort.obtenerRolXid(rolDataId);
  }

  async delRol(rolDataId: RolDataXid) {
    return await this.rolePort.delRol(rolDataId);
  }

  async upRol(rolDataId: RolDataConId) {
    return await this.rolePort.actualizaRol(rolDataId);
  }
}

const roleService = new RolService(new RoleAdapter());
export default RolService;
