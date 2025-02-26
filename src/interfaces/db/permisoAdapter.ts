import { PrismaClient } from '@prisma/client';
import PermisosPort from '../../core/permisos/permisoPort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class PermisosAdapter implements PermisosPort {

  // Implementación del método para crear un permiso
  async crearPermisos(permisoData: { nombre: string; descripcion: string }) {
    try {
        // Crear el permiso en la base de datos
        await prisma.permiso.create({
            data: {
                nombre: permisoData.nombre,
                descripcion: permisoData.descripcion,
            },
        });

        return { ok: true, status_cod: 200, data: "Creado con éxito" };
    } catch (error: any) {
        if (error.code === "P2002") {
            // P2002 ocurre cuando hay una violación de restricción UNIQUE
            throw {
                ok: false,
                status_cod: 409,
                data: `El permiso '${permisoData.nombre}' ya existe`,
            };
        }

        throw {
            ok: false,
            status_cod: 400,
            data: error.message || "Ocurrió un error creando el permiso",
        };
    }
}

  
async obtenerPermisos() {
  try {
      const permisos = await prisma.permiso.findMany({
          select: {
              id: true,
              nombre: true,
              descripcion: true,
          },
      });

      if (permisos.length === 0) {
          throw {
              ok: false,
              status_cod: 404,
              data: "No se encontraron permisos",
          };
      }

      return permisos;
  } catch (error: any) {
      throw {
          ok: false,
          status_cod: 400,
          data: error.message || "Ocurrió un error consultando los permisos",
      };
  }
}


async obtenerPermisosXid(permisoDataXid: { id_permiso: string | number }) {
  try {
      const permiso = await prisma.permiso.findUnique({
          where: { id: Number(permisoDataXid.id_permiso) },
          select: {
              id: true,
              nombre: true,
              descripcion: true,
          },
      });

      if (!permiso) {
          throw {
              ok: false,
              status_cod: 404,
              data: "El permiso solicitado no existe en BD",
          };
      }

      return permiso;
  } catch (error: any) {
      throw {
          ok: false,
          status_cod: 400,
          data: error.message || "Ocurrió un error consultando el permiso",
      };
  }
}


async delPermiso(permisoDataXid: { id_permiso: string | number }) {
  try {
      const permisoEliminado = await prisma.permiso.delete({
          where: { id: Number(permisoDataXid.id_permiso) },
      });

      return { ok: true, status_cod: 200, data: "Permiso eliminado con éxito" };
  } catch (error: any) {
      if (error.code === "P2025") {
          // Prisma lanza P2025 si no encuentra el registro a eliminar
          throw {
              ok: false,
              status_cod: 409,
              data: "El permiso solicitado no existe en BD",
          };
      }
      throw {
          ok: false,
          status_cod: 400,
          data: error.message || "Ocurrió un error eliminando el permiso",
      };
  }
}


  
async actualizaPermiso(permisoDataXid: { id_permiso: string | number; nombre?: string; descripcion?: string }) {
  try {
      // Verifica si hay datos a actualizar
      const { id_permiso, nombre, descripcion } = permisoDataXid;
      
      const permisoActualizado = await prisma.permiso.update({
          where: { id: Number(id_permiso) },
          data: {
              ...(nombre && { nombre }),
              ...(descripcion && { descripcion }),
          },
      });

      return { ok: true, status_cod: 200, data: permisoActualizado };
  } catch (error: any) {
      if (error.code === "P2025") {
          // Prisma lanza P2025 si no encuentra el registro a actualizar
          throw {
              ok: false,
              status_cod: 409,
              data: "El permiso solicitado no existe en BD",
          };
      }
      throw {
          ok: false,
          status_cod: 400,
          data: error.message || "Ocurrió un error actualizando el permiso",
      };
  }
}

  
}

export default PermisosAdapter;
