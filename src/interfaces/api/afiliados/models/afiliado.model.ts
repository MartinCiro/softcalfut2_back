export interface AfiliadoData {
  equipo: number | string;
  lugar_entrenamiento: number | string;
  estado?: number | string;
  logo?: string;
}

export interface AfiliadoDataXid {
  id: number | string;
}

export type AfiliadoDataUpdate = Partial<Omit<AfiliadoData, 'id'>> & AfiliadoDataXid;
