import { PrismaClient } from '@prisma/client';
import RolePort from '../../core/roles/rolePort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class RoleAdapter implements RolePort {

  async crearRol(rolData: { nombre: string; descripcion: string }) {
    try {
      const rol = await prisma.rol.create({
        data: {
          nombre: rolData.nombre,
          descripcion: rolData.descripcion
        },
        select: {
          id: true
        }
      });

      return rol;
    } catch (error: any) {
      const validacion = validarExistente(error.code, rolData.nombre);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.data
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error creando el rol"
      };
    }
  }

  async obtenerRol() {
    try {
      const roles = await prisma.rol.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      });

      if (!roles || roles.length === 0) {
        throw {
          ok: false,
          status_cod: 404,
          data: "No se encontraron datos"
        };
      }

      return roles;
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando los roles"
      };
    }
  }


  async obtenerRolXid(rolDataXid: { id_rol: string | number }) {
    try {
      const rol = await prisma.rol.findUnique({
        where: { id: Number(rolDataXid.id_rol) },
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      });

      if (!rol) {
        throw {
          ok: false,
          status_cod: 409,
          data: "El rol solicitado no existe en la BD"
        };
      }

      return rol;
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el rol"
      };
    }
  }

  async delRol(rolDataXid: { id_rol: string | number }) {
    try {
      const deletedRol = await prisma.rol.delete({
        where: { id: Number(rolDataXid.id_rol) }
      });

      return {
        ok: true,
        status_cod: 200,
        data: "Rol eliminado correctamente"
      };
    } catch (error: any) {
      if (error.code === "P2025") {
        // Prisma devuelve este código si no encuentra el registro
        throw {
          ok: false,
          status_cod: 409,
          data: "El rol solicitado no existe en la BD"
        };
      }

      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el rol"
      };
    }
  }



  async actualizaRol(rolDataXid: { id_rol: string | number; nombre?: string; descripcion?: string }) {
    try {
      const { id_rol, nombre, descripcion } = rolDataXid;

      // Verificar si hay datos para actualizar
      const datosActualizar: Record<string, any> = {};
      if (nombre !== undefined) datosActualizar.nombre = nombre;
      if (descripcion !== undefined) datosActualizar.descripcion = descripcion;

      // Actualizar el rol en la base de datos
      const rolActualizado = await prisma.rol.update({
        where: { id: Number(id_rol) },
        data: datosActualizar,
      });

      return {
        ok: true,
        status_cod: 200,
        data: rolActualizado,
      };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw {
          ok: false,
          status_cod: 409,
          data: "El rol solicitado no existe en la BD",
        };
      }

      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error actualizando el rol",
      };
    }
  }


}

export default RoleAdapter;
