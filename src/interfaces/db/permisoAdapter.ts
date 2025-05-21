import PermisosPort from 'core/permisos/permisoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente, capitalize } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class PermisosAdapter implements PermisosPort {

  async crearPermisos(permisoData: { permisos: string[]; descripcion?: string }) {
    const { permisos, descripcion } = permisoData;

    try {
      const permisosCreados = [];

      for (const nombre of permisos) {
        try {
          const nuevoPermiso = await prisma.permiso.create({
            data: {
              nombre,
              descripcion,
            },
          });
          permisosCreados.push(nuevoPermiso);
        } catch (error: any) {
          const validacion = validarExistente(error.code, nombre);
          if (!validacion.ok) {
            throw {
              ok: false,
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
              data: valNoExistente.data,
            };
          }

          throw {
            ok: false,
            status_cod: 400,
            data: error.message || "Ocurrió un error creando un permiso",
          };
        }
      }

      return {
        ok: true,
        message: "Permisos creados correctamente",
        permisos: permisosCreados,
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Error inesperado creando permisos",
      };
    }
  }

  async obtenerPermisos() {
    try {
      const permisos = await prisma.permiso.findMany({
        select: {
          id: true,
          nombre: true,        // Ejemplo: "anuncios:crear"
          descripcion: true    // Ejemplo: "Permiso para anuncios"
        }
      });

      if (!permisos.length) {
        throw new ForbiddenException("No se encontró ningún permiso");
      }

      const agrupados: Record<string, { descripcion: string, acciones: Set<string> }> = {};

      for (const permiso of permisos) {
        const [entidad, accionRaw] = permiso.nombre.split(':');
        const accion = capitalize(accionRaw);

        if (!agrupados[entidad]) {
          agrupados[entidad] = {
            descripcion: permiso.descripcion ?? "",
            acciones: new Set([accion])
          };
        } else {
          agrupados[entidad].acciones.add(accion);
        }
      }

      // Convertir a array con el formato deseado
      const resultado = Object.entries(agrupados).map(([entidad, { descripcion, acciones }]) => ({
        descripcion,
        [entidad]: Array.from(acciones)
      }));

      return resultado;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando los permisos"
      };
    }
  }

  async actualizaPermisos(permisoData: { descripcion?: string; permisos: string[] }) {
  const { descripcion, permisos } = permisoData;

  try {
    // 1. Obtener el prefijo (nombre de la entidad, ej: "cedula")
    const entidad = permisos[0]?.split(":")[0];
    if (!entidad) throw new Error("Nombre de permiso no válido");

    // 2. Obtener todos los permisos actuales de esa entidad
    const permisosExistentes = await prisma.permiso.findMany({
      where: {
        nombre: {
          startsWith: `${entidad}:`
        }
      }
    });

    // 3. Extraer nombres actuales y los que deben eliminarse
    const nombresActuales = permisosExistentes.map(p => p.nombre);
    const permisosAEliminar = nombresActuales.filter(nombre => !permisos.includes(nombre));

    // 4. Eliminar los permisos que ya no están
    await Promise.all(
      permisosAEliminar.map(nombre =>
        prisma.permiso.delete({ where: { nombre } })
      )
    );

    // 5. Actualizar los permisos que se mantienen (no crear nuevos)
    await Promise.all(
      permisos.map(async (nombre) => {
        return await prisma.permiso.update({
          where: { nombre },
          data: { descripcion }
        });
      })
    );

    return {
      ok: true,
      message: `Los permisos de ${entidad} han sido actualizados`,
    };
  } catch (error: any) {
    validarExistente(error.code, "Alguno de los permisos solicitados");
    throw {
      ok: false,
      status_cod: 400,
      data: error.message || "Ocurrió un error actualizando los permisos",
    };
  }
}

}

