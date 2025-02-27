import { Injectable, Inject } from '@nestjs/common';
import UsuariosPort from './usuarioPort';

interface UsuarioData {
  nombres: string;
  email: string;
  pass: string; 
  estado?: number | string; 
  id_rol: number | string; 
}

interface UsuarioDataXid {
  email: string;
}

interface UsuarioDataUpdate extends Partial<UsuarioData> {}

@Injectable() 
export class UsuarioService {
  constructor(
    @Inject('UsuariosPort') private usuarioPort: UsuariosPort
  ) {}

  async obtenerUsuarios() {
    return await this.usuarioPort.obtenerUsuarios();
  }

  async crearUsuario(usuarioData: UsuarioData) {
    return await this.usuarioPort.crearUsuarios(usuarioData);
  }

  async obtenerUsuarioXid(usuarioData: UsuarioDataXid) {
    return await this.usuarioPort.obtenerUsuariosXid(usuarioData);
  }

  async upUsuario(usuarioData: UsuarioDataUpdate) {
    return await this.usuarioPort.actualizaUsuario(usuarioData);
  }

  async delUsuario(usuarioData: UsuarioDataXid) {
    return await this.usuarioPort.delUsuario(usuarioData);
  }
}
