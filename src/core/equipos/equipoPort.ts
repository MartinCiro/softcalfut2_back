export default interface EquiposPort {
    obtenerEquipos(): Promise<any>;
    delEquipo(equipoData: { id: string | number; }): Promise<any>;
    crearEquipos(equipoData: { nombre_equipo: string; num_doc: string | number;}): Promise<any>;
    obtenerEquiposXid(equipoData: { id: string | number; }): Promise<any>;
    actualizaEquipo(equipoData: { num_doc?: string | number; nombre_equipo?: string; id: string | number;}): Promise<any>;
}

