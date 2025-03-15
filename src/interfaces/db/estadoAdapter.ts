import EstadosPort from 'core/estados/estadoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { natsService } from 'src/lib/nats';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class EstadosAdapter implements EstadosPort {
  constructor(private readonly redisService: RedisService) {}

  async crearEstados(estadoData: { nombre: string; descripcion?: string; }) {
    try {

      const nuevoEstado = await prisma.estado.create({
        data: {
          nombre: estadoData.nombre,
          descripcion: estadoData.descripcion
        }
      });
      // Publicar evento en NATS
      await natsService.publish('estado.creado', {
        id: nuevoEstado.id,
        nombre: nuevoEstado.nombre,
        descripcion: nuevoEstado.descripcion
      });

      await this.redisService.delete('estados:lista');

      return nuevoEstado;
    } catch (error: any) {
      const validacion = validarExistente(error.code, estadoData.nombre);
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
        data: error.data || "Ocurrió un error consultando el estado"
      };
    }
  }

  async obtenerEstados() {
    try {
      const cacheKey = 'estados:lista';
      const estadosCache = await this.redisService.get(cacheKey);

      if (estadosCache) return JSON.parse(estadosCache);

      const estados = await prisma.estado.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });

      if (!estados.length) throw new ForbiddenException("No se ha encontrado ningun estado");
      
      let estados_list = estados.map((estado: { id: any; nombre: any; descripcion: any; }) => ({
        id: estado.id,
        nombre: estado.nombre,
        descripcion: estado.descripcion
      }))
      await this.redisService.set(cacheKey, JSON.stringify(estados_list));
      return estados_list;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el estado"
      };
    }
  }

  async obtenerEstadosXid(estadoData: { id: string | number }) {
    try {
      const cacheKey = `estado:${estadoData.id}`;
      const estadoCache = await this.redisService.get(cacheKey);

      if (estadoCache) return JSON.parse(estadoCache);

      const estado = await prisma.estado.findUnique({
        where: { id: Number(estadoData.id) },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });
      if (!estado) throw new ForbiddenException("El estado solicitado no existe en la base de datos");
      const estado_id = {
        id: estado.id,
        nombre: estado.nombre,
        descripcion: estado.descripcion
      }

      await this.redisService.set(cacheKey, JSON.stringify(estado_id));
      return estado_id;
      
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el estado",
      };
    }
  }

  async delEstado(estadoData: { id: string }) {
    try {
      const estadosCache = await this.redisService.get('estados:lista');

      if (estadosCache) {
        const estados = JSON.parse(estadosCache).filter((e: any) => e.id !== estadoData.id);
        await this.redisService.set('estados:lista', JSON.stringify(estados), 3600);
      }

      const estado = await prisma.estado.delete({
        where: { id: Number(estadoData.id) },
      });

      return {
        ok: true,
        message: "Estado eliminado correctamente",
        estado: estado.id,
      };
    } catch (error: any) {
      validarNoExistente(error.code, "El estado solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el estado",
      };
    }
  }
  async actualizaEstado(estadoData: {
    nombre?: string;
    descripcion?: string;
    id: number | string;
  }) {
    try {
      const estadosCache = await this.redisService.get('estados:lista');

      if (estadosCache) {
        let estados = JSON.parse(estadosCache);
        estados = estados.map((e: any) => (e.id === estadoData.id ? estadoActualizado : e));
        await this.redisService.set('estados:lista', JSON.stringify(estados), 3600);
      }

      const { id, ...updates } = estadoData;

      // Verificar si el estado existe
      const estadoExistente = await prisma.estado.findUnique({
        where: { id: Number(id) }
      });

      if (!estadoExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "El estado solicitado no existe en la base de datos",
        }
      }


      // Actualizar el estado con los nuevos datos
      const estadoActualizado = await prisma.estado.update({
        where: { id: Number(id) },
        data: updates
      });

      return {
        ok: true,
        message: "Estado actualizado correctamente",
        estado: estadoActualizado
      };
    } catch (error: any) {
      validarExistente(error.code, "El estado solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || error.data || "Ocurrió un error actualizando el estado",
      };
    }
  }


}

