import { PrismaClient } from '@prisma/client';
import { Injectable, ForbiddenException } from '@nestjs/common';
import AfiliadosPort from '@core/afiliados/afiliadoPort';
import { RedisService } from '@shared/cache/redis.service';
import { validarExistente, validarNoExistente } from '@utils/validaciones';
import { AfiliadoData, AfiliadoDataUpdate } from '@api/afiliados/models/afiliado.model';

const prisma = new PrismaClient();

@Injectable()
export default class AfiliadosAdapter implements AfiliadosPort {
  constructor(private readonly redisService: RedisService) { }

  async crearAfiliados(afiliadoData: AfiliadoData) {
    try {
      const { equipo, lugar_entrenamiento, estado, logo } = afiliadoData;
      const logoUri = logo || 'https://raw.githubusercontent.com/MartinCiro/imagesSoftcalfut/main/imagenes/default.svg';

      // Verificar que el equipo existe
      const equipoExistente = await prisma.equipo.findUnique({where: { id: equipo }});

      if (!equipoExistente) {
        throw {
          ok: false,
          status_cod: 404,
          data: 'El equipo especificado no existe'
        };
      }

      // Verificar que el lugar de encuentro existe
      const lugarExistente = await prisma.lugarEncuentro.findUnique({ where: { id: lugar_entrenamiento }});

      if (!lugarExistente) {
        throw {
          ok: false,
          status_cod: 404,
          data: 'El lugar de entrenamiento especificado no existe'
        };
      }

      // Verificar que el estado existe (si se proporcionó)
      if (estado) {
        const estadoExistente = await prisma.estado.findUnique({
          where: { id: estado },
          select: { id: true }
        });

        if (!estadoExistente) {
          throw {
            ok: false,
            status_cod: 404,
            data: 'El estado especificado no existe'
          };
        }
      }

      // Crear el registro en AfiliadoInfo
      await prisma.afiliadoInfo.create({
        data: {
          equipo_id: equipo,
          lugar_entrenamiento_id: lugar_entrenamiento,
          estado_id: estado,
          logo: logoUri
        },
        include: {
          equipo: {
            include: {
              usuario: true,
              categoria: true
            }
          },
          lugar_entrenamiento: true,
          estado: true
        }
      });

      // Limpiar caché
      await this.redisService.delete('afiliados:lista');

      return {
        ok: true,
        status_cod: 201,
        data: "Afiliado creado exitosamente",
      };

    } catch (error: any) {
      // Manejo de errores de Prisma
      if (error.code === 'P2002') {
        throw {
          ok: false,
          status_cod: 409,
          data: 'Ya existe un registro de afiliado para este equipo'
        };
      }

      // Si el error ya tiene formato personalizado
      if (error.ok !== undefined) throw error;

      throw {
        ok: false,
        status_cod: error.status_cod || 500,
        data: error.message || 'Ocurrió un error creando la información del afiliado'
      };
    }
  }

  async obtenerAfiliados(): Promise<any> {
    try {
      const cacheKey = 'afiliados:lista';
      const afiliadosCache = await this.redisService.get(cacheKey);

      // if (afiliadosCache) return JSON.parse(afiliadosCache);

      const afiliados = await prisma.afiliadoInfo.findMany({
        include: {
          afiliado: {
            include: {
              categoria: true,
              usuario: {
                include: {
                  estado: true
                }
              }
            }
          },
          lugar_entrenamiento: true,
          estado: true
        }
      });

      if (afiliados.length === 0) {
        throw {
          ok: true,
          status_cod: 200,
          data: "No se han encontrado afiliados registrados"
        };
      }

      const afiliadosParseados = afiliados.map((afiliado: any) => ({
        id: afiliado.afiliado.id,
        logo: afiliado.logo,
        president: afiliado.afiliado.usuario
          ? `${afiliado.afiliado.usuario.nombres} ${afiliado.afiliado.usuario.apellido}`
          : 'No asignado',
        phone: afiliado.afiliado.usuario?.telefono || 'No registrado',
        categories: afiliado.afiliado.categoria
          ? [afiliado.afiliado.categoria.nombre_categoria]
          : ['Sin categoría'],
        trainingLocation: afiliado.lugar_entrenamiento?.nombre || 'No asignado',
        status: afiliado.estado?.nombre || 'Activo'
      }));

      await this.redisService.set(cacheKey, JSON.stringify(afiliadosParseados));
      return afiliadosParseados;
    } catch (error: any) {
      throw {
        ok: error.ok || false,
        status_cod: error.status_cod || 400,
        data: error.message || error.data || "Ocurrió un error consultando los afiliados"
      };
    }
  }

  async actualizaAfiliado(afiliadoData: AfiliadoDataUpdate) {
  try {
    const { id, equipo, lugar_entrenamiento, estado, logo } = afiliadoData;
    const logoUri = logo || 'https://raw.githubusercontent.com/MartinCiro/imagesSoftcalfut/main/imagenes/default.svg';

    // Verificar que el registro de afiliado existe
    const afiliadoExistente = await prisma.afiliadoInfo.findUnique({
      where: { id },
      include: {
        equipo: true,
        lugar_entrenamiento: true
      }
    });

    if (!afiliadoExistente) {
      throw {
        ok: false,
        status_cod: 404,
        data: 'El registro de afiliado no existe'
      };
    }

    // Verificar que el equipo existe (si se proporciona)
    if (equipo && equipo !== afiliadoExistente.equipo_id) {
      const equipoExistente = await prisma.equipo.findUnique({
        where: { id: equipo },
        select: { id: true }
      });

      if (!equipoExistente) {
        throw {
          ok: false,
          status_cod: 404,
          data: 'El equipo especificado no existe'
        };
      }
    }

    // Verificar que el lugar de encuentro existe (si se proporciona)
    if (lugar_entrenamiento && lugar_entrenamiento !== afiliadoExistente.lugar_entrenamiento_id) {
      const lugarExistente = await prisma.lugarEncuentro.findUnique({
        where: { id: lugar_entrenamiento },
        select: { id: true }
      });

      if (!lugarExistente) {
        throw {
          ok: false,
          status_cod: 404,
          data: 'El lugar de entrenamiento especificado no existe'
        };
      }
    }

    // Verificar que el estado existe (si se proporciona)
    if (estado && estado !== afiliadoExistente.estado_id) {
      const estadoExistente = await prisma.estado.findUnique({
        where: { id: estado },
        select: { id: true }
      });

      if (!estadoExistente) {
        throw {
          ok: false,
          status_cod: 404,
          data: 'El estado especificado no existe'
        };
      }
    }

    // Construir objeto de actualización
    const updateData: any = {};
    if (equipo) updateData.equipo_id = equipo;
    if (lugar_entrenamiento) updateData.lugar_entrenamiento_id = lugar_entrenamiento;
    if (estado !== undefined) updateData.estado_id = estado;
    if (logo !== undefined) updateData.logo = logoUri;

    // Actualizar el registro
    const afiliadoActualizado = await prisma.afiliadoInfo.update({
      where: { id },
      data: updateData,
      include: {
        equipo: {
          include: {
            usuario: true,
            categoria: true
          }
        },
        lugar_entrenamiento: true,
        estado: true
      }
    });

    // Limpiar caché
    await this.redisService.delete(`afiliado:${id}`);
    await this.redisService.delete('afiliados:lista');

    return {
      ok: true,
      status_cod: 200,
      data: {
        id: afiliadoActualizado.id,
        equipo: afiliadoActualizado.equipo.nom_equipo,
        categoria: afiliadoActualizado.equipo.categoria?.nombre_categoria,
        lugar_entrenamiento: afiliadoActualizado.lugar_entrenamiento?.nombre,
        estado: afiliadoActualizado.estado?.nombre,
        logo: afiliadoActualizado.logo
      }
    };

  } catch (error: any) {
    // Manejo de errores de Prisma
    if (error.code === 'P2002') {
      throw {
        ok: false,
        status_cod: 409,
        data: 'Ya existe un registro de afiliado para este equipo'
      };
    }

    // Si el error ya tiene formato personalizado
    if (error.ok !== undefined) {
      throw error;
    }

    throw {
      ok: false,
      status_cod: error.status_cod || 500,
      data: error.message || 'Ocurrió un error actualizando la información del afiliado'
    };
  }
}
}

