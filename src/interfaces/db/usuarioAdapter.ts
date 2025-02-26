// src/interfaces/db/usuarioAdapter.ts
import UsuariosPort from '../../core/usuarios/usuarioPort';
import { Usuario } from '../../core/auth/entities/Usuario';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class UsuariosAdapter implements UsuariosPort {

  // Implementación del método para crear un usuario
  async crearUsuarios(usuarioData: { nombres: string; email: string; pass: string; id_rol: number | string }) {
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

      const user = new Usuario(usuarioData.email, usuarioData.pass);

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre: usuarioData.nombres,
          email: usuarioData.email,
          passwd: user.getEncryptedPassword(),
          id_estado: estado.id,
          id_rol: Number(usuarioData.id_rol)
        },
        select: { email: true }
      });

      return nuevoUsuario;
    } catch (error: any) {
      const validacion = validarExistente(error.code, usuarioData.email);
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
          email: true,
          nombre: true,
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

      return usuarios.map(usuario => ({
        email: usuario.email,
        nombres: usuario.nombre,
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

  async obtenerUsuariosXid(usuarioData: { email: string }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: usuarioData.email },
        select: {
          email: true,
          nombre: true,
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
        email: usuario.email,
        nombre: usuario.nombre,
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

  async delUsuario(usuarioData: { email: string }) {
    try {
      const usuario = await prisma.usuario.delete({
        where: { email: usuarioData.email },
      });

      return {
        ok: true,
        message: "Usuario eliminado correctamente",
        usuario: usuario.email,
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
    email: string; 
    nombre?: string; 
    passwd?: string; 
    id_estado?: number; 
    id_rol?: number; 
  }) {
    try {
      const { email, ...updates } = usuarioData;
  
      const usuarioActualizado = await prisma.usuario.update({
        where: { email },
        data: updates,
      });
  
      return {
        ok: true,
        message: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
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
        data: error.message || "Ocurrió un error actualizando el usuario",
      };
    }
  }
}

export default UsuariosAdapter;
