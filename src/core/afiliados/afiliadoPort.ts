import { AfiliadoData, AfiliadoDataUpdate } from '@api/afiliados/models/afiliado.model';

export default interface AfiliadosPort {
    obtenerAfiliados(rol?: string): Promise<any>;
    crearAfiliados(afiliadoData: AfiliadoData): Promise<any>;
    actualizaAfiliado(afiliadoData: AfiliadoDataUpdate): Promise<any>;
}