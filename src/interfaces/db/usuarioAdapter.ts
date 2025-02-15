// src/interfaces/db/usuarioAdapter.ts
import { Pool } from 'pg';
import UsuariosPort from '../../core/usuarios/usuarioPort';
import getConnection from '../DBConn';
import { validarExistente, validarNoExistente } from '../api/utils/validaciones';
import { Usuario } from '../../core/auth/entities/Usuario';

class UsuariosAdapter implements UsuariosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection();
  }

  // Implementación del método para crear un usuario
  async crearUsuarios(usuarioData: { documento: number | string; nombres: string; apellido: string; email: string; info_perfil?: string; num_contacto: string; pass: string; estado: number | string; id_rol: number | string; fecha_nacimiento: Date; }) {
    const client = await this.pool.connect();
    const columnas = ['documento', 'nombres', 'apellido', 'email', 'num_contacto', 'pass', 'estado', 'id_rol', 'fecha_nacimiento'];
    const user = new Usuario(usuarioData.documento, usuarioData.pass);
    const valores = [usuarioData.documento, usuarioData.nombres, usuarioData.apellido, usuarioData.email, usuarioData.num_contacto, user.getEncryptedPassword(), usuarioData.estado, usuarioData.id_rol, usuarioData.fecha_nacimiento];

    if (usuarioData.info_perfil) {
      columnas.push('info_perfil');
      valores.push(usuarioData.info_perfil);
    }

    return client
      .query(`INSERT INTO usuario (${columnas.join(', ')}) VALUES (${valores.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING documento`, valores)
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      })
      .catch((error) => {
        const validacion = validarExistente(error.code, usuarioData.documento.toString());
        if (!validacion.ok) {
          throw {
            ok: validacion.ok,
            status_cod: 409,
            data: validacion.data,
          }
        }
        
        const resultado = error.detail ? error.detail.match(/table\s+"([^"]+)"/)[1] : "valor";
        const valNoExistente = validarNoExistente(error.code, `El ${resultado} asignado`);

        if (!valNoExistente.ok) {
          throw {
            ok: false,
            status_cod: 409,
            data: valNoExistente.data,
          };
        }
        throw {
          ok: false,
          status_cod: 400,
          data: "Ocurrió un error consultando el usuario",
        };
      })
      .finally(() => client.release());
  }

  async obtenerUsuarios() {
    const client = await this.pool.connect();
    return client
      .query(`SELECT 
        u.documento, 
        u.nombres, 
        u.apellido, 
        u.email,
        u.info_perfil, 
        u.num_contacto, 
        estado_usuario.nombre AS estado_usuario, 
        r.nombre AS rol, 
        estado_rol.nombre AS estado_rol
    FROM usuario u
    JOIN estado estado_usuario ON u.estado = estado_usuario.id
    JOIN rol r ON u.id_rol = r.id
    JOIN estado estado_rol ON r.estado = estado_rol.id;
    `)
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
          data: error.data || "Ocurrió un error consultando el usuario",
        };
      })
      .finally(() => client.release());
  }

  async obtenerUsuariosXid(usuarioData: { documento: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`
    SELECT 
        u.documento, 
        u.nombres, 
        u.apellido, 
        u.email,
        u.info_perfil, 
        u.num_contacto, 
        estado_usuario.nombre AS estado_usuario, 
        r.nombre AS rol, 
        estado_rol.nombre AS estado_rol
    FROM usuario u
    JOIN estado estado_usuario ON u.estado = estado_usuario.id
    JOIN rol r ON u.id_rol = r.id
    JOIN estado estado_rol ON r.estado = estado_rol.id where documento = $1`, [usuarioData.documento])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El usuario solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el usuario",
        };
      })
      .finally(() => client.release());
  }

  async delUsuario(usuarioData: { documento: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`DELETE FROM usuario where documento = $1`, [usuarioData.documento])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El usuario solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el usuario",
        };
      })
      .finally(() => client.release());
  }

  async actualizaUsuario(usuarioData: { documento: number | string; nombres?: string; apellido?: string; email?: string; info_perfil?: string; num_contacto?: string; pass?: string; estado?: number | string; id_rol?: number | string; fecha_nacimiento?: Date; }) {
    const { documento, nombres, apellido, email, info_perfil, num_contacto, pass, estado, id_rol, fecha_nacimiento } = usuarioData;
    const client = await this.pool.connect();

    // Definir las columnas posibles y sus valores
    const columnas: Record<string, any> = {
      documento: documento,
      nombres: nombres,
      apellido: apellido,
      email: email,
      info_perfil: info_perfil,
      num_contacto: num_contacto,
      pass: pass,
      estado: estado,
      id_rol: id_rol,
      fecha_nacimiento: fecha_nacimiento,
    };

    const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

    const actualizacionesSQL = columnasFiltradas.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const valores = columnasFiltradas.map(([_, value]) => value);

    // Añadir el ID al final de los parámetros
    valores.push(documento);

    const consulta = `
      UPDATE usuario
      SET ${actualizacionesSQL}
      WHERE documento = $${valores.length}
    `;

    return client
      .query(consulta, valores)
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El usuario solicitado no existe en bd",
        };
      })
      .catch((error) => {
        const resultado = error.detail ? error.detail.match(/table\s+"([^"]+)"/)[1] : "valor";
        const valNoExistente = validarNoExistente(error.code, `El ${resultado} asignado`);
        if (!valNoExistente.ok) {
          throw {
            ok: false,
            status_cod: 409,
            data: valNoExistente.data,
          };
        }
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el usuario",
        };
      })
      .finally(() => client.release());
  }
}

export default UsuariosAdapter;
