import { Injectable, Inject } from '@nestjs/common';
import UsuariosPort from './usuarioPort';

interface UsuarioData {
  nombres: string;
  passwd: string; 
  id_rol?: number | string; 
  apellido: string;
  numero_documento: string;
  email: string;
  estado_id?: number | string; 
  info_perfil?: string;
  nom_user: string;
  numero_contacto?: string;
  fecha_nacimiento: string | Date;
}

type UsuarioDataXid = Pick<UsuarioData, 'numero_documento'>;

type UsuarioDataUpdate = Partial<Omit<UsuarioData, 'numero_documento'>> & UsuarioDataXid;


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
