export default interface PermisosPort {
    crearPermisos(permisoData: { descripcion?: string; permisos: string[] }): Promise<any>;
    obtenerPermisos(): Promise<any>;
    actualizaPermisos(permisoData: { descripcion?: string; permisos: string[] }): Promise<any>;
}

