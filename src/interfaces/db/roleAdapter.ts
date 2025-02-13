// src/interfaces/db/roleAdapter.ts
import { Pool } from 'pg';
import RolePort from '../../core/roles/rolePort';
import getConnection from '../DBConn';

class RoleAdapter implements RolePort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection(); // Usamos la conexión a la base de datos
  }

  // Implementación del método para crear un rol
  async crearRol(roleData: { nombre: string; descripcion: string }) {
    const client = await this.pool.connect();
    try {
      const query = 'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *';
      const result = await client.query(query, [roleData.nombre, roleData.descripcion]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Implementación del método para obtener los roles
  async obtenerRoles() {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM rol');
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default RoleAdapter;
