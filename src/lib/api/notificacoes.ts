import { apiRequest } from "./http";
import type { NotificacaoResponse } from "./types";

export const notificacoesApi = {
  minhas(): Promise<NotificacaoResponse[]> {
    return apiRequest<NotificacaoResponse[]>("/notificacoes/minhas");
  },
};
