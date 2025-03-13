export default interface EstadosPort {
    crearEstados(usuarioData: { nombre: string; descripcion?: string; }): Promise<any>;
    obtenerEstados(): Promise<any>;
    obtenerEstadosXid(usuarioData: { id: string | number; }): Promise<any>;
    delEstado(usuarioData: { id: string | number; }): Promise<any>;
    actualizaEstado(usuarioData: { nombre?: string; descripcion?: string; id: string | number;}): Promise<any>;
}

