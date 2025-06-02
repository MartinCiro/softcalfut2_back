import NotasPort from 'core/notas/notaPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';
import { NotaData, NotaDataUpdate } from 'api/notas/models/nota.model';

const prisma = new PrismaClient();

@Injectable()
export default class NotasAdapter implements NotasPort {
  constructor(private readonly redisService: RedisService) { }

  async crearNotas(notaData: NotaData) {
    try {
      const { nombre, descripcion } = notaData;

      // Crear el nuevo nota
      await prisma.notas.create({
        data: {
          nombre,
          descripcion
        }
      });

      await this.redisService.delete('notas:lista');

      return {
        ok: true,
        status_cod: 201,
        data: `La nota ${nombre} ha sido creada correctamente.`
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
        data: error.data || 'Ocurrió un error creando el nota.'
      };
    }
  }

  async obtenerNotas(): Promise<any> {
    try {
      const cacheKey = 'notas:lista';
      const notasCache = await this.redisService.get(cacheKey);

      //if (notasCache) return JSON.parse(notasCache);

      const notas = await prisma.notas.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      });

      if (notas.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado ninguna nota"
        };
      }

      await this.redisService.set(cacheKey, JSON.stringify(notas));
      return notas;
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando el nota"
      };
    }
  }

  async actualizaNota(notaData: NotaDataUpdate) {
    try {
      const { id, nombre, descripcion } = notaData;

      // Verificar si el nota existe
      const notaExistente = await prisma.notas.findUnique({
        where: { id: Number(id) }
      });

      if (!notaExistente) {
        throw {
          ok: false,
          status_cod: 404,
          message: "La nota solicitada no existe en la base de datos.",
        };
      }

      const updates: any = {};
      if (nombre) updates.nombre = nombre;
      if (descripcion) updates.descripcion = descripcion;

      if (Object.keys(updates).length > 0) {
        await prisma.notas.update({
          where: { id: Number(id) },
          data: updates
        });
      }

      // Limpiar caché individual
      await this.redisService.delete(`nota:${id}`);

      // Actualizar caché de lista si existe
      const notasCache = await this.redisService.get('notas:lista');
      if (notasCache) {
        let notas = JSON.parse(notasCache);
        notas = notas.map((e: any) =>
          e.id === Number(id)  
            ? {
              ...e,
              ...(nombre && { nombre }),        
              ...(descripcion && { descripcion })
            }
            : e
        );
        await this.redisService.set('notas:lista', JSON.stringify(notas));
      }

      return {
        ok: true,
        status_cod: 200,
        message: "Nota actualizado correctamente"
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 500,
        data: error.message || error.data || "Ocurrió un error actualizando el nota",
      };
    }
  }
}

