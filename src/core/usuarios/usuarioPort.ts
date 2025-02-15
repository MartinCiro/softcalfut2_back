interface UsuariosPort {
    crearUsuarios(usuarioData: { documento: number | string; nombres: string; apellido: string; email: string; info_perfil?: string; num_contacto: string; pass: string; estado: number | string; id_rol: number | string; fecha_nacimiento: Date; }): Promise<any>;
    obtenerUsuarios(): Promise<any>;
    obtenerUsuariosXid(usuarioData: { documento: string | number; }): Promise<any>;
    delUsuario(usuarioData: { documento: string | number; }): Promise<any>;
    actualizaUsuario(usuarioData: { documento: number | string; nombres?: string; apellido?: string; email?: string; info_perfil?: string; num_contacto?: string; pass?: string; estado?: number | string; id_rol?: number | string; fecha_nacimiento?: Date; }): Promise<any>;
}

export default UsuariosPort;
