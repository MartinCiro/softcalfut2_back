export interface ProgramacionData {
  rama: string;
  fechaEncuentro: Date | string;
  lugarEncuentro: number;
  cronogramaJuego: string;
  equipoLocal: number;
  equipoVisitante: number;
  torneo: number;
}

export interface ProgramacionDataXid {
  id: number | string;
}

export type ProgramacionDataUpdate = Partial<Omit<ProgramacionData, 'id'>> & ProgramacionDataXid;