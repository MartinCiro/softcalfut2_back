export default interface PedidosPort {
    crearPedidos(pedidoData: {
        descripcion: string;
        fecha: Date;
        email: string;
        estado?: number | string;
    }): Promise<any>;
    obtenerPedidos(): Promise<any>;
    obtenerPedidosXusuario(pedidoData: { email: string | number; }): Promise<any>;
    obtenerPedidosXid(pedidoData: { id: string | number; }): Promise<any>;
    delPedido(pedidoData: { id: string | number; }): Promise<any>;
    actualizaPedido(pedidoData: { nombres?: string; email?: string; pass?: string; estado?: number | string; id_rol?: number | string; }): Promise<any>;
}

