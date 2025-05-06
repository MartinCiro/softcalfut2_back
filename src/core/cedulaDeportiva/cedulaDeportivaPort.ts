type CedulaBaseInput = {
    estado?: number;
    categoria: number;
    torneo: number;
    equipo: number;
    foto?: string;
};

type CedulaCreateInput = Omit<CedulaBaseInput, 'estado'>;


type CedulaIdInput = { id: number | string };
type CedulaUpdateInput = CedulaIdInput & Partial<CedulaBaseInput>;


export default interface CedulaDeportivaPort {
    crearCedulaDeportiva(data: CedulaCreateInput): Promise<any>;
    actualizaCedulaDeportiva(data: CedulaUpdateInput): Promise<any>;
    obtenerCedulaDeportivaXid(data: CedulaIdInput): Promise<any>;
    delCedulaDeportiva(data: CedulaIdInput): Promise<any>;
}
