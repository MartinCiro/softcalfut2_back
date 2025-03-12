import UsuariosPort from '../../core/usuarios/usuarioPort';
import { Usuario } from '../../core/auth/entities/Usuario';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from '../api/utils/validaciones';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class UsuariosAdapter implements UsuariosPort {

  async crearUsuarios(usuarioData: { username: string; nombres: string; apellidos: string; pass: string; id_estado?: number | string; id_rol: number | string; id: number | string; }) {
    try {
      const estado = await prisma.estado.findUnique({
        where: { nombre: 'activo' },
        select: { id: true }
      });

      if (!estado) {
        throw {
          ok: false,
          status_cod: 409,
          data: "No se encontró el estado 'activo'"
        };
      }

      const user = new Usuario(usuarioData.username, usuarioData.pass);

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          username: usuarioData.username,
          nombres: usuarioData.nombres,
          apellidos: usuarioData.apellidos,
          pass: user.getEncryptedPassword(),
          id_estado: estado.id,
          id_rol: Number(usuarioData.id_rol)
        },
        select: { id: true }
      });

      return nuevoUsuario;
    } catch (error: any) {
      const validacion = validarExistente(error.code, usuarioData.username);
      if (!validacion.ok) {
        throw {
          ok: false,
          status_cod: 409,
          data: validacion.data
        };
      }

      const resultado = error.meta?.target?.[0] || "valor";
      const valNoExistente = validarNoExistente(error.code, `El ${resultado} asignado`);

      if (!valNoExistente.ok) {
        throw {
          ok: false,
          status_cod: 409,
          data: valNoExistente.data
        };
      }

      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error consultando el usuario"
      };
    }
  }

  async obtenerUsuarios() {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nombres: true,
          estado: {
            select: { nombre: true }
          },
          rol: {
            select: {
              nombre: true
            }
          }
        }
      });

      if (!usuarios.length) {
        throw {
          ok: false,
          status_cod: 404,
          data: "No se encontraron datos"
        };
      }

      return usuarios.map((usuario: { id: any; nombres: any; estado: { nombre: any; }; rol: { nombre: any; }; }) => ({
        id: usuario.id,
        nombres: usuario.nombres,
        estado_usuario: usuario.estado.nombre,
        rol: usuario.rol.nombre
      }));
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el usuario"
      };
    }
  }

  async obtenerUsuariosXid(usuarioData: { id: string | number; }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioData.id) },
        select: {
          id: true,
          nombres: true,
          estado: {
            select: { nombre: true }
          },
          rol: {
            select: { nombre: true }
          }
        }
      });

      if (!usuario) {
        throw {
          ok: false,
          status_cod: 409,
          data: "El usuario solicitado no existe en la base de datos",
        };
      }

      return {
        id: usuario.id,
        nombres: usuario.nombres,
        estado_usuario: usuario.estado.nombre,
        rol: usuario.rol.nombre
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el usuario",
      };
    }
  }

  async delUsuario(usuarioData: { id: string }) {
    try {
      const usuario = await prisma.usuario.delete({
        where: { id: Number(usuarioData.id) },
      });

      return {
        ok: true,
        message: "Usuario eliminado correctamente",
        usuario: usuario.id,
      };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw {
          ok: false,
          status_cod: 409,
          data: "El usuario solicitado no existe en la base de datos",
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el usuario",
      };
    }
  }


  async actualizaUsuario(usuarioData: {
    nombres?: string;
    apellidos?: string;
    id_estado?: number | string;
    id_rol?: number | string;
    id: number | string;
  }) {
    try {
      const { id, id_estado, id_rol, ...updates } = usuarioData;
  
      const usuarioActualizado = await prisma.usuario.update({
        where: { id: Number(id) }, 
        data: {
          ...updates,
          id_estado: id_estado !== undefined ? Number(id_estado) : undefined,
          id_rol: id_rol !== undefined ? Number(id_rol) : undefined,
        },
      });
  
      return {
        ok: true,
        message: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
      };
    } catch (error: any) {
      validarExistente(error.code, "El usuario solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error actualizando el usuario",
      };
    }
  }
  
}

