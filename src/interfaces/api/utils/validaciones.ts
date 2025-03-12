
import { ResponseBody } from '../models/ResponseBody';  
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export const validarBlank = (valor: any, nombre: string): void => {
  if (!valor) {
    throw new HttpException(`No se ha proporcionado ${nombre}`, HttpStatus.BAD_REQUEST);
  }
};

//metodos para validar si existe y otros
export const validarExistente = (valor: string, nombre: string): { ok: boolean, data?: string } => {
  if (valor === 'P2002') return { ok: false, data: `${nombre} ya existe en la base de datos` }
  return { ok: true };
};

export const validarNoExistente = (valor: string, nombre: string | number) => {
  if (valor === '23503') return {
      ok: false,
      status_cod: 400,
      data: `${nombre} no existe en la base de datos`
    };
  return { ok: true };
};

