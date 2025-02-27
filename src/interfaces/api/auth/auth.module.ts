import { Module } from '@nestjs/common';
import AuthService from '../../../core/auth/authService';
import { AuthController } from './authController';

import  AuthAdapter  from '../../db/authAdapter';
import { AuthPort } from './auth-port.token';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AuthPort, 
      useClass: AuthAdapter,   
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
