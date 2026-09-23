import { apiRequest } from "./http";
import type { SituacaoSolicitacaoCompra, SolicitacaoCompraResponse } from "./types";

export const solicitacoesCompraApi = {
  listar(situacao?: SituacaoSolicitacaoCompra): Promise<SolicitacaoCompraResponse[]> {
    return apiRequest<SolicitacaoCompraResponse[]>("/solicitacoes-compra", { query: { situacao } });
  },
  buscar(id: number): Promise<SolicitacaoCompraResponse> {
    return apiRequest<SolicitacaoCompraResponse>(`/solicitacoes-compra/${id}`);
  },
  atender(id: number, observacao?: string): Promise<SolicitacaoCompraResponse> {
    return apiRequest<SolicitacaoCompraResponse>(`/solicitacoes-compra/${id}/atender`, {
      method: "POST",
      body: { observacao: observacao ?? null },
    });
  },
  recusar(id: number, observacao?: string): Promise<SolicitacaoCompraResponse> {
    return apiRequest<SolicitacaoCompraResponse>(`/solicitacoes-compra/${id}/recusar`, {
      method: "POST",
      body: { observacao: observacao ?? null },
    });
  },
};
