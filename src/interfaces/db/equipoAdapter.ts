import EquiposPort from 'core/equipos/equipoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class EquiposAdapter implements EquiposPort {
  constructor(private readonly redisService: RedisService) {}

  async crearEquipos(equipoData: { nombre_equipo: string; num_doc: number; }) {
    try {
      // Verificar si el documento ya existe en la base de datos
      const equipoExistente = await prisma.equipo.findUnique({
        where: {
          nom_equipo: equipoData.nombre_equipo
        }
      });
  
      if (equipoExistente) {
        throw {
          ok: false,
          status_cod: 409, // Conflicto: ya existe el documento
          data: `El equipo ${equipoData.nombre_equipo} ya existe.`
        };
      }
  
      // Si no existe, crear el nuevo equipo
      const nuevaEquipo = await prisma.equipo.create({
        data: {
          nom_equipo: equipoData.nombre_equipo,
          documento: equipoData.num_doc.toString()
        }
      });
  
      // Limpiar cache
      await this.redisService.delete('equipos:lista');
  
      return nuevaEquipo;
  
    } catch (error: any) {
      // Validación de errores
      const validacion = validarExistente(error.code, equipoData.nombre_equipo);
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
  
      // Si el error no es de validación, lanzar error genérico
      throw {
        ok: false,
        status_cod: 400,
        data: error.data || "Ocurrió un error consultando el equipo"
      };
    }
  }
  
  async asignarJugadores(equipoData: { nombre_equipo: string; jugadores: (number | string)[]; }) {
    try {
      // Buscar el equipo por nombre
      const equipo = await prisma.equipo.findUnique({
        where: {
          nom_equipo: equipoData.nombre_equipo
        },
        select: {
          id: true
        }
      });
  
      if (!equipo) {
        throw {
          ok: false,
          status_cod: 404,
          data: `El equipo ${equipoData.nombre_equipo} no existe.`
        };
      }
  
      const id_equipo = equipo.id;
  
      // Mapear los documentos a la estructura requerida por la tabla UsuarioXEquipo
      const relaciones = equipoData.jugadores.map(documento => ({
        id_equipo,
        documento_user: documento.toString()
      }));
  
      // Asignar los documentos al equipo
      const resultado = await prisma.usuarioXEquipo.createMany({
        data: relaciones,
        skipDuplicates: true  
      });
  
      return {
        ok: true,
        status_cod: 200,
        data: `Se asignaron ${resultado.count} documento(s) al equipo "${equipoData.nombre_equipo}".`
      };
  
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 500,
        data: error.data || 'Ocurrió un error asignando documentos al equipo.'
      };
    }
  }
  
  async obtenerEquipos() {
    try {
      const cacheKey = 'equipos:lista';
      const equiposCache = await this.redisService.get(cacheKey);

      if (equiposCache) return JSON.parse(equiposCache);

      const equipos = await prisma.equipo.findMany({
        select: {
          id: true,
          nom_equipo: true
        }
      });

      if (!equipos.length) throw new ForbiddenException("No se ha encontrado ningun equipo");
      
      await this.redisService.set(cacheKey, JSON.stringify(equipos));
      return equipos;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el equipo"
      };
    }
  }

  async obtenerEquiposXid(equipoData: { id: string | number }) {
    try {
      const cacheKey = `equipo:${equipoData.id}`;
      const equipoCache = await this.redisService.get(cacheKey);

      if (equipoCache) return JSON.parse(equipoCache);

      const equipo = await prisma.equipo.findUnique({
        where: { id: Number(equipoData.id) },
        select: {
          id: true,
          nom_equipo: true
        }
      });
      if (!equipo) throw new ForbiddenException("La categoría solicitada no existe en la base de datos");
      const equipo_id = {
        id: equipo.id,
        nombre_equipo: equipo.nom_equipo
      }

      await this.redisService.set(cacheKey, JSON.stringify(equipo_id));
      return equipo_id;
      
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el equipo",
      };
    }
  }

  async delEquipo(equipoData: { id: string }) {
    try {
      const id = equipoData.id;
  
      // Eliminar de la base de datos primero
      const equipo = await prisma.equipo.delete({
        where: { id: Number(id) },
      });
  
      // Borrar caché específica por ID
      await this.redisService.delete(`equipo:${id}`);
  
      // Actualizar la lista cacheada
      const equiposCache = await this.redisService.get('equipos:lista');
      if (equiposCache) {
        const equipos = JSON.parse(equiposCache).filter((e: any) => e.id !== id);
        await this.redisService.set('equipos:lista', JSON.stringify(equipos), 3600); // TTL de 1 hora
      }
  
      return {
        ok: true,
        message: "Categoría eliminada correctamente",
        equipo: equipo.id,
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

  async actualizaEquipo(equipoData: {
    nombre?: string;
    id: string;
  }) {
    try {
      const { id, nombre } = equipoData;
  
      // Verificar si la categoría existe
      const equipoExistente = await prisma.equipo.findUnique({
        where: { id: Number(id) }
      });
  
      if (!equipoExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La categoría solicitada no existe en la base de datos",
        };
      }
  
      // Preparar los nuevos datos
      const updates = {} as any;
      if (nombre !== undefined) updates.nombre_equipo = nombre;
  
      // Actualizar en base de datos
      const equipoActualizado = await prisma.equipo.update({
        where: { id: Number(id) },
        data: updates
      });
  
      // Borrar caché individual
      await this.redisService.delete(`equipo:${id}`);
  
      // Actualizar caché de lista si existe
      const equiposCache = await this.redisService.get('equipos:lista');
      if (equiposCache) {
        let equipos = JSON.parse(equiposCache);
        equipos = equipos.map((e: any) =>
          e.id === Number(id)
            ? {
                ...e,
                nombre_equipo: equipoActualizado.nom_equipo,
              }
            : e
        );
        await this.redisService.set('equipos:lista', JSON.stringify(equipos), 3600); // TTL 1 hora
      }
  
      return {
        ok: true,
        message: "Categoría actualizada correctamente",
        equipo: equipoActualizado
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

