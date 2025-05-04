export default interface CategoriasPort {
    obtenerCategorias(): Promise<any>;
    delCategoria(categoriaData: { id: string | number; }): Promise<any>;
    crearCategorias(categoriaData: { nombre: string; }): Promise<any>;
    obtenerCategoriasXid(categoriaData: { id: string | number; }): Promise<any>;
    actualizaCategoria(categoriaData: { nombre?: string; id: string | number;}): Promise<any>;
}

