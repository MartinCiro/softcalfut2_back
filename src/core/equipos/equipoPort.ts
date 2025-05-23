export default interface EquiposPort {
    obtenerEquipos(): Promise<any>;
    crearEquipos(equipoData: { nom_equipo: string; encargado: string; jugadores?: (number | string)[]; }): Promise<any>;
    actualizaEquipo(equipoData: { nom_equipo?: string; encargado?: string; jugadores?: (number | string)[]; id: string | number;}): Promise<any>;
}