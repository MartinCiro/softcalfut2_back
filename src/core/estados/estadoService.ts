// src/core/estados/estadoService.ts
import EstadoPort from './estadoPort';
import EstadoAdapter from '../../interfaces/db/estadoAdapter';


interface EstadoData {
  nombre: string;
  descripcion: string;
}

interface EstadoDataXid {
  id_estado: string | number;
}

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

  async obtenerEstadoXid(EstadoDataId: EstadoDataXid) {
    return await this.estadoPort.obtenerEstadosXid(EstadoDataId);
  }

  async delEstado(EstadoDataId: EstadoDataXid) {
    return await this.estadoPort.delEstado(EstadoDataId);
  }
  
}

const estadoService = new EstadoService(new EstadoAdapter());
export default EstadoService;
