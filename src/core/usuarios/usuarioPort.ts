export default interface UsuariosPort {
    obtenerUsuarios(): Promise<any>;
    obtenerUsuariosXid(usuarioData: { documento: string | number; }): Promise<any>;
    delUsuario(usuarioData: { documento: string | number; }): Promise<any>;
    crearUsuarios(usuarioData: { documento: string; nombres: string; apellido: string; pass: string;  id_rol?: number | string; }): Promise<any>;
    actualizaUsuario(usuarioData: { nombres?: string; apellido?: string;  estado_id?: number | string;  id_rol?: number | string; documento: number | string; }): Promise<any>;
}

