export interface NotaData {
  nombre: string;
  descripcion?: string;
}

export interface NotaDataXid {
  id: number | string;
}

export type NotaDataUpdate = Partial<Omit<NotaData, 'id'>> & NotaDataXid;
