import { apiRequest } from "./http";
import type { SituacaoAgendamento } from "./types";

export interface OcupacaoPublica {
  data: string;
  horaInicio: string;
  horaFim: string;
  situacao: SituacaoAgendamento;
}

export const agendaPublicaApi = {
  /** Ocupação do laboratório no período (sem login e sem dados pessoais). */
  ocupacao(inicio: string, fim: string): Promise<OcupacaoPublica[]> {
    return apiRequest<OcupacaoPublica[]>("/agenda-publica", { query: { inicio, fim }, auth: false });
  },
};
