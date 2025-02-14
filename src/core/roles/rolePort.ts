interface RolePort {
    crearRol(rolData: { nombre: string; descripcion: string; estado?: number; }): Promise<any>;
    obtenerRol(): Promise<any>;
    obtenerRolXid(rolDataId: { id_rol: string | number; }): Promise<any>;
    delRol(rolDataId: { id_rol: string | number; }): Promise<any>;
    actualizaRol(rolDataId: { id_rol: string | number; nombre?: string; descripcion?: string; estado?: number;}): Promise<any>;
}
  
export default RolePort;
  