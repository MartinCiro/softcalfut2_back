import { Request, Response } from 'express';
import EstadoService from '../estadoService';

import EstadosAdapter from '../../../interfaces/db/estadoAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const estadoService = new EstadoService(new EstadosAdapter());

export const crearEstadoController = async (req: Request, res: Response): Promise<void> => {
  const { nombre, descripcion } = req.body;

  if (!validarBlank(nombre, "nombre", res)) return;
  if (!validarBlank(descripcion, "descripción", res)) return;

  try {
    const estado = await estadoService.crearEstados({ nombre, descripcion });
    res.status(201).json(new ResponseBody(true, 201, "Se ha creado el estado exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};


export const obtenerEstadosController = async (req: Request, res: Response): Promise<void> => {
  const { id_estado } = req.body;

  try {
    const estados = !id_estado ? await estadoService.obtenerEstados() : await estadoService.obtenerEstadoXid({ id_estado });
    res.status(201).json(new ResponseBody(true, 201, estados));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const delEstadoController = async (req: Request, res: Response): Promise<void> => {
  const { id_estado } = req.body;

  if (!validarBlank(id_estado, "identificar de estado", res)) return;

  try {
    const estado = await estadoService.delEstado({ id_estado });
    res.status(201).json(new ResponseBody(true, 201, "Se ha eliminado el estado exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const upEstadoController = async (req: Request, res: Response): Promise<void> => {
  const { id_estado, nombre, descripcion } = req.body;

  if (!validarBlank(id_estado, "identificar de estado", res)) return;
  if (!nombre && !descripcion) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo: nombre o descripción"));
    return;
  }

  try {
    const estado = await estadoService.upEstado({ id_estado, descripcion, nombre });
    res.status(201).json(new ResponseBody(true, 201, "Se ha actualizado el estado exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
