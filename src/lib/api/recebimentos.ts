import { apiRequest } from "./http";
import type { RecebimentoRequest, RecebimentoResponse } from "./types";

export const recebimentosApi = {
  criar(payload: RecebimentoRequest): Promise<RecebimentoResponse> {
    return apiRequest<RecebimentoResponse>("/recebimentos", { method: "POST", body: payload });
  },
  listar(): Promise<RecebimentoResponse[]> {
    return apiRequest<RecebimentoResponse[]>("/recebimentos");
  },
  buscar(id: number): Promise<RecebimentoResponse> {
    return apiRequest<RecebimentoResponse>(`/recebimentos/${id}`);
  },
};
