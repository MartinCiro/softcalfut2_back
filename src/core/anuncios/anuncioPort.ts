export default interface AnunciosPort {
    obtenerAnuncios(): Promise<any>;
    delAnuncio(AnuncioData: { id: string | number; }): Promise<any>;
    crearAnuncios(AnuncioData: {
        nombre: string;
        contenido: string;
        imagenUrl: string;
    }): Promise<any>;
    obtenerAnunciosXid(AnuncioData: { id: string | number; }): Promise<any>;
    actualizaAnuncio(AnuncioData: {
        id: string | number; 
        nombre?: string;
        contenido?: string;
        imagenUrl?: string;
    }): Promise<any>;
}

