import { Response } from 'express';
import { ResponseBody } from '../models/ResponseBody';  

export const validarBlank = (valor: any, nombre: string, res: Response): boolean => {
  if (!valor) {
    res.status(400).json(new ResponseBody(false, 400, `No se ha proporcionado ${nombre}`));
    return false;
  }
  return true;
};

export const validarString = (valor: any, nombre: string, res: Response): boolean => {
  if (typeof valor !== 'string') {
    res.status(400).json(new ResponseBody(false, 400, `${nombre} debe ser de tipo string`));
    return false;
  }
  return true;
};

export const validarNumber = (valor: any, nombre: string, res: Response): boolean => {
  if (typeof valor !== 'number') {
    res.status(400).json(new ResponseBody(false, 400, `${nombre} debe ser de tipo number`));
    return false;
  }
  return true;
};

//metodos para validar si existe y otros
export const validarExistente = (valor: string, nombre: string): { ok: boolean, result?: string } => {
  if (valor === '23505') return { ok: false, result: `${nombre} ya existe en la base de datos` }
  return { ok: true };
};
