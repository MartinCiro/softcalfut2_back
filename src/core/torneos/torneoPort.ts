export default interface TorneosPort {
    obtenerTorneos(): Promise<any>;
    delTorneo(torneoData: { id: string | number; }): Promise<any>;
    crearTorneos(torneoData: { nombre: string; }): Promise<any>;
    obtenerTorneosXid(torneoData: { id: string | number; }): Promise<any>;
    actualizaTorneo(torneoData: { nombre?: string; id: string | number;}): Promise<any>;
}

