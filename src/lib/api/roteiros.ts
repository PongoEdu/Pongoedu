import { apiRequest } from "./http";
import type { RoteiroRequest, RoteiroResponse, SugestaoIaRequest, SugestaoIaResponse } from "./types";

export const roteirosApi = {
  criar(payload: RoteiroRequest): Promise<RoteiroResponse> {
    return apiRequest<RoteiroResponse>("/roteiros", { method: "POST", body: payload });
  },
  sugestaoIa(payload: SugestaoIaRequest): Promise<SugestaoIaResponse> {
    return apiRequest<SugestaoIaResponse>("/roteiros/sugestao-ia", { method: "POST", body: payload });
  },
  listar(somentePublicados?: boolean): Promise<RoteiroResponse[]> {
    return apiRequest<RoteiroResponse[]>("/roteiros", { query: { somentePublicados } });
  },
  buscar(id: number): Promise<RoteiroResponse> {
    return apiRequest<RoteiroResponse>(`/roteiros/${id}`);
  },
  atualizar(id: number, payload: RoteiroRequest): Promise<RoteiroResponse> {
    return apiRequest<RoteiroResponse>(`/roteiros/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<void> {
    return apiRequest<void>(`/roteiros/${id}`, { method: "DELETE" });
  },
};
