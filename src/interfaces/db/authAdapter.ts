import { PrismaClient } from '@prisma/client';
import AuthPort from '../../core/auth/authPort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class AuthAdapter implements AuthPort {

  async retrieveUser(authData: { id: string }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: authData.id.toLowerCase() },
        select: {
          id: true,
          nombre: true,
          passwd: true,
          id_rol: true,
          estado: {  
            select: {
              nombre: true
            }
          },
          rol: { 
            select: {
              nombre: true,
              rolXPermiso: {
                select: {
                  permiso: { select: { nombre: true } }
                }
              }
            }
          }
        },
      });
      if (!usuario) return null;

      return {
        id_user: usuario.id,
        usuario: usuario.nombre,
        password: usuario.passwd,
        id_rol: usuario.id_rol,
        estado: usuario.estado.nombre,
        rol: usuario.rol.nombre,
        permisos: usuario.rol?.rolXPermiso.map((rp: { permiso: { nombre: any; }; }) => rp.permiso.nombre) || []
      };

    } catch (error: any) {
      const validacion = validarExistente(error.code, authData.id.toString());
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
        data: "Ocurrió un error consultando el auth",
      };
    }
  }

}

export default AuthAdapter;
