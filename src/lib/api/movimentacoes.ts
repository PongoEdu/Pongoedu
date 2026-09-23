import { apiRequest } from "./http";
import type { AjusteEstoqueRequest, MovimentacaoResponse, TipoMovimentacao } from "./types";

export interface ListarMovimentacoesParams {
  produtoId?: number;
  tipo?: TipoMovimentacao;
  inicio?: string;
  fim?: string;
}

export const movimentacoesApi = {
  listar(params: ListarMovimentacoesParams = {}): Promise<MovimentacaoResponse[]> {
    return apiRequest<MovimentacaoResponse[]>("/movimentacoes", { query: params });
  },
  ajustar(payload: AjusteEstoqueRequest): Promise<MovimentacaoResponse> {
    return apiRequest<MovimentacaoResponse>("/movimentacoes/ajuste", { method: "POST", body: payload });
  },
};
