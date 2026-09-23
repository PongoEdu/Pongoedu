import { apiRequest } from "./http";
import type { AtualizarItemPreparacaoRequest, PreparacaoResponse } from "./types";

export const preparacoesApi = {
  iniciar(agendamentoId: number): Promise<PreparacaoResponse> {
    return apiRequest<PreparacaoResponse>(`/preparacoes/agendamentos/${agendamentoId}`, {
      method: "POST",
    });
  },
  listar(): Promise<PreparacaoResponse[]> {
    return apiRequest<PreparacaoResponse[]>("/preparacoes");
  },
  buscarPorAgendamento(agendamentoId: number): Promise<PreparacaoResponse> {
    return apiRequest<PreparacaoResponse>(`/preparacoes/agendamentos/${agendamentoId}`);
  },
  atualizarItem(
    preparacaoId: number,
    itemId: number,
    payload: AtualizarItemPreparacaoRequest
  ): Promise<PreparacaoResponse> {
    return apiRequest<PreparacaoResponse>(`/preparacoes/${preparacaoId}/itens/${itemId}`, {
      method: "PUT",
      body: payload,
    });
  },
  concluir(preparacaoId: number): Promise<PreparacaoResponse> {
    return apiRequest<PreparacaoResponse>(`/preparacoes/${preparacaoId}/concluir`, { method: "POST" });
  },
};
