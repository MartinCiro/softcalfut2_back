export default interface PermisosPort {
    crearPermisos(permisoData: { nombre: string; descripcion?: string; }): Promise<any>;
    obtenerPermisos(): Promise<any>;
    obtenerPermisosXid(permisoData: { id: string | number; }): Promise<any>;
    delPermiso(permisoData: { id: string | number; }): Promise<any>;
    actualizaPermiso(permisoData: { nombre?: string; descripcion?: string; id: number | string; estado?: number | string; }): Promise<any>;
}

