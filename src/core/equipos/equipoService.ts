import { Injectable, Inject } from '@nestjs/common';
import EquiposPort from './equipoPort';

// Base interface for common person properties
interface PersonaBase {
  documento: string;
  nombres: string;
}

// Extended interfaces
export interface UsuarioEquipo extends PersonaBase {
  apellido: string;
  estado?: {
    nombre: string;
  };
}

export interface JugadorEquipo extends PersonaBase {
  apellido: string;
  estado: string;
}

export interface RepresentanteEquipo extends PersonaBase {
  estado: string;
}

export interface EquipoCompleto {
  id: number;
  nom_equipo: string;
  representante: RepresentanteEquipo;
  jugadores: JugadorEquipo[];
}

// Interfaces para la creación/actualización
interface EquipoData {
  nom_equipo: string; 
  encargado: string;
  categoria: string; 
  jugadores?: (number | string)[];
}

// No changes needed here as it's already optimized
type EquipoDataUpdate = Partial<Omit<EquipoData, 'id'>> & { id: string | number };

@Injectable() 
export class EquipoService {
  constructor(
    @Inject('EquiposPort') private equipoPort: EquiposPort
  ) {}

  async obtenerEquipos(): Promise<EquipoCompleto[]> {
    return await this.equipoPort.obtenerEquipos();
  }

  async crearEquipo(equipoData: EquipoData) {
    return await this.equipoPort.crearEquipos(equipoData);
  }

  async upEquipo(equipoData: EquipoDataUpdate) {
    return await this.equipoPort.actualizaEquipo(equipoData);
  }
}