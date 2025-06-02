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

      if (!estadoId) throw new ForbiddenException("El estado activo no existe en la base de datos");
  
      const nuevaCedulaDeportiva = await prisma.cedulaDeportiva.create({
        data: {
          estado_cedula: estadoId.id,
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
      console.log(error);
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

  async obtenerCedulaDeportiva(cedulaDeportivaData: { id: string | number }) {
    try {
      const cacheKey = `cedulaDeportiva:${cedulaDeportivaData.id}`;
      const cedulaDeportivaCache = await this.redisService.get(cacheKey);
  
      if (cedulaDeportivaCache) return JSON.parse(cedulaDeportivaCache);
  
      const cedulasDeportiva = await prisma.cedulaDeportiva.findMany({
        select: {
          id: true,
          foto_base: true,
          fecha_creacion_deportiva: {
            select: { fecha: true }
          },
          fecha_actualizacion: {
            select: { fecha: true }
          },
          estado: {
            select: { nombre: true }
          },
          equipo: {
            select: { nom_equipo: true }
          },
          torneo: {
            select: { nombre_torneo: true }
          },
        }
      });
      if (cedulasDeportiva.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado las cedulas deportivas"
        };
      }

      const cedulasParseadas = cedulasDeportiva.map((cedula) => {
        return {
          estado: cedula.estado.nombre,
          equipo: cedula.equipo?.nom_equipo,
          torneo: cedula.torneo?.nombre_torneo,
          fechaActualizacion: cedula.fecha_actualizacion?.fecha,
          fechaCreacionDeportiva: cedula.fecha_creacion_deportiva?.fecha,
          fotoBase: cedula.foto_base,
        };
      });
  
      await this.redisService.set(cacheKey, JSON.stringify(cedulasParseadas));
      return cedulasParseadas;
  
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando la cédula deportiva",
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
            select: { fecha: true }
          },
          fecha_actualizacion: {
            select: { fecha: true }
          },
          estado: {
            select: { nombre: true }
          },
          equipo: {
            select: { nom_equipo: true }
          },
          torneo: {
            select: { nombre_torneo: true }
          },
        }
      });
  
      if (!cedulaDeportiva) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado la cedula deportiva"
        };
      }

      const cedulaParseada = {
        estado: cedulaDeportiva.estado.nombre,
        equipo: cedulaDeportiva.equipo?.nom_equipo,
        torneo: cedulaDeportiva.torneo?.nombre_torneo,
        fechaActualizacion: cedulaDeportiva.fecha_actualizacion?.fecha,
        fechaCreacionDeportiva: cedulaDeportiva.fecha_creacion_deportiva?.fecha,
        fotoBase: cedulaDeportiva.foto_base,
      };
  
      await this.redisService.set(cacheKey, JSON.stringify(cedulaParseada));
      return cedulaParseada;
  
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando la cédula deportiva",
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
    torneo?: number;
    equipo?: number;
    foto?: string;
  }) {
    try {
      const { id, estado, torneo, equipo, foto } = cedulaDeportivaData;
  
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
      if (torneo) dataToUpdate.id_torneo = torneo;
      if (equipo) dataToUpdate.id_equipo = equipo;
      if (foto) dataToUpdate.foto = foto;
  
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
        data:
          error.message || error.data || "Ocurrió un error actualizando la cédula deportiva",
      };
    }
  }
  
}

