// src/modules/roles/controllers/roleController.ts

import { Request, Response } from 'express';
import RoleService from '../roleService'; 

import RoleAdapter from '../../../interfaces/db/roleAdapter'; 

import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

// Instanciamos el servicio con la implementación concreta de RolePort (RoleAdapter)
const roleService = new RoleService(new RoleAdapter());

// Controlador para crear un rol
export const crearRolController = async (req: Request, res: Response): Promise<void> => {
  const { nombre, descripcion } = req.body;
  let { estado } = req.body

  if (!validarBlank(nombre, "nombre", res)) return;
  if (!validarBlank(descripcion, "descripción", res)) return;
  estado = estado ?? 1;

  try {
    const rols = await roleService.crearRol({ nombre, descripcion, estado });
    res.status(201).json(new ResponseBody(true, 201, "Se ha creado el rol exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

// Controlador para obtener roles
export const obtenerRolController = async (req: Request, res: Response): Promise<void> => {
  const { id_rol } = req.body;

  try {
    const rols = !id_rol ? await roleService.obtenerRol() : await roleService.obtenerRolXid({ id_rol });
    res.status(201).json(new ResponseBody(true, 201, rols));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const delRolController = async (req: Request, res: Response): Promise<void> => {
  const { id_rol } = req.body;

  if (!validarBlank(id_rol, "identificar de rol", res)) return;

  try {
    const rol = await roleService.delRol({ id_rol });
    res.status(201).json(new ResponseBody(true, 201, "Se ha eliminado el rol exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const upRolController = async (req: Request, res: Response): Promise<void> => {
  const { id_rol, nombre, descripcion, estado } = req.body;

  if (!validarBlank(id_rol, "identificar de rol", res)) return;
  if (!nombre && !descripcion && !estado) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo: nombre o descripción"));
    return;
  }

  try {
    const rol = await roleService.upRol({ id_rol, descripcion, nombre, estado });
    res.status(201).json(new ResponseBody(true, 201, "Se ha actualizado el rol exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      if ((error as any).result) res.status((error as any).statusCode || 500).json(new ResponseBody(false, (error as any).statusCode || 500, (error as any).result));

      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

