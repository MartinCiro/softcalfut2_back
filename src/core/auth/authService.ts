import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { natsService } from 'src/lib/nats';
import { Injectable, Inject } from '@nestjs/common';
import { ResponseBody } from 'api/models/ResponseBody';
import { RedisService } from 'shared/cache/redis.service';
import AuthPort from './authPort';

@Injectable()
export default class AuthService {
    constructor(
        @Inject('AuthPort') private authPort: AuthPort,
        private readonly redisService: RedisService
    ) {}

    async loginUser({ documento, password }: { documento: string; password: string }): Promise<ResponseBody<any>> {
        try {
            const usuarioRetrieved = await this.authPort.retrieveUser({ documento });

            const isPasswordValid = new Usuario(
                usuarioRetrieved.documento,
                usuarioRetrieved.password,
                usuarioRetrieved.id_rol,
                usuarioRetrieved.estado,
                true
            ).comparePassword(password);

            if (!isPasswordValid) throw new Error('Usuario o contraseña inválida');

            const userCacheKey = `user:${usuarioRetrieved.documento}`;
            const eventKey = `event:usuario.logeado:${usuarioRetrieved.documento}`;

            // Revisar si el usuario ya está en cache
            const cachedUser = await this.redisService.get(userCacheKey);
            let userData;

            if (cachedUser) {
                userData = JSON.parse(cachedUser);
            } else {
                userData = {
                    doc: usuarioRetrieved.documento,
                    nombre: usuarioRetrieved.usuario,
                    id_rol: usuarioRetrieved.id_rol
                };
            
                const userDataWithPermissions = {
                    ...userData,
                    permisos: usuarioRetrieved.permisos
                };
            
                await this.redisService.set(userCacheKey, JSON.stringify(userDataWithPermissions));
            }

            // Generar siempre un nuevo JWT para el usuario
            const token = generateJWT(userData);
            // Verificar si el evento ya se publicó en Redis
            const eventExists = await this.redisService.get(eventKey);

            if (!eventExists) {
                await natsService.publish('usuario.logeado', {
                    ...userData,
                    rol: usuarioRetrieved.rol,
                    timestamp: new Date().toISOString()
                });

                // Marcar el evento como enviado en Redis
                await this.redisService.set(JSON.stringify(eventKey), 'true');
            }

            return {
                ok: true,
                statusCode: 200,
                result: {
                    token,
                    usuario: {
                        doc: userData.id_user,
                        nombre: userData.nombre,
                        rol: userData.rol
                    }
                }
            };
        } catch (error: any) {
            return {
                ok: false,
                statusCode: 401,
                result: error.data || 'Usuario o contraseña inválida'
            };
        }
    }
}
