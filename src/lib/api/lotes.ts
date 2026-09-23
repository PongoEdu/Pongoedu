import { apiRequest } from "./http";
import type { LoteRequest, LoteResponse } from "./types";

export const lotesApi = {
  criar(payload: LoteRequest): Promise<LoteResponse> {
    return apiRequest<LoteResponse>("/lotes", { method: "POST", body: payload });
  },
  listar(): Promise<LoteResponse[]> {
    return apiRequest<LoteResponse[]>("/lotes");
  },
  vencidos(): Promise<LoteResponse[]> {
    return apiRequest<LoteResponse[]>("/lotes/vencidos");
  },
  aVencer(dias = 30): Promise<LoteResponse[]> {
    return apiRequest<LoteResponse[]>("/lotes/a-vencer", { query: { dias } });
  },
  buscar(id: number): Promise<LoteResponse> {
    return apiRequest<LoteResponse>(`/lotes/${id}`);
  },
  atualizar(id: number, payload: LoteRequest): Promise<LoteResponse> {
    return apiRequest<LoteResponse>(`/lotes/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<void> {
    return apiRequest<void>(`/lotes/${id}`, { method: "DELETE" });
  },
};
