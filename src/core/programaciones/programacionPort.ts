export default interface ProgramacionesPort {
    obtenerProgramaciones(): Promise<any>;
    delProgramacione(programacionData: { id: string | number; }): Promise<any>;
    crearProgramaciones(programacionData: {
        nombreCompetencia: string;
        lugarEncuentro: string;
        fechaEncuentro: string;
        equipoLocal: number;
        equipoVisitante: number;
        categoriaEncuentro: number;
        rama: string;
    }): Promise<any>;
    obtenerProgramacionesXid(programacionData: { id: string | number; }): Promise<any>;
    actualizaProgramacione(programacionData: {
        nombreCompetencia?: string;
        lugarEncuentro?: string;
        fechaEncuentro?: string;
        equipoLocal?: number;
        equipoVisitante?: number;
        categoriaEncuentro?: number;
        rama?: string; 
        id: string | number;
    }): Promise<any>;
}

