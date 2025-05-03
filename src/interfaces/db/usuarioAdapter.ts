import UsuariosPort from 'core/usuarios/usuarioPort';
import { Usuario } from 'core/auth/entities/Usuario';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class UsuariosAdapter implements UsuariosPort {

  async crearUsuarios(usuarioData: {
    documento: string; 
    nombres: string; 
    apellido: string; 
    email: string; 
    info_perfil?: string; 
    num_contacto?: string; 
    nom_user: string; 
    fecha_nacimiento: string; 
    pass: string; 
    id_rol?: number | string;
  }) {
    try {
      let fechaId: number | undefined;

      const fechaExistente = await prisma.fecha.findUnique({
        where: { fecha: usuarioData.fecha_nacimiento },
        select: { id: true }
      });

      if (fechaExistente) {
        fechaId = fechaExistente.id;
      } else {
        const nuevaFecha = await prisma.fecha.create({
          data: { fecha: usuarioData.fecha_nacimiento },
          select: { id: true }
        });
        fechaId = nuevaFecha.id;
      }

      // Buscar el estado 'activo'
      const estado = await prisma.estado.findUnique({
        where: { nombre: 'activo' },
        select: { id: true }
      });

      if (!estado) throw new ForbiddenException("No se encontró el estado 'activo', por favor contacte al administrador");
      
      
      let idRol: number;

      if (usuarioData.id_rol) {
        // Convertir a número si viene como string
        const idRolNum = Number(usuarioData.id_rol);
        const rolExiste = await prisma.rol.findUnique({
          where: { id: idRolNum },
          select: { id: true }
        });

        if (!rolExiste) throw new ForbiddenException(`El rol con ID ${idRolNum} no existe`);

        idRol = idRolNum;
      } else {
        // Si no se proporciona id_rol, buscar el rol 'Invitado'
        const rolInvitado = await prisma.rol.findUnique({
          where: { nombre: 'Invitado' },
          select: { id: true }
        });

        if (!rolInvitado) throw new ForbiddenException("No se encontró el rol 'Invitado', por favor contacte al administrador");

        idRol = rolInvitado.id;
      }

      // Crear el usuario con contraseña encriptada
      const user = new Usuario(usuarioData.documento, usuarioData.pass);
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          documento: usuarioData.documento,
          nombres: usuarioData.nombres,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          info_perfil: usuarioData.info_perfil,
          num_contacto: usuarioData.num_contacto,
          nom_user: usuarioData.nom_user,
          id_fecha_nacimiento: fechaId, 
          pass: user.getEncryptedPassword(),
          estado_id: estado.id,
          id_rol: idRol
        },
        select: { documento: true }
      });

      return nuevoUsuario;
    } catch (error: any) {
      const validacion = validarExistente(error.code, usuarioData.documento);
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
        data: error.data || "Ocurrió un error consultando el usuario"
      };
    }
  }

  async obtenerUsuarios() {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
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

      return usuarios.map((usuario: { nombres: any; estado: { nombre: any; }; rol: { nombre: any; }; }) => ({
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

  async obtenerUsuariosXid(usuarioData: { documento: string | number; }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { documento: usuarioData.documento.toString() },
        select: {
          documento: true,
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
        id: usuario.documento,
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

  async delUsuario(usuarioData: { documento: string }) {
    try {
      const usuario = await prisma.usuario.delete({
        where: { documento: usuarioData.documento.toString() },
      });

      return {
        ok: true,
        message: "Usuario eliminado correctamente",
        usuario: usuario.documento,
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
    apellido?: string;
    estado_id?: number | string;
    id_rol?: number | string;
    documento: number | string;
  }) {
    try {
      const { documento, estado_id, id_rol, ...updates } = usuarioData;

      const usuarioActualizado = await prisma.usuario.update({
        where: { documento: documento.toString() },
        data: {
          ...updates,
          estado_id: estado_id !== undefined ? Number(estado_id) : undefined,
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

