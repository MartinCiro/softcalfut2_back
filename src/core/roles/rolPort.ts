export default interface RolesPort {
    crearRoles(rolData: { nombre: string; descripcion?: string; permisos: (string | number)[];}): Promise<any>;
    obtenerRoles(): Promise<any>;
    obtenerRolesXid(rolData: { id: string | number; }): Promise<any>;
    delRol(rolData: { id: string | number; }): Promise<any>;
    actualizaRol(rolData: { nombre?: string; descripcion?: string; id: number | string; }): Promise<any>;
}

