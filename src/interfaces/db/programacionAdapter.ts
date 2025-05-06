import ProgramacionesPort from 'core/programaciones/programacionPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class ProgramacionesAdapter implements ProgramacionesPort {
  constructor(private readonly redisService: RedisService) { }

  async crearProgramaciones(programacionData: {
    nombreCompetencia: string;
    lugarEncuentro: string;
    fechaEncuentro: string;
    equipoLocal: number;
    equipoVisitante: number;
    categoriaEncuentro: number;
    rama: string;
  }) {
    try {

      let fechaEncuentro = await prisma.fecha.findFirst({
        where: { fecha: programacionData.fechaEncuentro },
        select: { id: true }
      })

      if (!fechaEncuentro) {
        fechaEncuentro = await prisma.fecha.create({
          data: {
            fecha: programacionData.fechaEncuentro
          }, select: { id: true }
        });
      }

      const verifiexiste = await prisma.programacion.findFirst({                                                                                             
        where: {
          nombre_competencia: programacionData.nombreCompetencia,
          lugar_encuentro: programacionData.lugarEncuentro,
          fecha_encuentro: fechaEncuentro?.id,
          id_equipo_local: programacionData.equipoLocal,
          id_equipo_visitante: programacionData.equipoVisitante,
          categoria_encuentro: programacionData.categoriaEncuentro,
          rama: programacionData.rama
        }
      })

      if (verifiexiste) throw { ok: false, status_cod: 409, data: `La programación ya existe` };

      const nuevaProgramacion = await prisma.programacion.create({
        data: {
          nombre_competencia: programacionData.nombreCompetencia,
          lugar_encuentro: programacionData.lugarEncuentro,
          fecha_encuentro: fechaEncuentro?.id,
          id_equipo_local: programacionData.equipoLocal,
          id_equipo_visitante: programacionData.equipoVisitante,
          categoria_encuentro: programacionData.categoriaEncuentro,
          rama: programacionData.rama
        }
      });

      await this.redisService.delete('programaciones:lista');

      return nuevaProgramacion;
    } catch (error: any) {
      const validacion = validarExistente(error.code, programacionData.nombre);
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
        data: error.data || "Ocurrió un error consultando el programacion"
      };
    }
  }

  async obtenerProgramaciones() {
    try {
      const cacheKey = 'programaciones:lista';
      const programacionesCache = await this.redisService.get(cacheKey);

      if (programacionesCache) return JSON.parse(programacionesCache);

      const programaciones = await prisma.programacion.findMany({
        select: {
          id: true,
          nombre_programacion: true
        }
      });

      if (!programaciones.length) throw new ForbiddenException("No se ha encontrado ninguna programacion");

      await this.redisService.set(cacheKey, JSON.stringify(programaciones));
      return programaciones;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el programacion"
      };
    }
  }

  async obtenerProgramacionesXid(programacionData: { id: string | number }) {
    try {
      const cacheKey = `programacion:${programacionData.id}`;
      const programacionCache = await this.redisService.get(cacheKey);

      if (programacionCache) return JSON.parse(programacionCache);

      const programacion = await prisma.programacion.findUnique({
        where: { id: Number(programacionData.id) },
        select: {
          id: true,
          nombre_programacion: true
        }
      });
      if (!programacion) throw new ForbiddenException("La categoría solicitada no existe en la base de datos");
      const programacion_id = {
        id: programacion.id,
        nombre_programacion: programacion.nombre_programacion
      }

      await this.redisService.set(cacheKey, JSON.stringify(programacion_id));
      return programacion_id;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el programacion",
      };
    }
  }

  async delProgramacion(programacionData: { id: string }) {
    try {
      const id = Number(programacionData.id);

      // Eliminar de la base de datos primero
      const programacion = await prisma.programacion.delete({
        where: { id },
      });

      // Borrar caché específica por ID
      await this.redisService.delete(`programacion:${id}`);

      // Actualizar la lista cacheada
      const programacionesCache = await this.redisService.get('programaciones:lista');
      if (programacionesCache) {
        const programaciones = JSON.parse(programacionesCache).filter((e: any) => e.id !== id);
        await this.redisService.set('programaciones:lista', JSON.stringify(programaciones), 3600); // TTL de 1 hora
      }

      return {
        ok: true,
        message: "Categoría eliminada correctamente",
        programacion: programacion.id,
      };

    } catch (error: any) {
      validarNoExistente(error.code, "La categoría solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando la categoría",
      };
    }
  }

  async actualizaProgramacion(programacionData: {
    nombre?: string;
    id: number | string;
  }) {
    try {
      const { id, nombre } = programacionData;

      // Verificar si la categoría existe
      const programacionExistente = await prisma.programacion.findUnique({
        where: { id: Number(id) }
      });

      if (!programacionExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La categoría solicitada no existe en la base de datos",
        };
      }

      // Preparar los nuevos datos
      const updates = {} as any;
      if (nombre !== undefined) updates.nombre_programacion = nombre;

      // Actualizar en base de datos
      const programacionActualizado = await prisma.programacion.update({
        where: { id: Number(id) },
        data: updates
      });

      // Borrar caché individual
      await this.redisService.delete(`programacion:${id}`);

      // Actualizar caché de lista si existe
      const programacionesCache = await this.redisService.get('programaciones:lista');
      if (programacionesCache) {
        let programaciones = JSON.parse(programacionesCache);
        programaciones = programaciones.map((e: any) =>
          e.id === Number(id)
            ? {
              ...e,
              nombre_programacion: programacionActualizado.nombre_programacion,
            }
            : e
        );
        await this.redisService.set('programaciones:lista', JSON.stringify(programaciones), 3600); // TTL 1 hora
      }

      return {
        ok: true,
        message: "Categoría actualizada correctamente",
        programacion: programacionActualizado
      };
    } catch (error: any) {
      validarExistente(error.code, "La categoría solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || error.data || "Ocurrió un error actualizando la categoría",
      };
    }
  }

}

