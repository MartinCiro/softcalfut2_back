export interface ProgramacionData {
  rama: string;
  fechaEncuentro: Date | string;
  lugarEncuentro: number;
  nombreCompetencia: string;
  equipoLocal: number;
  equipoVisitante: number;
}

export interface ProgramacionDataXid {
  id: number | string;
}

export type ProgramacionDataUpdate = Partial<Omit<ProgramacionData, 'id'>> & ProgramacionDataXid;