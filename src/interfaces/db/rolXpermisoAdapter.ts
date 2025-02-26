import { PrismaClient } from '@prisma/client';
import RolxPermisosPort from '../../core/rolXpermisos/rolXpermisoPort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class RolxPermisosAdapter implements RolxPermisosPort {

  async crearRolxPermisos(rolXpermisoData: { id_rol: string | number; id_permiso: Array<string | number> }) {
    try {
      const { id_rol, id_permiso } = rolXpermisoData;

      await prisma.rolXPermiso.deleteMany({
        where: { id_rol: Number(id_rol) },
      });

      // Inserta nuevos permisos para el rol
      const nuevosPermisos = await prisma.rolXPermiso.createMany({
        data: id_permiso.map((permiso) => ({
          id_rol: Number(id_rol),
          id_permiso: Number(permiso),
        })),
        skipDuplicates: true,
      });

      return { ok: true, status_cod: 200, data: `Se insertaron ${nuevosPermisos.count} permisos` };

    } catch (error: any) {
      console.error("Error en crearRolxPermisos:", error);

      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error insertando en rolXpermiso",
      };
    }
  }

  async obtenerRolxPermisos() {
    try {
      const rolesConPermisos = await prisma.rol.findMany({
        select: {
          nombre: true,
          rolXPermiso: {
            select: {
              permiso: {
                select: { nombre: true }
              }
            }
          }
        }
      });

      // Formatear la respuesta para agrupar los permisos en una cadena
      const resultado = rolesConPermisos.map(rol => ({
        nombre_rol: rol.nombre,
        permisos: rol.rolXPermiso.map(rp => rp.permiso.nombre).join(', ')
      }));

      if (resultado.length > 0) {
        return resultado;
      } else {
        throw { data: "No se encontraron datos" };
      }
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.message || "Ocurrió un error consultando el rolXpermiso",
      };
    }
  }


  async obtenerRolxPermisosXid(rolXpermisoDataXid: { id_rol: string | number }) {
    try {
      const rolConPermisos = await prisma.rol.findUnique({
        where: { id: Number(rolXpermisoDataXid.id_rol) },
        select: {
          nombre: true,
          rolXPermiso: {
            select: {
              permiso: {
                select: { nombre: true }
              }
            }
          }
        }
      });

      if (!rolConPermisos || rolConPermisos.rolXPermiso.length === 0) {
        throw {
          ok: false,
          status_cod: 409,
          data: "Este rol no tiene permisos asignados"
        };
      }

      return {
        nombre_rol: rolConPermisos.nombre,
        permisos: rolConPermisos.rolXPermiso.map(rp => rp.permiso.nombre).join(', ')
      };

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.message || "Ocurrió un error consultando el rolXpermiso",
      };
    }
  }

}

export default RolxPermisosAdapter;
