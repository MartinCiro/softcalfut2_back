export default interface RolxPermisoPort {
    crearRolxPermisos(rolXpermisoData: { id_rol: string | number; id_permiso: Array<string | number>; }): Promise<any>;
    obtenerRolxPermisos(): Promise<any>;
    obtenerRolxPermisosXid(rolXpermisoData: { id_rol: string | number; }): Promise<any>;
}
