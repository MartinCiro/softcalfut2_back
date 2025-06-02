import LugarEncuentroPort from 'core/lugarEncuentro/lugarEncuentroPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';
import { LugarEncuentroData, LugarEncuentroDataUpdate } from 'api/lugarEncuentro/models/lugarEncuentro.model';

const prisma = new PrismaClient();

@Injectable()
export default class LugarEncuentroAdapter implements LugarEncuentroPort {
  constructor(private readonly redisService: RedisService) { }

  async crearLugarEncuentro(lugarEncuentroData: LugarEncuentroData) {
    try {
      const { nombre, direccion } = lugarEncuentroData;

      // Crear el nuevo lugarEncuentro
      await prisma.lugarEncuentro.create({
        data: {
          nombre,
          direccion
        }
      });

      await this.redisService.delete('lugarEncuentro:lista');

      return {
        ok: true,
        status_cod: 201,
        data: `La lugarEncuentro ${nombre} ha sido creada correctamente.`
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
        data: error.data || 'Ocurrió un error creando el lugarEncuentro.'
      };
    }
  }

  async obtenerLugarEncuentro(): Promise<any> {
    try {
      const cacheKey = 'lugarEncuentro:lista';
      const lugarEncuentroCache = await this.redisService.get(cacheKey);

      //if (lugarEncuentroCache) return JSON.parse(lugarEncuentroCache);

      const lugarEncuentro = await prisma.lugarEncuentro.findMany({
        select: {
          id: true,
          nombre: true,
          direccion: true
        }
      });

      if (lugarEncuentro.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado ningun lugar de encuentro"
        };
      }

      await this.redisService.set(cacheKey, JSON.stringify(lugarEncuentro));
      return lugarEncuentro;
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || "Ocurrió un error consultando el lugarEncuentro"
      };
    }
  }

  async actualizaLugarEncuentro(lugarEncuentroData: LugarEncuentroDataUpdate) {
    try {
      const { id, nombre, direccion } = lugarEncuentroData;

      // Verificar si el lugarEncuentro existe
      const lugarEncuentroExistente = await prisma.lugarEncuentro.findUnique({
        where: { id: Number(id) }
      });

      if (!lugarEncuentroExistente) {
        throw {
          ok: false,
          status_cod: 404,
          message: "La lugarEncuentro solicitada no existe en la base de datos.",
        };
      }

      const updates: any = {};
      if (nombre) updates.nombre = nombre;
      if (direccion) updates.direccion = direccion;

      if (Object.keys(updates).length > 0) {
        await prisma.lugarEncuentro.update({
          where: { id: Number(id) },
          data: updates
        });
      }

      // Limpiar caché individual
      await this.redisService.delete(`lugarEncuentro:${id}`);

      // Actualizar caché de lista si existe
      const lugarEncuentroCache = await this.redisService.get('lugarEncuentro:lista');
      if (lugarEncuentroCache) {
        let lugarEncuentro = JSON.parse(lugarEncuentroCache);
        lugarEncuentro = lugarEncuentro.map((e: any) =>
          e.id === Number(id)  
            ? {
              ...e,
              ...(nombre && { nombre }),        
              ...(direccion && { direccion })
            }
            : e
        );
        await this.redisService.set('lugarEncuentro:lista', JSON.stringify(lugarEncuentro));
      }

      return {
        ok: true,
        status_cod: 200,
        message: "LugarEncuentro actualizado correctamente"
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 500,
        data: error.message || error.data || "Ocurrió un error actualizando el lugarEncuentro",
      };
    }
  }
}

