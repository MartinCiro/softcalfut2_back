export default interface ProgramacionesPort {
    obtenerProgramaciones(): Promise<any>;
    delProgramacion(programacionData: { id: string | number; }): Promise<any>;
    crearProgramaciones(programacionData: {
        nombreCompetencia: string;
        lugarEncuentro: string;
        fechaEncuentro: string;
        equipoLocal: number;
        equipoVisitante: number;
        rama: string;
    }): Promise<any>;
    obtenerProgramacionesXid(programacionData: { id: string | number; }): Promise<any>;
    actualizaProgramacion(programacionData: {
        nombreCompetencia?: string;
        lugarEncuentro?: string;
        fechaEncuentro?: string;
        equipoLocal?: number;
        equipoVisitante?: number;
        rama?: string; 
        id: string | number;
    }): Promise<any>;
}

