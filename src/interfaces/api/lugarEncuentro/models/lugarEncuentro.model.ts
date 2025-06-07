export interface LugarEncuentroData {
  nombre: string;
  direccion?: string;
}

export interface LugarEncuentroDataXid {
  id: number | string;
}

export type LugarEncuentroDataUpdate = Partial<Omit<LugarEncuentroData, 'id'>> & LugarEncuentroDataXid;
