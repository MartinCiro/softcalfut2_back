import CedulaDeportivaPort from 'core/cedulaDeportiva/cedulaDeportivaPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class CedulaDeportivaAdapter implements CedulaDeportivaPort {
  constructor(private readonly redisService: RedisService) {}

  async crearCedulaDeportiva(cedulaDeportivaData: {
    categoria: number;
    torneo: number;
    equipo: number;
    foto?: string;
  }) {
    try {
      // Registrar fechas (suponiendo que se agregan como nuevos registros)
      const fechaActual = new Date();

      // Intentamos encontrar una fecha igual (exacta)
      let fechaCreacion = await prisma.fecha.findFirst({
        where: { fecha: fechaActual },
        select: { id: true }
      });

      if (!fechaCreacion) fechaCreacion = await prisma.fecha.create({ data: { fecha: fechaActual } });

      // Repetimos para la fecha de registro (puedes usar la misma si es necesario)
      let fechaRegistro = await prisma.fecha.findFirst({
        where: { fecha: fechaActual },
        select: { id: true }
      });

      if (!fechaRegistro) fechaRegistro = await prisma.fecha.create({ data: { fecha: fechaActual } });

      const estadoId = await prisma.estado.findUnique({
        where: { nombre: "Activo" },
        select: { id: true }
      });

      if (!estadoId) throw new ForbiddenException("El estado Activo no existe en la base de datos");
  
      const nuevaCedulaDeportiva = await prisma.cedulaDeportiva.create({
        data: {
          estado_cedula: estadoId.id,
          id_categoria: cedulaDeportivaData.categoria,
          id_torneo: cedulaDeportivaData.torneo,
          id_equipo: cedulaDeportivaData.equipo,
          id_fecha_creacion_deportiva: fechaCreacion.id,
          id_fecha_actualizacion: fechaRegistro.id,
          foto_base: cedulaDeportivaData.foto || null
        }
      });
  
      await this.redisService.delete('cedulaDeportiva:lista');
  
      return nuevaCedulaDeportiva;
    } catch (error: any) {
      const validacion = validarExistente(error.code, "cedula deportiva");
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
        data: error.data || "Ocurrió un error al crear la cédula deportiva"
      };
    }
  }

  async obtenerCedulaDeportivaXid(cedulaDeportivaData: { id: string | number }) {
    try {
      const cacheKey = `cedulaDeportiva:${cedulaDeportivaData.id}`;
      const cedulaDeportivaCache = await this.redisService.get(cacheKey);
  
      if (cedulaDeportivaCache) return JSON.parse(cedulaDeportivaCache);
  
      const cedulaDeportiva = await prisma.cedulaDeportiva.findUnique({
        where: { id: Number(cedulaDeportivaData.id) },
        select: {
          id: true,
          foto_base: true,
          fecha_creacion_deportiva: {
            select: { id: true, fecha: true }
          },
          fecha_actualizacion: {
            select: { id: true, fecha: true }
          },
          estado: {
            select: { id: true, nombre: true }
          },
          equipo: {
            select: { id: true, nom_equipo: true }
          },
          categoria: {
            select: { id: true, nombre_categoria: true }
          },
          torneo: {
            select: { id: true, nombre_torneo: true }
          },
        }
      });
  
      if (!cedulaDeportiva)
        throw new ForbiddenException("La cédula deportiva solicitada no existe en la base de datos");
  
      await this.redisService.set(cacheKey, JSON.stringify(cedulaDeportiva));
      return cedulaDeportiva;
  
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando la cédula deportiva",
      };
    }
  }
  
  async delCedulaDeportiva(cedulaDeportivaData: { id: string }) {
    try {
      const id = Number(cedulaDeportivaData.id);
  
      // Eliminar de la base de datos primero
      const cedulaDeportiva = await prisma.cedulaDeportiva.delete({
        where: { id },
      });
  
      // Borrar caché específica por ID
      await this.redisService.delete(`cedulaDeportiva:${id}`);
  
      // Actualizar la lista cacheada
      const cedulaDeportivaCache = await this.redisService.get('cedulaDeportiva:lista');
      if (cedulaDeportivaCache) {
        const cedulaDeportiva = JSON.parse(cedulaDeportivaCache).filter((e: any) => e.id !== id);
        await this.redisService.set('cedulaDeportiva:lista', JSON.stringify(cedulaDeportiva), 3600); // TTL de 1 hora
      }
  
      return {
        ok: true,
        message: "Cedula deportiva eliminada correctamente",
        cedulaDeportiva: cedulaDeportiva.id,
      };
  
    } catch (error: any) {
      validarNoExistente(error.code, "La cedula deportiva solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando la cedula deportiva",
      };
    }
  }

  async actualizaCedulaDeportiva(cedulaDeportivaData: {
    id: number | string;
    estado?: number;
    categoria?: number;
    torneo?: number;
    equipo?: number;
    foto?: string;
  }) {
    try {
      const { id, estado, categoria, torneo, equipo, foto } = cedulaDeportivaData;
  
      // Verificar existencia
      const cedulaExistente = await prisma.cedulaDeportiva.findUnique({
        where: { id: Number(id) },
      });
  
      if (!cedulaExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La cédula deportiva no existe en la base de datos",
        };
      }
  
      // Buscar o crear nueva fecha de actualización
      const fechaActual = new Date();
      let fechaActualizacion = await prisma.fecha.findFirst({
        where: { fecha: fechaActual },
      });
  
      if (!fechaActualizacion) {
        fechaActualizacion = await prisma.fecha.create({ data: { fecha: fechaActual } });
      }
  
      // Preparar datos para actualizar
      const dataToUpdate: any = {
        id_fecha_actualizacion: fechaActualizacion.id,
      };
  
      if (estado !== undefined) dataToUpdate.estado_cedula = estado;
      if (categoria !== undefined) dataToUpdate.id_categoria = categoria;
      if (torneo !== undefined) dataToUpdate.id_torneo = torneo;
      if (equipo !== undefined) dataToUpdate.id_equipo = equipo;
      if (foto !== undefined) dataToUpdate.foto = foto;
  
      // Actualizar en base de datos
      const actualizado = await prisma.cedulaDeportiva.update({
        where: { id: Number(id) },
        data: dataToUpdate,
      });
  
      // Eliminar caché individual
      await this.redisService.delete(`cedulaDeportiva:${id}`);
  
      // Opcional: actualizar caché de lista si lo usas
      const cacheLista = await this.redisService.get("cedulaDeportiva:lista");
      if (cacheLista) {
        let lista = JSON.parse(cacheLista);
        lista = lista.map((e: any) =>
          e.id === Number(id) ? { ...e, ...dataToUpdate } : e
        );
        await this.redisService.set("cedulaDeportiva:lista", JSON.stringify(lista), 3600);
      }
  
      return {
        ok: true,
        message: "Cédula deportiva actualizada correctamente",
        cedulaDeportiva: actualizado,
      };
    } catch (error: any) {
      validarExistente(error.code, "La cédula deportiva");
      throw {
        ok: false,
        status_cod: 400,
        data:
          error.message || error.data || "Ocurrió un error actualizando la cédula deportiva",
      };
    }
  }
  
}

