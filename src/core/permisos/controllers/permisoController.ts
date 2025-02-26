import { Request, Response } from 'express';
import PermisoService from '../permisoService';

import PermisosAdapter from '../../../interfaces/db/permisoAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const permisoService = new PermisoService(new PermisosAdapter());

export const crearPermisoController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion } = req.body;

    if (!validarBlank(nombre, "nombre", res)) return;
    if (!validarBlank(descripcion, "descripción", res)) return;

    const permiso = await permisoService.crearPermisos({ nombre, descripcion });
    res.status(201).json(new ResponseBody(permiso.ok, permiso.status_cod, "Se ha creado el permiso exitosamente"));

  } catch (error) {
    console.error("Error en crearPermisoController:", error);

    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};


export const obtenerPermisosController = async (req: Request, res: Response): Promise<void> => {
  const { id_permiso } = req.body;

  try {
    const permisos = !id_permiso ? await permisoService.obtenerPermisos() : await permisoService.obtenerPermisoXid({ id_permiso });
    res.status(201).json(new ResponseBody(true, 201, permisos));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
      return;
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
      return;
    }
  }
};

export const delPermisoController = async (req: Request, res: Response): Promise<void> => {
  const { id_permiso } = req.body;

  if (!validarBlank(id_permiso, "identificar de permiso", res)) return;

  try {
    const permiso = await permisoService.delPermiso({ id_permiso });
    res.status(201).json(new ResponseBody(true, 201, "Se ha eliminado el permiso exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const upPermisoController = async (req: Request, res: Response): Promise<void> => {
  const { id_permiso, nombre, descripcion } = req.body;

  if (!validarBlank(id_permiso, "identificar de permiso", res)) return;
  if (!nombre && !descripcion) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo: nombre o descripción"));
    return;
  }

  try {
    const permiso = await permisoService.upPermiso({ id_permiso, descripcion, nombre });
    res.status(201).json(new ResponseBody(true, 201, "Se ha actualizado el permiso exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
