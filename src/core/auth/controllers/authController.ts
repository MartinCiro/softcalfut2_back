import { Request, Response } from 'express';
import AuthService from '../authService';

import AuthAdapter from '../../../interfaces/db/authAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';
import { Usuario } from '../../../core/auth/entities/Usuario';
const authService = new AuthService(new AuthAdapter());


export const loginAPI = async (req: Request, res: Response): Promise<void> => {
  const { documento, enpass: password } = req.body;
  if (!validarBlank(documento, "el identificador de usuario", res)) return;
  if (!validarBlank(password, "contraseña", res)) return;
  
  const user = new Usuario(documento, password);
    
  try {
    const auth = await authService.loginUser(user);
    res.status(201).json(new ResponseBody(auth.ok, auth.status_cod, auth.data));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
