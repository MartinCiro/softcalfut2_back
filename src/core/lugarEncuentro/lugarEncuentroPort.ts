import { LugarEncuentroData, LugarEncuentroDataUpdate } from 'api/lugarEncuentro/models/lugarEncuentro.model';

export default interface LugarEncuentroPort {
    obtenerLugarEncuentro(): Promise<any>;
    crearLugarEncuentro(equipoData: LugarEncuentroData): Promise<any>;
    actualizaLugarEncuentro(equipoData: LugarEncuentroDataUpdate ): Promise<any>;
}