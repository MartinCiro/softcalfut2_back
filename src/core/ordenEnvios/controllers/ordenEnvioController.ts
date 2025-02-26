import { Request, Response } from 'express';
import OrdenEnvioService from '../ordenEnvioService';

import OrdenEnviosAdapter from '../../../interfaces/db/ordenEnvioAdapter';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { validarBlank } from '../../../interfaces/api/utils/validaciones';

const ordenEnvioService = new OrdenEnvioService(new OrdenEnviosAdapter());

export const crearOrdenEnvioController = async (req: Request, res: Response): Promise<void> => {
  const { id_remitente, id_destinatario, id_transportista, direccion, peso, dimensiones, contenido, tipo_envio, fecha_envio } = req.body;

  if (!validarBlank(id_remitente, "el email del remitente", res)) return;
  if (!validarBlank(direccion, "la direccion", res)) return;
  if (!validarBlank(peso, "el peso", res)) return;
  if (!validarBlank(dimensiones, "las dimensiones", res)) return;
  if (!validarBlank(contenido, "el contenido", res)) return;
  if (!validarBlank(tipo_envio, "el tipo de envio", res)) return;
  if (!validarBlank(id_transportista, "el email del transportista", res)) return;
  

  try {
    const ordenEnvio = await ordenEnvioService.crearOrdenEnvios({ id_remitente, id_destinatario, id_transportista, direccion, peso, dimensiones, contenido, tipo_envio, fecha_envio });
    res.status(201).json(new ResponseBody(ordenEnvio.ok, 201, "Se ha creado el ordenEnvio exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const obtenerOrdenEnviosController = async (req: Request, res: Response): Promise<void> => {
  const { id_ordenEnvio } = req.body;

  try {
    const ordenEnvios = !id_ordenEnvio ? await ordenEnvioService.obtenerOrdenEnvios() : await ordenEnvioService.obtenerOrdenEnvioXid({ id_ordenEnvio });
    res.status(201).json(new ResponseBody(true, 201, ordenEnvios));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const delOrdenEnvioController = async (req: Request, res: Response): Promise<void> => {
  const { id_ordenEnvio } = req.body;

  if (!validarBlank(id_ordenEnvio, "identificar de ordenEnvio", res)) return;

  try {
    const ordenEnvio = await ordenEnvioService.delOrdenEnvio({ id_ordenEnvio });
    res.status(201).json(new ResponseBody(true, 201, "Se ha eliminado el ordenEnvio exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};

export const upOrdenEnvioController = async (req: Request, res: Response): Promise<void> => {
  const { id_ordenEnvio, id_remitente, id_destinatario, id_transportista, direccion, peso, dimensiones, contenido, tipo_envio, fecha_envio } = req.body;

  if (!validarBlank(id_ordenEnvio, "identificar de ordenEnvio", res)) return;
  if (!id_remitente && !id_destinatario && !id_transportista && !direccion && !peso && !dimensiones && !contenido && !tipo_envio && !fecha_envio) {
    res.status(400).json(new ResponseBody(false, 400, "Debe proporcionar al menos un campo a actualizar"));
    return;
  }

  try {
    const ordenEnvio = await ordenEnvioService.upOrdenEnvio({ id_ordenEnvio, id_remitente, id_destinatario, id_transportista, direccion, peso, dimensiones, contenido, tipo_envio, fecha_envio });
    res.status(201).json(new ResponseBody(true, 201, "Se ha actualizado el ordenEnvio exitosamente"));
  } catch (error) {
    if (typeof error === "object" && error !== null && "status_cod" in error) {
      const err = error as { ok: boolean; status_cod: number; data: any };
      res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
    } else {
      res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
    }
  }
};
