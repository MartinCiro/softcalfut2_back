import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { Usuario } from '../../../core/auth/entities/Usuario';
import { ResponseBody } from '../models/ResponseBody';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto): Promise<ResponseBody> {
    const { email, enpass: password } = authDto;

    if (!email || !password) {
      throw new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, "Email y contraseña son obligatorios"), HttpStatus.BAD_REQUEST);
    }

    const user = new Usuario(email, password);

    try {
      const auth = await this.authService.loginUser(user);
      return new ResponseBody(auth.ok, auth.status_cod, auth.data);
    } catch (error) {
      if (typeof error === "object" && error !== null && "status_cod" in error) {
        throw new HttpException(new ResponseBody(error.ok, error.status_cod, error.data), error.status_cod);
      }
      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
