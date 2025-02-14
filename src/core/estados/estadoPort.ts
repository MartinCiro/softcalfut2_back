interface EstadosPort {
    crearEstados(estadoData: { nombre: string; descripcion: string }): Promise<any>;
    obtenerEstados(): Promise<any>;
    obtenerEstadosXid(estadoDataId: { id_estado: string | number; }): Promise<any>;
    delEstado(estadoDataId: { id_estado: string | number; }): Promise<any>;
    actualizaEstado(EstadoDataId: { id_estado: string | number; }): Promise<any>;
}
  
export default EstadosPort;
  