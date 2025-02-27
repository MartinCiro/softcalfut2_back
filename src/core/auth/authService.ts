import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { connectToNATS } from '../../lib/nats';

import { Injectable, Inject } from '@nestjs/common';
import AuthPort from './authPort';

@Injectable() 
export default class AuthService {
    constructor(
        @Inject('AuthPort') private authPort: AuthPort
      ) {}

    async loginUser(user: Usuario): Promise<{ ok: boolean; status_cod: number; data: any }> {
        try {
            const usuarioRetrieved = await this.authPort.retrieveUser({ email: user.email });
            if (!usuarioRetrieved) throw new Error('Usuario o contraseña inválida');

            const token = generateJWT({ 
                id_user: usuarioRetrieved.id_user, 
                nombre: usuarioRetrieved.usuario, 
                id_rol: usuarioRetrieved.id_rol 
            });

            const nc = await connectToNATS();
            nc.publish('usuario.logeado', JSON.stringify({ 
                id_user: usuarioRetrieved.id_user, 
                usuario: usuarioRetrieved.usuario, 
                timestamp: new Date().toISOString() 
            }));

            return {
                ok: true,
                status_cod: 200,
                data: {
                    token,
                    usuario: {
                        email: usuarioRetrieved.id_user,
                        nombre: usuarioRetrieved.usuario,
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
