export default interface UsuariosPort {
    crearUsuarios(usuarioData: { username: string; nombres: string; apellidos: string; pass: string;  id_rol?: number | string; }): Promise<any>;
    obtenerUsuarios(): Promise<any>;
    obtenerUsuariosXid(usuarioData: { id: string | number; }): Promise<any>;
    delUsuario(usuarioData: { id: string | number; }): Promise<any>;
    actualizaUsuario(usuarioData: { nombres?: string; apellidos?: string;  id_estado?: number | string;  id_rol?: number | string; id: number | string; }): Promise<any>;
}

