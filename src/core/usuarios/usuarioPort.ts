export default interface UsuariosPort {
    crearUsuarios(usuarioData: { nombres: string; email: string; pass: string; estado?: number | string; id_rol: number | string; }): Promise<any>;
    obtenerUsuarios(): Promise<any>;
    obtenerUsuariosXid(usuarioData: { email: string | number; }): Promise<any>;
    delUsuario(usuarioData: { email: string | number; }): Promise<any>;
    actualizaUsuario(usuarioData: { nombres?: string; email?: string; pass?: string; estado?: number | string; id_rol?: number | string; }): Promise<any>;
}

