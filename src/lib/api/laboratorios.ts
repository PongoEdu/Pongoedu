import { apiRequest } from "./http";
import type { LaboratorioRequest, LaboratorioResponse } from "./types";

export const laboratoriosApi = {
  criar(payload: LaboratorioRequest): Promise<LaboratorioResponse> {
    return apiRequest<LaboratorioResponse>("/laboratorios", { method: "POST", body: payload });
  },
  listar(): Promise<LaboratorioResponse[]> {
    return apiRequest<LaboratorioResponse[]>("/laboratorios");
  },
  buscar(id: number): Promise<LaboratorioResponse> {
    return apiRequest<LaboratorioResponse>(`/laboratorios/${id}`);
  },
  atualizar(id: number, payload: LaboratorioRequest): Promise<LaboratorioResponse> {
    return apiRequest<LaboratorioResponse>(`/laboratorios/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<void> {
    return apiRequest<void>(`/laboratorios/${id}`, { method: "DELETE" });
  },
};
