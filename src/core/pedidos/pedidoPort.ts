export default interface PedidosPort {
    crearPedidos(pedidoData: {
        descripcion: string;
        fecha: Date;
        id: string;
        estado?: number | string;
    }): Promise<any>;
    obtenerPedidos(): Promise<any>;
    obtenerPedidosXusuario(pedidoData: { id: string | number; }): Promise<any>;
    obtenerPedidosXid(pedidoData: { id_pedido: string | number; }): Promise<any>;
    delPedido(pedidoData: { id_pedido: string | number; }): Promise<any>;

    actualizaPedido(pedidoData: {
        id_pedido: string | number;
        descripcion?: string;
        fecha?: Date;
        id_estado?: number;
    }): Promise<any>;
}

