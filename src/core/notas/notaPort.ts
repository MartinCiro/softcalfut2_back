import { NotaData, NotaDataUpdate } from '../../interfaces/api/notas/models/nota.model';

export default interface NotasPort {
    obtenerNotas(): Promise<any>;
    crearNotas(equipoData: NotaData): Promise<any>;
    actualizaNota(equipoData: NotaDataUpdate ): Promise<any>;
}