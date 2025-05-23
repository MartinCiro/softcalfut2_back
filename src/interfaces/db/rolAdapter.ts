import RolesPort from 'core/roles/rolPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class RolesAdapter implements RolesPort {

  async crearRoles(rolData: {
    nombre: string;
    descripcion?: string;
    permisos: string[]; 
  }) {
    try {
      // Buscamos en la BD los permisos válidos
      const permisosEncontrados = await prisma.permiso.findMany({
        where: {
          nombre: {
            in: rolData.permisos
          }
        }
      });

      // Validación por si no se encontró ningún permiso válido
      if (permisosEncontrados.length === 0) {
        const permisoLectura = await prisma.permiso.findFirst({
          where: { nombre: "Lectura" }
        });

        if (!permisoLectura) {
          throw new ForbiddenException(
            "No se encontraron permisos válidos y tampoco existe el permiso 'Lectura'."
          );
        }

        permisosEncontrados.push(permisoLectura);
      }

      // Crear el nuevo rol
      const nuevoRol = await prisma.rol.create({
        data: {
          nombre: rolData.nombre,
          descripcion: rolData.descripcion
        }
      });

      // Asociar los permisos al rol
      await prisma.rolXPermiso.createMany({
        data: permisosEncontrados.map((permiso) => ({
          id_rol: nuevoRol.id,
          id_permiso: permiso.id
        })),
        skipDuplicates: true
      });

      return nuevoRol;
    } catch (error: any) {
      const validacion = validarExistente(error.code, error.meta?.target);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.data,
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
        data: error.data || "Ocurrió un error consultando el rol"
      };
    }
  }



  async obtenerRoles() {
    try {
      const roles = await prisma.rol.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          rolXPermiso: {
            select: {
              permiso: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      });

      if (!roles.length) throw new ForbiddenException("No se encontraron roles");


      return roles.map((rol: any) => {
        const permisosList = rol.rolXPermiso.map((rp: any) => rp.permiso.nombre);

        // Agrupamos por la parte antes de ":"
        const permisosAgrupados = permisosList.reduce((acc: any, permiso: string) => {
          const [clave, valor] = permiso.split(':');
          if (!acc[clave]) acc[clave] = [];
          acc[clave].push(valor);
          return acc;
        }, {});

        return {
          id: rol.id,
          nombre: rol.nombre,
          descripcion: rol.descripcion,
          permisos: permisosAgrupados
        };
      });
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el rol"
      };
    }
  }

  async obtenerRolesXid(rolData: { id: string | number }) {
    try {
      const rol = await prisma.rol.findUnique({
        where: { id: Number(rolData.id) },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          rolXPermiso: {
            select: {
              permiso: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      });

      if (!rol) throw new ForbiddenException("El rol solicitado no existe en la base de datos");
      return {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        permisos: rol.rolXPermiso.map((rp: { permiso: { nombre: any; }; }) => rp.permiso.nombre)
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el rol",
      };
    }
  }

  async delRol(rolData: { id: string }) {
    try {
      const rol = await prisma.rol.delete({
        where: { id: Number(rolData.id) },
      });

      return {
        ok: true,
        message: "Rol eliminado correctamente",
        rol: rol.id,
      };
    } catch (error: any) {
      validarNoExistente(error.code, "El rol solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el rol",
      };
    }
  }

  async actualizaRol(rolData: {
    nombre?: string;
    descripcion?: string;
    permisos?: (string | number)[];
    id: number | string;
  }) {
    try {
      const { id, permisos, ...updates } = rolData;

      // Verificar si el rol existe
      const rolExistente = await prisma.rol.findUnique({
        where: { id: Number(id) }
      });

      if (!rolExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "El rol solicitado no existe en la base de datos",
        }
      }

      // Eliminar permisos asociados al rol en RolXPermiso
      await prisma.rolXPermiso.deleteMany({
        where: { id_rol: Number(id) }
      });

      // Actualizar el rol con los nuevos datos
      if (updates) {
        await prisma.rol.update({
          where: { id: Number(id) },
          data: updates
        });
      }

      // Si hay permisos nuevos, insertarlos en RolXPermiso
      if (permisos && permisos.length > 0) {
        const nombresPermisos = permisos.filter(p => typeof p === "string") as string[];
        const idsPermisos = permisos.filter(p => typeof p === "number") as number[];

        const permisosEncontrados = await prisma.permiso.findMany({
          where: {
            OR: [
              ...(nombresPermisos.length ? [{ nombre: { in: nombresPermisos } }] : []),
              ...(idsPermisos.length ? [{ id: { in: idsPermisos } }] : []),
            ]
          }
        });

        if (permisosEncontrados.length > 0) {
          await prisma.rolXPermiso.createMany({
            data: permisosEncontrados.map(p => ({
              id_rol: Number(id),
              id_permiso: p.id
            })),
            skipDuplicates: true
          });
        }
      }

      return {
        ok: true,
        message: "Rol actualizado correctamente"
      };
    } catch (error: any) {
      const validacion = validarExistente(error.code, error.meta?.target);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.data,
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || error.data || "Ocurrió un error actualizando el rol",
      };
    }
  }
}