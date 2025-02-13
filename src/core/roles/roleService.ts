// src/core/roles/roleService.ts
import RolePort from './rolePort';
import RoleAdapter from '../../interfaces/db/roleAdapter';


interface RoleData {
  nombre: string;
  descripcion: string;
}

class RoleService {
  private rolePort: RolePort;

  constructor(rolePort: RolePort) {
    this.rolePort = rolePort;
  }

  // Lógica de negocio para crear un rol
  async crearRol(roleData: RoleData) {
    return await this.rolePort.crearRol(roleData);
  }

  async obtenerRoles() {
    return await this.rolePort.obtenerRoles();
  }
}

const roleService = new RoleService(new RoleAdapter());
export default RoleService;
