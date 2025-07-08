import { ProgramacionData, ProgramacionDataUpdate, ProgramacionDataXid } from 'api/programaciones/models/programacion.model';
export default interface ProgramacionesPort {
    obtenerProgramaciones(documento: string, rol: string): Promise<any>;
    crearProgramaciones(programacionData: ProgramacionData): Promise<any>;
    actualizaProgramacion(programacionData: ProgramacionDataUpdate): Promise<any>;

    delProgramacion(programacionData: ProgramacionDataXid): Promise<any>;
    obtenerProgramacionesXid(programacionData: ProgramacionDataXid): Promise<any>;
}

