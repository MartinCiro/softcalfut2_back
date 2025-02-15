import UsuariosPort from './usuarioPort';
import UsuariosAdapter from '../../interfaces/db/usuarioAdapter';


interface UsuarioData {
  documento: number | string; 
  nombres: string; 
  apellido: string; 
  email: string; 
  info_perfil?: string; 
  num_contacto: string; 
  pass: string; 
  estado: number | string; 
  id_rol: number | string; 
  fecha_nacimiento: Date;
}

interface UsuarioDataXid {
  documento: number | string;
}

class UsuarioService {
  private usuarioPort: UsuariosPort;

  constructor(usuarioPort: UsuariosPort) {
    this.usuarioPort = usuarioPort;
  }

  // Lógica de negocio para crear un rol
  async crearUsuarios(usuarioData: UsuarioData) {
    return await this.usuarioPort.crearUsuarios(usuarioData);
  }

  async obtenerUsuarios() {
    return await this.usuarioPort.obtenerUsuarios();
  }

  async obtenerUsuarioXid(usuarioData: UsuarioDataXid) {
    return await this.usuarioPort.obtenerUsuariosXid(usuarioData);
  }

  async delUsuario(usuarioData: UsuarioDataXid) {
    return await this.usuarioPort.delUsuario(usuarioData);
  }

  async upUsuario(usuarioData: UsuarioData) {
    return await this.usuarioPort.actualizaUsuario(usuarioData);
  }
  
}

const usuarioService = new UsuarioService(new UsuariosAdapter());
export default UsuarioService;
