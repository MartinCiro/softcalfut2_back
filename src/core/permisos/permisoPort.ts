interface PermisosPort {
    crearPermisos(permisoData: { nombre: string; descripcion: string; }): Promise<any>;
    obtenerPermisos(): Promise<any>;
    obtenerPermisosXid(permisoDataId: { id_permiso: string | number; }): Promise<any>;
    delPermiso(permisoDataId: { id_permiso: string | number; }): Promise<any>;
    actualizaPermiso(permisoDataId: { id_permiso: string | number; nombre?: string; descripcion?: string; }): Promise<any>;
}

export default PermisosPort;
