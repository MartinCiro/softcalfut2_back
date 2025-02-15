import { Request, Response } from 'express';
import UsuarioService from '../usuarioService';

import UsuariosAdapter from '../../../interfaces/db/usuarioAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const usuarioService = new UsuarioService(new UsuariosAdapter());

export const crearUsuarioController = async (req: Request, res: Response): Promise<void> => {
  const { documento, nombres, apellido, email, info_perfil, num_contacto, pass, id_rol, fecha_nacimiento } = req.body;
  let { estado } = req.body;
  if (!validarBlank(nombres, "nombres.", res)) return;
  if (!validarBlank(apellido, "apellidos.", res)) return;
  if (!validarBlank(documento, "numero de identificacion.", res)) return;
  if (!validarBlank(email, "correo.", res)) return;
  if (!validarBlank(num_contacto, "numero de telefono.", res)) return;
  if (!validarBlank(pass, "contraseña.", res)) return;
  if (!validarBlank(fecha_nacimiento, "fecha de nacimiento.", res)) return;
  estado = estado ?? 1;

  try {
    const usuario = await usuarioService.crearUsuarios({ documento, nombres, apellido, email, info_perfil, num_contacto, pass, estado, id_rol, fecha_nacimiento });
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
  const { documento } = req.body;

  try {
    const usuarios = !documento ? await usuarioService.obtenerUsuarios() : await usuarioService.obtenerUsuarioXid({ documento });
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
  const { documento } = req.body;

  if (!validarBlank(documento, "identificar de usuario", res)) return;

  try {
    const usuario = await usuarioService.delUsuario({ documento });
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
  const { documento, nombres, apellido, email, info_perfil, num_contacto, pass, estado, id_rol, fecha_nacimiento } = req.body;

  if (!validarBlank(documento, "identificar de usuario", res)) return;
  if (!nombres && !apellido && !documento && !email && !info_perfil && !num_contacto && !pass && !estado && !id_rol && !fecha_nacimiento) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo: nombre o descripción"));
    return;
  }

  try {
    const usuario = await usuarioService.upUsuario({ documento, nombres, apellido, email, info_perfil, num_contacto, pass, estado, id_rol, fecha_nacimiento });
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
