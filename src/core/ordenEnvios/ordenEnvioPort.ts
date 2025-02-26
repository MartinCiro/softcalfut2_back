interface OrdenEnviosPort {
    crearOrdenEnvios(ordenEnvioData: {
        id_remitente: string | number; id_destinatario?: string | number; direccion: string; peso: number; dimensiones: string; contenido: string; tipo_envio: string | number; id_transportista: string | number; fecha_envio?: string | number;
    }): Promise<any>;
    obtenerOrdenEnvios(): Promise<any>;
    obtenerOrdenEnviosXid(ordenEnvioDataId: { id_ordenEnvio: string | number; }): Promise<any>;
    delOrdenEnvio(ordenEnvioDataId: { id_ordenEnvio: string | number; }): Promise<any>;
    actualizaOrdenEnvio(ordenEnvioDataId: { id_ordenEnvio: string | number; nombre?: string; descripcion?: string; }): Promise<any>;
}

export default OrdenEnviosPort;
