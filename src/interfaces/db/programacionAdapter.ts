import ProgramacionesPort from 'core/programaciones/programacionPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';
import { ProgramacionData, ProgramacionDataUpdate, ProgramacionDataXid } from 'api/programaciones/models/programacion.model';
import { Genero } from '@prisma/client'

const prisma = new PrismaClient();

@Injectable()
export default class ProgramacionesAdapter implements ProgramacionesPort {
  constructor(private readonly redisService: RedisService) { }

  async crearProgramaciones(programacionData: ProgramacionData) {
    try {

      const [lugarEncuentro, equipoLocal, equipoVisitante, torneo] = await Promise.all([
        prisma.lugarEncuentro.findUnique({
          where: { id: programacionData.lugar },
          select: { id: true }
        }),
        prisma.equipo.findUnique({
          where: { id: programacionData.equipoLocal },
          select: { id: true }
        }),
        prisma.equipo.findUnique({
          where: { id: programacionData.equipoVisitante },
          select: { id: true }
        }),
        prisma.torneo.findUnique({
          where: { id: programacionData.torneo },
          select: { id: true }
        })
      ]);

      // Verificación de existencia
      const errors = [
        { check: !lugarEncuentro, message: 'El lugar de encuentro no existe' },
        { check: !equipoLocal, message: 'El equipo local no existe' },
        { check: !equipoVisitante, message: 'El equipo visitante no existe' },
        { check: !torneo, message: 'El torneo no existe' }
      ].filter(item => item.check);

      if (errors.length > 0) {
        throw {
          ok: false,
          status_cod: 409,
          data: errors.map(e => e.message).join(', ')
        };
      }

      const fechaEncuentro = await prisma.fecha.upsert({
        where: { fecha: programacionData.fecha },
        create: { fecha: programacionData.fecha },
        update: {},
        select: { id: true }
      });


      const verifiexiste = await prisma.programacion.findFirst({
        where: {
          cronograma_juego: programacionData.competencia,
          lugar_encuentro: programacionData.lugar,
          fecha_encuentro: fechaEncuentro?.id,
          id_equipo_local: programacionData.equipoLocal,
          id_equipo_visitante: programacionData.equipoVisitante,
          rama: programacionData.rama || Genero.M,
          id_torneo: programacionData.torneo
        }
      })

      if (verifiexiste) throw { ok: false, status_cod: 409, data: `La programación ya existe` };

      const nuevaProgramacion = await prisma.programacion.create({
        data: {
          cronograma_juego: programacionData.competencia,
          lugar_encuentro: programacionData.lugar,
          fecha_encuentro: fechaEncuentro?.id,
          id_equipo_local: programacionData.equipoLocal,
          id_equipo_visitante: programacionData.equipoVisitante,
          rama: programacionData.rama,
          id_torneo: programacionData.torneo
        }
      });

      await this.redisService.delete('programaciones:lista');
      const devUp = await this.obtenerProgramaciones()
      await this.redisService.set('programacion:lista', JSON.stringify(devUp));

      return nuevaProgramacion;
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
        data: error.data || "Ocurrió un error consultando el programacion"
      };
    }
  }

  async obtenerProgramaciones() {
    try {
      const cacheKey = 'programaciones:lista';
      const programacionesCache = await this.redisService.get(cacheKey);

      //if (programacionesCache) return JSON.parse(programacionesCache);

      const programaciones = await prisma.programacion.findMany({
        select: {
          id: true,
          rama: true,
          cronograma_juego: true,
          fecha: {
            select: {
              fecha: true
            }
          },
          lugarEncuentro: {
            select: {
              nombre: true
            }
          },
          equipoLocal: {
            select: {
              nom_equipo: true
            }
          },
          equipoVisitante: {
            select: {
              nom_equipo: true,
              categoria: {
                select: {
                  nombre_categoria: true
                }
              }
            }
          },
          torneo: {
            select: {
              nombre_torneo: true
            }
          }
        }
      });

      if (programaciones.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se ha encontrado ninguna programación"
        };
      }

      const agrupado: Record<string, {
        competencia: string;
        eventos: {
          local: string;
          visitante: string;
          hora: string;
          lugar: string;
          rama: string;
          fecha: string;
          dia: string;
          categoria: string,
          id: string | number,
          torneo: string,
          competencia: string
        }[];
      }> = {};

      // Procesar las fechas y agrupar
      for (const programacion of programaciones) {
        const fechaCompleta = programacion.fecha.fecha;
        const fechaFormateada = fechaCompleta.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const diaSemana = fechaCompleta.toLocaleDateString('es-ES', { weekday: 'long' });

        const hora = fechaCompleta.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).toLowerCase().replace(/(\d)(\s?)(a|p)\.\s?m\./i, '$1 $3.m.');
        const key = `${programacion.cronograma_juego}__${fechaFormateada}`;

        if (!agrupado[key]) {
          agrupado[key] = {
            competencia: programacion.cronograma_juego,
            eventos: []
          };
        }

        agrupado[key].eventos.push({
          local: programacion.equipoLocal.nom_equipo,
          visitante: programacion.equipoVisitante.nom_equipo,
          hora,
          lugar: programacion.lugarEncuentro?.nombre ?? '',
          rama: programacion.rama,
          fecha: fechaFormateada,
          dia: diaSemana,
          id: programacion.id,
          competencia: programacion.cronograma_juego,
          torneo: programacion.torneo?.nombre_torneo ?? '',
          categoria: programacion.equipoVisitante.categoria?.nombre_categoria ?? ''
        });
      }

      const listaFinal = Object.values(agrupado);
      await this.redisService.set(cacheKey, JSON.stringify(listaFinal));
      return listaFinal;

    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando las programaciones"
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
          cronograma_juego: true
        }
      });

      if (!programacion) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se ha encontrado la programación solicitada"
        };
      }

      await this.redisService.set(cacheKey, JSON.stringify(programacion));
      return programacion;

    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando la programación"
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

  async actualizaProgramacion(programacionData: ProgramacionDataUpdate) {
    try {
      const { id, rama, lugar, competencia, equipoLocal, equipoVisitante, torneo, categoria, hora } = programacionData;
      console.log(programacionData);
      let fecha = programacionData.fecha;
      fecha = fecha?.includes("T") ? fecha.split('T')[0].split('-').reverse().join('/') : fecha;
      // Verificar si la programación existe
      const programacionExistente = await prisma.programacion.findUnique({
        where: { id: Number(id) }
      });

      if (!programacionExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La programación solicitada no existe en la base de datos",
        };
      }

      if (fecha && hora) {
        // Dividir la fecha: "10/06/2025" → día, mes, año
        const [dia, mes, anio] = fecha.toString().split('/').map(Number);

        // Convertir hora a 24 horas
        const hora24 = (() => {
          const [h, minPeriodo] = hora.split(':');
          const [min, periodo] = minPeriodo.split(' ');
          let horas = Number(h);
          const minutos = Number(min);
          const isPM = periodo.toLowerCase() === 'p.m.' || periodo.toLowerCase() === 'pm';
          if (isPM && horas < 12) horas += 12;
          if (!isPM && horas === 12) horas = 0;
          return { horas, minutos };
        })();

        // Crear fecha UTC
        const fechaCompleta = new Date(Date.UTC(anio, mes - 1, dia, hora24.horas, hora24.minutos));
        const fechaEncuentro = await prisma.fecha.upsert({
          where: { fecha: fechaCompleta },
          create: { fecha: fechaCompleta },
          update: {},
          select: { id: true }
        });
        fecha = fechaEncuentro.id.toString();
      }

      // Preparar los nuevos datos
      const updates: any = {};
      if (rama) updates.rama = rama;
      if (fecha) updates.fecha_encuentro = Number(fecha);
      if (lugar) updates.lugar_encuentro = lugar;
      if (competencia) updates.cronograma_juego = competencia;
      if (equipoLocal) updates.id_equipo_local = equipoLocal;
      if (equipoVisitante) updates.id_equipo_visitante = equipoVisitante;
      if (torneo) updates.id_torneo = torneo;
      /* if (categoria) updates.categoria = categoria; */

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
              cronograma_juego: programacionActualizado.cronograma_juego,
            }
            : e
        );
        await this.redisService.set('programaciones:lista', JSON.stringify(programaciones), 3600); // TTL 1 hora
      }

      return {
        ok: true,
        message: "Programación actualizada correctamente",
        programacion: programacionActualizado
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
        data: error.message || error.data || "Ocurrió un error actualizando la programación",
      };
    }
  }
}

