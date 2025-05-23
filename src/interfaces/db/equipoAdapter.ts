import EquiposPort from 'core/equipos/equipoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class EquiposAdapter implements EquiposPort {
  constructor(private readonly redisService: RedisService) { }

  async crearEquipos(equipoData: { nom_equipo: string; encargado: string; jugadores?: (number | string)[] }) {
    try {
      const { nom_equipo, encargado, jugadores } = equipoData;

      // Crear el nuevo equipo
      const nuevoEquipo = await prisma.equipo.create({
        data: {
          nom_equipo,
          documento: encargado.toString()
        }
      });

      const id_equipo = nuevoEquipo.id;

      let relaciones: { id_equipo: number; documento_user: string }[] = [];

      // Si se envió la lista de jugadores
      if (jugadores && jugadores.length > 0) {
        const documentosStr = jugadores.map(doc => doc.toString());

        // Verificar jugadores existentes
        const usuariosExistentes = await prisma.usuario.findMany({
          where: { documento: { in: documentosStr } },
          select: { documento: true }
        });

        const documentosValidos = usuariosExistentes.map(u => u.documento);
        const documentosInexistentes = documentosStr.filter(doc => !documentosValidos.includes(doc));

        if (documentosInexistentes.length > 0) {
          throw {
            ok: false,
            status_cod: 404,
            data: `Los siguientes documentos no están registrados: ${documentosInexistentes.join(", ")}`
          };
        }

        // Crear relaciones
        relaciones = documentosValidos.map(doc => ({
          id_equipo,
          documento_user: doc
        }));

        await prisma.usuarioXEquipo.createMany({
          data: relaciones,
          skipDuplicates: true
        });
      }

      // Limpiar caché
      await this.redisService.delete('equipos:lista');

      return {
        ok: true,
        status_cod: 201,
        data: `Equipo "${nom_equipo}" creado con ${relaciones.length} jugadores asignados.`
      };

    } catch (error: any) {
      // Validaciones específicas si necesitas
      console.log(error);
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
        status_cod: error.status_cod || 500,
        data: error.data || 'Ocurrió un error creando el equipo.'
      };
    }
  }

  async obtenerEquipos() {
    try {
      const cacheKey = 'equipos:lista';
      const equiposCache = await this.redisService.get(cacheKey);

      //if (equiposCache) return JSON.parse(equiposCache);

      const equipos = await prisma.equipo.findMany({
        select: {
          id: true,
          nom_equipo: true,
          documento: true,
          usuario: { // Datos del representante
            select: {
              documento: true,
              nombres: true,
              apellido: true,
              estado: {
                select: {
                  nombre: true
                }
              }
            }
          },
          usuariosxEquipo: { // Jugadores del equipo
            select: {
              usuario: {
                select: {
                  documento: true,
                  nombres: true,
                  apellido: true,
                  estado: {
                    select: {
                      nombre: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!equipos.length) throw new ForbiddenException("No se ha encontrado ningún equipo");

      const equiposParseados = equipos.map(equipo => ({
        id: equipo.id,
        nom_equipo: equipo.nom_equipo,
        representante: {
          documento: equipo.usuario?.documento || equipo.documento,
          nombres: `${equipo.usuario?.nombres} ${equipo.usuario?.apellido}`,
          estado: equipo.usuario?.estado?.nombre || "Desconocido"
        },
        jugadores: equipo.usuariosxEquipo.map(rel => ({
          documento: rel.usuario.documento,
          nombres: `${rel.usuario.nombres} ${rel.usuario.apellido}`,
          estado: rel.usuario.estado?.nombre || "Desconocido"
        }))
      }));

      await this.redisService.set(cacheKey, JSON.stringify(equiposParseados));
      return equiposParseados;
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el equipo"
      };
    }
  }

  async actualizaEquipo(equipoData: {
    id: number | string;
    nom_equipo?: string;
    encargado?: string;
    jugadores?: (number | string)[];
  }) {
    try {
      const { id, nom_equipo, encargado, jugadores } = equipoData;
      const equipoId = Number(id);

      // Verificar si el equipo existe
      const equipoExistente = await prisma.equipo.findUnique({
        where: { id: equipoId }
      });

      if (!equipoExistente) {
        throw {
          ok: false,
          status_cod: 404,
          message: "El equipo solicitado no existe en la base de datos.",
        };
      }

      // Construir objeto de actualización
      const updates: any = {};
      if (nom_equipo !== undefined) updates.nom_equipo = nom_equipo;
      if (encargado !== undefined) updates.documento = encargado.toString();

      let equipoActualizado = equipoExistente;

      if (Object.keys(updates).length > 0) {
        equipoActualizado = await prisma.equipo.update({
          where: { id: equipoId },
          data: updates
        });
      }

      // Actualizar jugadores si se enviaron
      if (jugadores !== undefined) {
        const documentosStr = jugadores.map(j => j.toString());
        const usuariosExistentes = await prisma.usuario.findMany({
          where: { documento: { in: documentosStr } },
          select: { documento: true }
        });

        const documentosValidos = usuariosExistentes.map(u => u.documento);
        const documentosInexistentes = documentosStr.filter(d => !documentosValidos.includes(d));

        if (documentosInexistentes.length > 0) {
          throw {
            ok: false,
            status_cod: 404,
            data: `Los siguientes documentos no están registrados: ${documentosInexistentes.join(", ")}`
          };
        }

        await prisma.usuarioXEquipo.deleteMany({
          where: { id_equipo: equipoId }
        });

        const nuevasRelaciones = documentosValidos.map(doc => ({
          id_equipo: equipoId,
          documento_user: doc
        }));

        await prisma.usuarioXEquipo.createMany({
          data: nuevasRelaciones,
          skipDuplicates: true
        });
      }

      // Limpiar caché individual
      await this.redisService.delete(`equipo:${id}`);

      // Actualizar caché de lista si existe
      const equiposCache = await this.redisService.get('equipos:lista');
      if (equiposCache) {
        let equipos = JSON.parse(equiposCache);
        equipos = equipos.map((e: any) =>
          e.id === equipoId
            ? {
              ...e,
              ...(nom_equipo !== undefined && { nom_equipo }),
              ...(encargado !== undefined && { documento: encargado.toString() })
            }
            : e
        );
        await this.redisService.set('equipos:lista', JSON.stringify(equipos), 3600);
      }

      return {
        ok: true,
        message: "Equipo actualizado correctamente",
        equipo: equipoActualizado
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 500,
        data: error.message || error.data || "Ocurrió un error actualizando el equipo",
      };
    }
  }
}

