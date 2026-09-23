import { apiRequest } from "./http";
import type { AgendamentoRequest, AgendamentoResponse, DisponibilidadeResponse } from "./types";

export const agendamentosApi = {
  criar(payload: AgendamentoRequest): Promise<AgendamentoResponse> {
    return apiRequest<AgendamentoResponse>("/agendamentos", { method: "POST", body: payload });
  },
  listar(): Promise<AgendamentoResponse[]> {
    return apiRequest<AgendamentoResponse[]>("/agendamentos");
  },
  porPeriodo(inicio: string, fim: string): Promise<AgendamentoResponse[]> {
    return apiRequest<AgendamentoResponse[]>("/agendamentos/periodo", { query: { inicio, fim } });
  },
  disponibilidade(laboratorioId: number, data: string): Promise<DisponibilidadeResponse> {
    return apiRequest<DisponibilidadeResponse>("/agendamentos/disponibilidade", {
      query: { laboratorioId, data },
    });
  },
  atualizar(id: number, payload: AgendamentoRequest): Promise<AgendamentoResponse> {
    return apiRequest<AgendamentoResponse>(`/agendamentos/${id}`, { method: "PUT", body: payload });
  },
  cancelar(id: number): Promise<AgendamentoResponse> {
    return apiRequest<AgendamentoResponse>(`/agendamentos/${id}/cancelar`, { method: "POST" });
  },
};
