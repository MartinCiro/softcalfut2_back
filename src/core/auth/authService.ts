import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { natsService } from '../../lib/nats';

import { Injectable, Inject } from '@nestjs/common';
import AuthPort from './authPort';
import { ResponseBody } from '../../interfaces/api/models/ResponseBody';
import { RedisService } from '../../shared/cache/redis.service';

@Injectable() 
export default class AuthService {
    constructor(
        @Inject('AuthPort') private authPort: AuthPort,
        private readonly redisService: RedisService 
      ) {}

      async loginUser({ id, password }: { id: string; password: string }): Promise<ResponseBody<any>> {
        try {
            const usuarioRetrieved = await this.authPort.retrieveUser({ id });
            const isPasswordValid = new Usuario(
                usuarioRetrieved.id_user,
                usuarioRetrieved.password, 
                usuarioRetrieved.id_rol,
                usuarioRetrieved.estado
            ).comparePassword(password);

            if (!isPasswordValid) throw new Error('Usuario o contraseña inválida');
            
            // Generar el JWT
            const token = generateJWT({ 
                id_user: usuarioRetrieved.id_user, 
                nombre: usuarioRetrieved.usuario, 
                id_rol: usuarioRetrieved.id_rol
            });
            // Publicar el evento
            await natsService.publish('usuario.logeado', { 
                id_user: usuarioRetrieved.id_user, 
                usuario: usuarioRetrieved.usuario,
                id_rol: usuarioRetrieved.id_rol,
                rol: usuarioRetrieved.rol,
                permisos: usuarioRetrieved.permisos,  
                timestamp: new Date().toISOString() 
            });
            const userCacheKey = `user:${usuarioRetrieved.id_user}`;

            // Guardamos el usuario en Redis por 1 hora (3600 segundos)
            await this.redisService.set(userCacheKey, {
                id_user: usuarioRetrieved.id_user,
                nombre: usuarioRetrieved.usuario,
                id_rol: usuarioRetrieved.id_rol,
                permisos: usuarioRetrieved.permisos,
            });
            return {
                ok: true,
                statusCode: 200,
                result: {
                    token,
                    usuario: {
                        id: usuarioRetrieved.id_user,
                        nombre: usuarioRetrieved.usuario,
                        rol: usuarioRetrieved.id_rol
                    }
                }
            };
        } catch (error) {
            return {
                ok: false,
                statusCode: 401,
                result: 'Usuario o contraseña inválida'
            };
        }
    }
    
}
