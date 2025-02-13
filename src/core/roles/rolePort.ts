interface RolePort {
    crearRol(roleData: { nombre: string; descripcion: string }): Promise<any>;
    obtenerRoles(): Promise<any>;
}
  
export default RolePort;
  