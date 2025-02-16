import { Request, Response } from 'express';
import RolxPermisoService from '../rolXpermisoService';

import RolxPermisosAdapter from '../../../interfaces/db/rolXpermisoAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const rolXpermisoService = new RolxPermisoService(new RolxPermisosAdapter());

export const crearRolxPermisoController = async (req: Request, res: Response): Promise<void> => {
  const { id_rol, id_permiso } = req.body;

  if (!validarBlank(id_rol, "id del rol", res)) return;
  id_permiso.length == 0 ? res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un permiso")) : null;

  try {
    const rolXpermiso = await rolXpermisoService.crearRolxPermisos({ id_rol, id_permiso });
    res.status(201).json(new ResponseBody(rolXpermiso.ok || true, rolXpermiso.status_cod || 201, "Se han asignado los permisos al rol exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const obtenerRolxPermisosController = async (req: Request, res: Response): Promise<void> => {
  const { id_rol } = req.body;

  try {
    const rolXpermisos = !id_rol ? await rolXpermisoService.obtenerRolxPermisos() : await rolXpermisoService.obtenerRolxPermisoXid({ id_rol });
    res.status(201).json(new ResponseBody(true, 201, rolXpermisos));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
