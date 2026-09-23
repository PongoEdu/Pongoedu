import { apiRequest } from "./http";
import type { ProdutoRequest, ProdutoResponse } from "./types";

export interface ListarProdutosParams {
  nome?: string;
  categoriaId?: number;
  somenteDisponiveis?: boolean;
}

export const produtosApi = {
  criar(payload: ProdutoRequest): Promise<ProdutoResponse> {
    return apiRequest<ProdutoResponse>("/produtos", { method: "POST", body: payload });
  },
  listar(params: ListarProdutosParams = {}): Promise<ProdutoResponse[]> {
    return apiRequest<ProdutoResponse[]>("/produtos", { query: params });
  },
  estoqueBaixo(): Promise<ProdutoResponse[]> {
    return apiRequest<ProdutoResponse[]>("/produtos/estoque-baixo");
  },
  proximosVencimento(): Promise<ProdutoResponse[]> {
    return apiRequest<ProdutoResponse[]>("/produtos/proximos-vencimento");
  },
  emprestaveis(): Promise<ProdutoResponse[]> {
    return apiRequest<ProdutoResponse[]>("/produtos/emprestaveis");
  },
  buscar(id: number): Promise<ProdutoResponse> {
    return apiRequest<ProdutoResponse>(`/produtos/${id}`);
  },
  atualizar(id: number, payload: ProdutoRequest): Promise<ProdutoResponse> {
    return apiRequest<ProdutoResponse>(`/produtos/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<ProdutoResponse> {
    return apiRequest<ProdutoResponse>(`/produtos/${id}`, { method: "DELETE" });
  },
};
