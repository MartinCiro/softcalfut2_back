import OrdenEnviosPort from './ordenEnvioPort';
import OrdenEnvioAdapter from '../../interfaces/db/ordenEnvioAdapter';


interface OrdenEnvioData {
  id_remitente: string | number; 
  id_destinatario?: string | number; 
  id_transportista: string | number; 
  direccion: string; 
  peso: number; 
  dimensiones: string; 
  contenido: string; 
  tipo_envio: string | number; 
  fecha_envio?: string | number; 
}

interface OrdenEnvioDataXid {
  id_ordenEnvio: string | number;
}

interface OrdenEnvioDataConId extends Partial<OrdenEnvioData>, OrdenEnvioDataXid {}

class OrdenEnvioService {
  private ordenEnvioPort: OrdenEnviosPort;

  constructor(ordenEnvioPort: OrdenEnviosPort) {
    this.ordenEnvioPort = ordenEnvioPort;
  }

  // Lógica de negocio para crear un rol
  async crearOrdenEnvios(ordenEnvioDat: OrdenEnvioData) {
    return await this.ordenEnvioPort.crearOrdenEnvios(ordenEnvioDat);
  }

  async obtenerOrdenEnvios() {
    return await this.ordenEnvioPort.obtenerOrdenEnvios();
  }

  async obtenerOrdenEnvioXid(ordenEnvioDataId: OrdenEnvioDataXid) {
    return await this.ordenEnvioPort.obtenerOrdenEnviosXid(ordenEnvioDataId);
  }

  async delOrdenEnvio(ordenEnvioDataId: OrdenEnvioDataXid) {
    return await this.ordenEnvioPort.delOrdenEnvio(ordenEnvioDataId);
  }

  async upOrdenEnvio(ordenEnvioDataId: OrdenEnvioDataConId) {
    return await this.ordenEnvioPort.actualizaOrdenEnvio(ordenEnvioDataId);
  }
  
}

const ordenEnvioService = new OrdenEnvioService(new OrdenEnvioAdapter());
export default OrdenEnvioService;
