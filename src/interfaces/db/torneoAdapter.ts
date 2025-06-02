import TorneosPort from 'core/torneos/torneoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class TorneosAdapter implements TorneosPort {
  constructor(private readonly redisService: RedisService) {}

  async crearTorneos(torneoData: { nombre: string; }) {
    try {

      const nuevaTorneo = await prisma.torneo.create({
        data: {
          nombre_torneo: torneoData.nombre
        }
      });

      await this.redisService.delete('torneos:lista');

      return nuevaTorneo;
    } catch (error: any) {
      const validacion = validarExistente(error.code, torneoData.nombre);
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
        data: error.data || "Ocurrió un error consultando el torneo"
      };
    }
  }

  async obtenerTorneos() {
    try {
      const cacheKey = 'torneos:lista';
      const torneosCache = await this.redisService.get(cacheKey);

      if (torneosCache) return JSON.parse(torneosCache);

      const torneos = await prisma.torneo.findMany({
        select: {
          id: true,
          nombre_torneo: true
        }
      });

      if (torneos.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado ningun torneo"
        };
      }
      
      await this.redisService.set(cacheKey, JSON.stringify(torneos));
      return torneos;

    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando el torneo"
      };
    }
  }

  async obtenerTorneosXid(torneoData: { id: string | number }) {
    try {
      const cacheKey = `torneo:${torneoData.id}`;
      const torneoCache = await this.redisService.get(cacheKey);

      if (torneoCache) return JSON.parse(torneoCache);

      const torneo = await prisma.torneo.findUnique({
        where: { id: Number(torneoData.id) },
        select: {
          id: true,
          nombre_torneo: true
        }
      });
      if (!torneo) {
        throw {
          ok: true,
          status_cod: 200,
          data: "El torneo solicitado no existe en la base de datos"
        };
      }
      const torneo_id = {
        id: torneo.id,
        nombre_torneo: torneo.nombre_torneo
      }

      await this.redisService.set(cacheKey, JSON.stringify(torneo_id));
      return torneo_id;
      
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando el torneo",
      };
    }
  }

  async delTorneo(torneoData: { id: string }) {
    try {
      const id = Number(torneoData.id);
  
      // Eliminar de la base de datos primero
      const torneo = await prisma.torneo.delete({
        where: { id },
      });
  
      // Borrar caché específica por ID
      await this.redisService.delete(`torneo:${id}`);
  
      // Actualizar la lista cacheada
      const torneosCache = await this.redisService.get('torneos:lista');
      if (torneosCache) {
        const torneos = JSON.parse(torneosCache).filter((e: any) => e.id !== id);
        await this.redisService.set('torneos:lista', JSON.stringify(torneos), 3600); // TTL de 1 hora
      }
  
      return {
        ok: true,
        message: "Torneo eliminado correctamente",
        torneo: torneo.id,
      };
  
    } catch (error: any) {
      validarNoExistente(error.code, "El torneo solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el torneo",
      };
    }
  }

  async actualizaTorneo(torneoData: {
    nombre?: string;
    id: number | string;
  }) {
    try {
      const { id, nombre } = torneoData;
  
      // Verificar si el torneo existe
      const torneoExistente = await prisma.torneo.findUnique({
        where: { id: Number(id) }
      });
  
      if (!torneoExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La torneo solicitada no existe en la base de datos",
        };
      }
  
      // Preparar los nuevos datos
      const updates = {} as any;
      if (nombre) updates.nombre_torneo = nombre;
  
      // Actualizar en base de datos
      const torneoActualizado = await prisma.torneo.update({
        where: { id: Number(id) },
        data: updates
      });
  
      // Borrar caché individual
      await this.redisService.delete(`torneo:${id}`);
  
      // Actualizar caché de lista si existe
      const torneosCache = await this.redisService.get('torneos:lista');
      if (torneosCache) {
        let torneos = JSON.parse(torneosCache);
        torneos = torneos.map((e: any) =>
          e.id === Number(id)
            ? {
                ...e,
                nombre_torneo: torneoActualizado.nombre_torneo,
              }
            : e
        );
        await this.redisService.set('torneos:lista', JSON.stringify(torneos), 3600); // TTL 1 hora
      }
  
      return {
        ok: true,
        message: "Torneo actualizada correctamente",
        torneo: torneoActualizado
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
        data: error.message || error.data || "Ocurrió un error actualizando el torneo",
      };
    }
  }
  
}

