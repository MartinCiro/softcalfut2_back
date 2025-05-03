export default interface UsuariosPort {
    obtenerUsuarios(): Promise<any>;
    obtenerUsuariosXid(usuarioData: { numero_documento: string | number; }): Promise<any>;
    delUsuario(usuarioData: { numero_documento: string | number; }): Promise<any>;
    crearUsuarios(
        usuarioData: { 
            nombres: string;
            passwd: string; 
            id_rol?: number | string; 
            apellido: string;
            numero_documento: string;
            email: string;
            estado_id?: number | string; 
            info_perfil?: string;
            nom_user: string;
            numero_contacto?: string;
            fecha_nacimiento: string | Date; 
        }
    ): Promise<any>;
    actualizaUsuario(
        usuarioData: { 
            nombres?: string;
            id_rol?: number | string; 
            apellido?: string;
            numero_documento: string;
            email?: string;
            estado_id?: number | string; 
            info_perfil?: string;
            nom_user?: string;
            numero_contacto?: string;
            fecha_nacimiento?: string | Date; 
        }
    ): Promise<any>;
}

