// src/modules/roles/controllers/roleController.ts

import { Request, Response } from 'express';
import RoleService from '../roleService'; 

import RoleAdapter from '../../../interfaces/db/roleAdapter';  

// Instanciamos el servicio con la implementación concreta de RolePort (RoleAdapter)
const roleService = new RoleService(new RoleAdapter());

// Controlador para crear un rol
export const crearRolController = async (req: Request, res: Response) => {
  try {
    const roleData = req.body;  // Obtenemos los datos del cuerpo de la solicitud
    const role = await roleService.crearRol(roleData);
    res.status(201).json(role);  // Respondemos con el rol creado
  } catch (error) {
    error instanceof Error ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'Unknown error' });
  }
};

// Controlador para obtener roles
export const obtenerRolesController = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.obtenerRoles();
    res.status(200).json(roles);  // Respondemos con la lista de roles
  } catch (error) {
    error instanceof Error ? res.status(500).json({ error: error.message }) : res.status(500).json({ error: 'Unknown error' });
  }
};
