import { Injectable, Inject } from '@nestjs/common';
import UsuariosPort from './usuarioPort';

interface UsuarioData {
  username: string;
  nombres: string;
  apellidos: string;
  pass: string; 
  id_estado?: number | string; 
  id_rol: number | string; 
}

  
interface UsuarioDataXid {
  id: number | string;
}

type UsuarioDataUpdate = Partial<Omit<UsuarioData, 'id'>> & UsuarioDataXid;


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
