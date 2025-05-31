import { EquipoCompleto } from "core/equipos/equipoService";

export default interface EquiposPort {
    obtenerEquipos(): Promise<EquipoCompleto[]>;
    crearEquipos(equipoData: { categoria: string; nom_equipo: string; encargado: string; jugadores?: (number | string)[]; }): Promise<any>;
    actualizaEquipo(equipoData: { categoria?: string; nom_equipo?: string; encargado?: string; jugadores?: (number | string)[]; id: string | number;}): Promise<any>;
}