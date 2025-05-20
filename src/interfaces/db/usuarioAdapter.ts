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
  }) {
    try {
      const fechaNacimiento = new Date(usuarioData.fecha_nacimiento);
      const fechaRegistro = new Date();
  
      // Obtener o crear la fecha de nacimiento
      const fechaNacimientoId = await prisma.fecha.upsert({
        where: { fecha: fechaNacimiento },
        update: {},
        create: { fecha: fechaNacimiento },
        select: { id: true }
      });
  
      // Obtener o crear la fecha de registro
      const fechaRegistroId = await prisma.fecha.upsert({
        where: { fecha: fechaRegistro },
        update: {},
        create: { fecha: fechaRegistro },
        select: { id: true }
      });
  
      // Obtener o crear estado "Activo"
      const estado = await prisma.estado.upsert({
        where: { nombre: 'Activo' },
        update: {},
        create: { nombre: 'Activo' },
        select: { id: true }
      });
  
      // Determinar o crear el rol
      let idRol: number;
      if (usuarioData.id_rol) {
        const rol = await prisma.rol.findUnique({
          where: { id: Number(usuarioData.id_rol) },
          select: { id: true }
        });
  
        if (!rol) throw new ForbiddenException(`El rol con ID ${usuarioData.id_rol} no existe`);
        idRol = rol.id;
      } else {
        // Rol invitado
        const rolInvitado = await prisma.rol.upsert({
          where: { nombre: 'Invitado' },
          update: {},
          create: { nombre: 'Invitado' },
          select: { id: true }
        });
  
        const permisoLee = await prisma.permiso.upsert({
          where: { nombre: 'anuncios:Lee' },
          update: {},
          create: {
            nombre: 'anuncios:Lee',
            descripcion: 'Permiso de solo lectura en anuncios'
          },
          select: { id: true }
        });
  
        // Verificar si la relación ya existe
        const existeRelacion = await prisma.rolXPermiso.findUnique({
          where: {
            id_rol_id_permiso: {
              id_rol: rolInvitado.id,
              id_permiso: permisoLee.id
            }
          }
        });
  
        if (!existeRelacion) {
          await prisma.rolXPermiso.create({
            data: {
              id_rol: rolInvitado.id,
              id_permiso: permisoLee.id
            }
          });
        }
  
        idRol = rolInvitado.id;
      }
  
      // Encriptar la contraseña
      const user = new Usuario(usuarioData.numero_documento, usuarioData.passwd);
  
      // Crear el usuario
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          documento: usuarioData.numero_documento,
          nombres: usuarioData.nombres,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          info_perfil: usuarioData.info_perfil,
          num_contacto: usuarioData.numero_contacto,
          nom_user: usuarioData.nom_user,
          id_fecha_nacimiento: fechaNacimientoId.id,
          id_fecha_registro: fechaRegistroId.id,
          pass: user.getEncryptedPassword(),
          estado_id: estado.id,
          id_rol: idRol
        },
        select: { documento: true }
      });
  
      return nuevoUsuario;
    } catch (error: any) {
      const validacion = validarExistente(error.code, usuarioData.numero_documento);
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
        data: error.data || "Ocurrió un error creando el usuario"
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

  async obtenerUsuariosXid(usuarioData: { numero_documento: string | number; }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { documento: usuarioData.numero_documento.toString() },
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

  async delUsuario(usuarioData: { numero_documento: string }) {
    try {
      const usuario = await prisma.usuario.delete({
        where: { documento: usuarioData.numero_documento.toString() },
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
    numero_documento: number | string;
  }) {
    try {
      const { numero_documento, estado_id, id_rol, ...updates } = usuarioData;

      const usuarioActualizado = await prisma.usuario.update({
        where: { documento: numero_documento.toString() },
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

