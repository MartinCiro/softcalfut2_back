import EstadoPort from './estadoPort';
import EstadoAdapter from '../../interfaces/db/estadoAdapter';


interface EstadoData {
  nombre: string;
  descripcion: string;
}

interface EstadoDataXid {
  id_estado: string | number;
}

interface EstadoDataConId extends Partial<EstadoData>, EstadoDataXid {}

class EstadoService {
  private estadoPort: EstadoPort;

  constructor(estadoPort: EstadoPort) {
    this.estadoPort = estadoPort;
  }

  // Lógica de negocio para crear un rol
  async crearEstados(estadoDat: EstadoData) {
    return await this.estadoPort.crearEstados(estadoDat);
  }

  async obtenerEstados() {
    return await this.estadoPort.obtenerEstados();
  }

  async obtenerEstadoXid(estadoDataId: EstadoDataXid) {
    return await this.estadoPort.obtenerEstadosXid(estadoDataId);
  }

  async delEstado(estadoDataId: EstadoDataXid) {
    return await this.estadoPort.delEstado(estadoDataId);
  }

  async upEstado(estadoDataId: EstadoDataConId) {
    return await this.estadoPort.actualizaEstado(estadoDataId);
  }
  
}

const estadoService = new EstadoService(new EstadoAdapter());
export default EstadoService;
