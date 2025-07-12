import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import config from 'src/config';
import  AuthAdapter  from 'db/authAdapter';
import AuthService from 'core/auth/authService';
import { AuthPort } from 'api/auth/auth-port.token';
import { CacheModule } from 'shared/cache/cache.module';
import { AuthController } from 'api/auth/authController';
import { JwtAuthService } from 'core/auth/service/jwt.service';

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
