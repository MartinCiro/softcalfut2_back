// src/interfaces/db/estadoAdapter.ts
import { Pool } from 'pg';
import EstadosPort from '../../core/estados/estadoPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';  


class EstadosAdapter implements EstadosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection(); 
  }

  // Implementación del método para crear un estado
  async crearEstados(estadoData: { nombre: string; descripcion: string }) {
    const client = await this.pool.connect();
    return client
    .query(`INSERT INTO estado (nombre, descripcion) VALUES ($1, $2) RETURNING id`, [estadoData.nombre, estadoData.descripcion])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
    })
    .catch((error) => {
      const validacion = validarExistente(error.code, estadoData.nombre);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.result,
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }
  
  async obtenerEstados() {
    const client = await this.pool.connect();
    return client
    .query(`SELECT * FROM estado`)
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
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }

  async obtenerEstadosXid(estadoDataXid: { id_estado: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`SELECT * FROM estado where id = $1`, [estadoDataXid.id_estado])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El estado solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }

  async delEstado(estadoDataXid: { id_estado: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`DELETE FROM estado where id = $1`, [estadoDataXid.id_estado])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El estado solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }

  
  async actualizaEstado(EstadoDataXid: { id_estado: string | number; nombre?: string; descripcion?: string; }) {
    const { id_estado } = EstadoDataXid;
    console.log(EstadoDataXid);
    const client = await this.pool.connect();

    // Definir las columnas posibles y sus valores
    const columnas: Record<string, any> = {
      nombre: EstadoDataXid.nombre,
      descripcion: EstadoDataXid.descripcion
    };
  
    const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);
  
    const actualizacionesSQL = columnasFiltradas.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const valores = columnasFiltradas.map(([_, value]) => value);
  
    // Añadir el ID al final de los parámetros
    valores.push(id_estado);
  
    const consulta = `
      UPDATE estado
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
          data: "El estado solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el estado",
        };
      })
      .finally(() => client.release());
  }
  
}

export default EstadosAdapter;
