import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import AuthService from 'core/auth/authService';
import { AuthDto } from './dtos/auth.dto';
import { ResponseBody } from 'api/models/ResponseBody';
import { Cookies } from 'core/auth/decorators/cookies.decorator';
import config from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseBody<any>> {
    const { documento, enpass: password } = body;

    if (!documento || !password) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Usuario y contraseña son obligatorios"),
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const auth = await this.authService.loginUser({ documento, password });

      // Configurar refreshToken como cookie HttpOnly
      res.cookie('refreshToken', auth.result.refreshToken, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      // Eliminar refreshToken de la respuesta JSON
      const { refreshToken, ...responseData } = auth.result;

      return new ResponseBody(auth.ok, auth.statusCode, responseData);
    } catch (error: any) {
      console.log(error);
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';
        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }
      throw new HttpException(
        new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refresh')
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseBody<any>> {
    if (!refreshToken) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.UNAUTHORIZED, 'Refresh token no proporcionado'),
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken);

      // Actualizar cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: config.env !== 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return new ResponseBody(true, HttpStatus.OK, { accessToken });
    } catch (error) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.UNAUTHORIZED, 'Sesión expirada, por favor inicie sesión nuevamente'),
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}