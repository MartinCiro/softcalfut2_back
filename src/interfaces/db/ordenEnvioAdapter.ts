// src/interfaces/db/ordenEnvioAdapter.ts
import { Pool } from 'pg';
import OrdenEnviosPort from '../../core/ordenEnvios/ordenEnvioPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';
import axios from 'axios';


class OrdenEnvioAdapter implements OrdenEnviosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection();
  }

  // Implementación del método para crear un ordenEnvio
  async crearOrdenEnvios(ordenEnvioData: {
    id_remitente: string;
    id_destinatario?: string;
    direccion: string;
    peso: number;
    dimensiones: string;
    contenido: string;
    tipo_envio: number;
    id_transportista: string;
    fecha_envio?: number;
  }) {
    const client = await this.pool.connect();

    try {
      // 1️⃣ Validar en la base de datos (PostGIS)
      const direccionExiste = await client.query(`
            SELECT name FROM planet_osm_line 
            WHERE name ILIKE $1 
            AND ST_Contains(
                (SELECT ST_Union(way) FROM planet_osm_polygon WHERE name ILIKE 'Medellín'), 
                way
            )
            LIMIT 1;
        `, [ordenEnvioData.direccion.split(" #")[0]]);

      // 2️⃣ Si no se encuentra en PostGIS, buscar en la API de Nominatim
      if (direccionExiste.rowCount === 0) {
        console.log("📡 Dirección no encontrada en BD, consultando Nominatim...");

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ordenEnvioData.direccion)}&format=jsonv2`;
        const peticion = await axios.get(url);

        if (!peticion.data || peticion.data.length === 0) {
          throw {
            ok: false,
            status_cod: 400,
            data: "La dirección ingresada no es correcta. Ejemplo de formato válido: 'Calle 45 #67-89, Medellín'."
          };
        }

        console.log("✅ Dirección validada por Nominatim:", peticion.data[0].display_name);
      }

      // 3️⃣ Validar o generar la fecha de envío
      let fecha_envio = ordenEnvioData.fecha_envio;

      if (!fecha_envio) {
        const fechaHoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Verificamos si la fecha ya existe en la BD
    const fechaExistente = await client.query(
        `SELECT id FROM fecha_envio WHERE fecha = $1 LIMIT 1`, 
        [fechaHoy]
    );

    if (!!fechaExistente.rowCount) {
        fecha_envio = fechaExistente.rows[0].id; // Usamos la fecha existente
    } else {
        // Insertamos la nueva fecha si no existe
        const nuevaFecha = await client.query(
            `INSERT INTO fecha_envio (fecha) VALUES ($1) RETURNING id`, 
            [fechaHoy]
        );
        fecha_envio = nuevaFecha.rows[0].id;
    }
      } else {
        const fechaValidacion = await client.query(
          `SELECT id FROM fecha_envio WHERE id = $1`, [fecha_envio]
        );

        if (fechaValidacion.rowCount === 0) {
          console.warn("⚠️ La fecha de envío no existe. Se asignará la fecha actual.");
          const nuevaFecha = await client.query(
            `INSERT INTO fecha_envio (fecha) VALUES (CURRENT_DATE) RETURNING id`
          );
          fecha_envio = nuevaFecha.rows[0].id;
        }
      }

        let destinatarioFinal: string | null | undefined;
        let datosDestinatarioExterno = null;
        if (ordenEnvioData.id_destinatario) {
            const destinatarioExiste = await client.query(
                `SELECT email FROM usuario WHERE email = $1 LIMIT 1`, 
                [ordenEnvioData.id_destinatario]
            );

            if (destinatarioExiste.rowCount === 0) {
                datosDestinatarioExterno = {
                    direccion: ordenEnvioData.direccion,
                };
                destinatarioFinal = null;
            }
        }else {
          datosDestinatarioExterno = ordenEnvioData.direccion
        }

      // 4️⃣ Validar que el transportista sea un usuario con rol "Transportista"
      const transportistaValidacion = await client.query(
        `SELECT email FROM usuario 
             WHERE email = $1 
             AND id_rol = (SELECT id FROM rol WHERE nombre = 'Transportista' LIMIT 1)`,
        [ordenEnvioData.id_transportista]
      );

      if (transportistaValidacion.rowCount === 0) {
        throw {
          ok: false,
          status_cod: 400,
          data: "El transportista no es válido o no tiene el rol correcto."
        };
      }

      // 5️⃣ Insertar el envío con todos los datos validados
      const result = await client.query(
        `INSERT INTO envios (remitente_id, destinatario_id, datos_destinatario_externo, peso, dimensiones, contenido, tipo_envio_id, transportista_id, fecha_envio_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          ordenEnvioData.id_remitente,
          destinatarioFinal,
          datosDestinatarioExterno ? JSON.stringify(datosDestinatarioExterno) : null,
          ordenEnvioData.peso,
          ordenEnvioData.dimensiones,
          ordenEnvioData.contenido,
          ordenEnvioData.tipo_envio,
          ordenEnvioData.id_transportista,
          fecha_envio
        ]
      );

      console.log("✅ Envío creado con ID:", result.rows[0].id);
      return { ok: true, id: result.rows[0].id };

    } catch (error) {
      console.error("❌ Error al crear el envío:", error);

      const pgError = error as any;  // Para manejar errores de PostgreSQL

      if (pgError.code) {
        const validacion = validarExistente(pgError.code, "El transportista");
        if (!validacion.ok) {
          throw {
            ok: false,
            status_cod: 409,
            data: validacion.data,
          };
        }
      }

      throw {
        ok: pgError.ok || false,
        status_cod: pgError.status_cod || 500,
        data: pgError.data || "Error al procesar la solicitud."
      };

    } finally {
      client.release();
    }
  }


  async obtenerOrdenEnvios() {
    const client = await this.pool.connect();
    return client
      .query(`SELECT * FROM ordenEnvio`)
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows;
        throw {
          data: "No se encontraron datos",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el ordenEnvio",
        };
      })
      .finally(() => client.release());
  }

  async obtenerOrdenEnviosXid(ordenEnvioDataXid: { id_ordenEnvio: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`SELECT * FROM ordenEnvio where id = $1`, [ordenEnvioDataXid.id_ordenEnvio])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El ordenEnvio solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el ordenEnvio",
        };
      })
      .finally(() => client.release());
  }

  async delOrdenEnvio(ordenEnvioDataXid: { id_ordenEnvio: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`DELETE FROM ordenEnvio where id = $1`, [ordenEnvioDataXid.id_ordenEnvio])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El ordenEnvio solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el ordenEnvio",
        };
      })
      .finally(() => client.release());
  }


  async actualizaOrdenEnvio(ordenEnvioDataXid: { id_ordenEnvio: string | number; nombre?: string; descripcion?: string; }) {
    const { id_ordenEnvio } = ordenEnvioDataXid;
    const client = await this.pool.connect();

    // Definir las columnas posibles y sus valores
    const columnas: Record<string, any> = {
      nombre: ordenEnvioDataXid.nombre,
      descripcion: ordenEnvioDataXid.descripcion
    };

    const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

    const actualizacionesSQL = columnasFiltradas.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const valores = columnasFiltradas.map(([_, value]) => value);

    // Añadir el ID al final de los parámetros
    valores.push(id_ordenEnvio);

    const consulta = `
      UPDATE ordenEnvio
      SET ${actualizacionesSQL}
      WHERE id = $${valores.length}
    `;

    return client
      .query(consulta, valores)
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El ordenEnvio solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el ordenEnvio",
        };
      })
      .finally(() => client.release());
  }

}

export default OrdenEnvioAdapter;
