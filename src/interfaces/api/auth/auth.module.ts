import { Module } from '@nestjs/common';
import AuthService from '@core/auth/authService';
import { AuthController } from '@api/auth/authController';

import  AuthAdapter  from '@db/authAdapter';
import { AuthPort } from '@api/auth/auth-port.token';
import { CacheModule } from '@shared/cache/cache.module';


@Module({
  imports: [
    CacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: config.JWT_SECRETO,
        signOptions: {
          expiresIn: config.ACCESS_EXPIRES_IN
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthService,
    {
      provide: AuthPort, 
      useClass: AuthAdapter   
    }
  ],
  exports: [AuthService, JwtAuthService]
})
export class AuthModule {}
