import AnunciosPort from 'core/anuncios/anuncioPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class AnunciosAdapter implements AnunciosPort {
  constructor(private readonly redisService: RedisService) { }

  async crearAnuncios(anuncioData: { nombre: string; contenido: string; imagenUrl: string }) {
    try {
      const fechaActual = new Date();

      // Intentamos encontrar una fecha igual (exacta)
      let fechaCreacion = await prisma.fecha.findFirst({
        where: { fecha: fechaActual },
        select: { id: true }
      });

      // Si no encontramos la fecha, la creamos
      if (!fechaCreacion) {
        fechaCreacion = await prisma.fecha.create({
          data: { fecha: fechaActual }
        });
      }

      // Usamos upsert para asegurar que el estado "Activo" siempre esté presente
      const estado = await prisma.estado.upsert({
        where: { nombre: "Activo" },
        update: {},
        create: { nombre: "Activo" }
      });

      // Creamos el anuncio
      const nuevaAnuncio = await prisma.anuncio.create({
        data: {
          titulo: anuncioData.nombre,
          contenido: anuncioData.contenido,
          imagenUrl: anuncioData.imagenUrl,
          idFechaCreacion: fechaCreacion.id,
          idEstado: estado.id
        }
      });

      // Limpiamos la cache de anuncios
      await this.redisService.delete('anuncios:lista');

      return nuevaAnuncio;
    } catch (error: any) {
      const validacion = validarExistente(error.code, anuncioData.nombre);
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
        data: error.data || "Ocurrió un error al crear el anuncio"
      };
    }
  }

  async obtenerAnuncios() {
    try {
      const cacheKey = 'anuncios:lista';
      const anunciosCache = await this.redisService.get(cacheKey);

      if (anunciosCache) return JSON.parse(anunciosCache);

      const anuncios = await prisma.anuncio.findMany({
        select: {
          id: true,
          titulo: true,
          contenido: true,
          imagenUrl: true,
          fechaCreacion: {
            select: {
              fecha: true
            }
          },
          estado: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: {
          fechaCreacion: {
            fecha: 'desc'
          }
        }
      });

      if (!anuncios.length) throw new ForbiddenException("No se ha encontrado ningún anuncio");

      // Aquí solo transformamos los resultados necesarios
      const resultados = anuncios.map(anuncio => ({
        id: anuncio.id,
        titulo: anuncio.titulo,
        contenido: anuncio.contenido,
        imagenUrl: anuncio.imagenUrl,
        fechaCreacion: anuncio.fechaCreacion.fecha.toISOString(),
        estado: anuncio.estado.nombre // Asegúrate de solo incluir 'estado.nombre'
      }));

      // Guarda en caché con TTL de 1 hora (opcional, configurable)
      await this.redisService.set(cacheKey, JSON.stringify(resultados), 360);

      return resultados;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando los anuncios"
      };
    }
  }


  async obtenerAnunciosXEstado(estadoData: { estado: string }) {
    try {
      const cacheKey = `anuncios:estado:${estadoData.estado}`;
      const anunciosCache = await this.redisService.get(cacheKey);

      if (anunciosCache) return JSON.parse(anunciosCache);

      const anuncios = await prisma.anuncio.findMany({
        where: {
          estado: {
            nombre: estadoData.estado
          }
        },
        select: {
          id: true,
          titulo: true,
          contenido: true,
          imagenUrl: true,
          fechaCreacion: {
            select: {
              fecha: true
            }
          },
          estado: {
            select: {
              nombre: true
            }
          }
        }
      });

      if (!anuncios.length) throw new ForbiddenException("No se ha encontrado ningún anuncio");



      await this.redisService.set(cacheKey, JSON.stringify(anuncios), 360);
      return anuncios;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando los anuncios",
      };
    }
  }

  async obtenerAnunciosXid(anuncioData: { id: string | number }) {
    try {
      const cacheKey = `anuncio:${anuncioData.id}`;
      const anuncioCache = await this.redisService.get(cacheKey);

      if (anuncioCache) return JSON.parse(anuncioCache);

      const anuncio = await prisma.anuncio.findUnique({
        where: { id: Number(anuncioData.id) },
        select: {
          id: true,
          titulo: true,
          contenido: true,
          imagenUrl: true,
          fechaCreacion: {
            select: {
              fecha: true
            }
          },
          estado: {
            select: {
              nombre: true
            }
          }
        }
      });

      if (!anuncio) {
        throw new ForbiddenException("El anuncio solicitado no existe en la base de datos");
      }

      const anuncioDetalle = {
        ...anuncio,
        fechaCreacion: anuncio.fechaCreacion.fecha.toISOString(),
        estado: anuncio.estado.nombre
      };

      await this.redisService.set(cacheKey, JSON.stringify(anuncioDetalle), 360); // 1 hora de TTL
      return anuncioDetalle;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el anuncio",
      };
    }
  }


  async delAnuncio(anuncioData: { id: string }) {
    try {
      const id = Number(anuncioData.id);

      // Eliminar de la base de datos primero
      const anuncio = await prisma.anuncio.delete({
        where: { id },
      });

      // Borrar caché específica por ID
      await this.redisService.delete(`anuncio:${id}`);

      // Actualizar la lista cacheada
      const anunciosCache = await this.redisService.get('anuncios:lista');
      if (anunciosCache) {
        const anuncios = JSON.parse(anunciosCache).filter((e: any) => e.id !== id);
        await this.redisService.set('anuncios:lista', JSON.stringify(anuncios), 3600); // TTL de 1 hora
      }

      return {
        ok: true,
        message: "Categoría eliminada correctamente",
        anuncio: anuncio.id,
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

  async actualizaAnuncio(anuncioData: {
    nombre?: string;
    contenido?: string;
    imagenUrl?: string;
    estado?: boolean;
    id: number | string;
  }) {
    try {
      const { id, nombre, contenido, imagenUrl, estado } = anuncioData;
      const updates: any = {};
      const anuncioExistente = await prisma.anuncio.findUnique({
        where: { id: Number(id) }
      });

      if (!anuncioExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "El anuncio solicitado no existe en la base de datos",
        };
      }
      if (estado !== undefined) {
        const estadoBd = estado ? "Activo" : "Inactivo";
        const estadoRelacionado = await prisma.estado.findUnique({
          where: { nombre: estadoBd }
        });
        if (!estadoRelacionado) {
          throw {
            ok: false,
            status_cod: 400,
            message: "El estado especificado no existe en la base de datos",
          };
        }
        updates.idEstado = estadoRelacionado.id;
      }


      if (nombre !== undefined) updates.titulo = nombre;
      if (contenido !== undefined) updates.contenido = contenido;
      if (imagenUrl !== undefined) updates.imagenUrl = imagenUrl;

      const anuncioActualizado = await prisma.anuncio.update({
        where: { id: Number(id) },
        data: updates
      });

      await this.redisService.delete('anuncios:lista');
      return {
        ok: true,
        message: "Anuncio actualizado correctamente",
        anuncio: anuncioActualizado
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error actualizando el anuncio"
      };
    }
  }


}

