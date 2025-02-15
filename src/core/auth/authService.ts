import AuthAdapter from '../../interfaces/db/authAdapter';
import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';

class AuthService {
    private authAdapter: AuthAdapter;

    constructor(authAdapter: AuthAdapter) {
        this.authAdapter = authAdapter;
    }

    async loginUser(user: Usuario): Promise<{ ok: boolean; status_cod: number; data: any }> {
        try {
          const usuarioRetrieved = await this.authAdapter.retrieveUser({ documento: user.documento });
          if (!usuarioRetrieved) throw new Error('Usuario o contraseña inválida');

            // Generación del JWT
            const token = generateJWT({ 
                id_user: usuarioRetrieved.id_user, 
                nombre: usuarioRetrieved.usuario + ' ' + usuarioRetrieved.apellido, 
                id_rol: usuarioRetrieved.id_rol 
            });

            return {
                ok: true,
                status_cod: 200,
                data: {
                    token,
                    usuario: {
                        documento: usuarioRetrieved.id_user,
                        nombre: usuarioRetrieved.usuario,
                        apellidos: usuarioRetrieved.apellido,
                        rol: usuarioRetrieved.id_rol
                    }
                }
            };
        } catch (error) {
            console.error('Error en loginUser:', error);
            return {
                ok: false,
                status_cod: 401,
                data: 'Usuario o contraseña inválida'
            };
        }
    }
}

export default AuthService;
