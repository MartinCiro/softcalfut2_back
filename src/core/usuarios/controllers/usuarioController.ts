import { Request, Response } from 'express';
import UsuarioService from '../usuarioService';

import UsuariosAdapter from '../../../interfaces/db/usuarioAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const usuarioService = new UsuarioService(new UsuariosAdapter());

export const crearUsuarioController = async (req: Request, res: Response): Promise<void> => {
  const { email, nombres, pass, id_rol } = req.body;
  let { estado } = req.body;
  if (!validarBlank(nombres, "nombres.", res)) return;
  if (!validarBlank(email, "numero de identificacion.", res)) return;
  if (!validarBlank(email, "email.", res)) return;
  if (!validarBlank(pass, "contraseña.", res)) return;
  estado = estado ?? 1;

  try {
    const usuario = await usuarioService.crearUsuarios({ nombres,  email, pass, estado, id_rol});
    res.status(201).json(new ResponseBody(true, 201, "Se ha creado el usuario exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const obtenerUsuariosController = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const usuarios = !email ? await usuarioService.obtenerUsuarios() : await usuarioService.obtenerUsuarioXid({ email });
    res.status(201).json(new ResponseBody(true, 201, usuarios));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const delUsuarioController = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!validarBlank(email, "identificar de usuario", res)) return;

  try {
    const usuario = await usuarioService.delUsuario({ email });
    res.status(201).json(new ResponseBody(true, 201, "Se ha eliminado el usuario exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const upUsuarioController = async (req: Request, res: Response): Promise<void> => {
  const { email, nombres, pass, estado, id_rol } = req.body;

  if (!validarBlank(email, "identificar de usuario", res)) return;
  if (!nombres && !email && !email && !pass && !estado && !id_rol) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo: nombre o descripción"));
    return;
  }

  try {
    const usuario = await usuarioService.upUsuario({ nombres,  email, pass, estado, id_rol });
    res.status(201).json(new ResponseBody(true, 201, "Se ha actualizado el usuario exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
