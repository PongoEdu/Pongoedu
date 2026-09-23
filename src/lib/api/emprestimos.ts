import { apiRequest } from "./http";
import type { EmprestimoRequest, EmprestimoResponse, SituacaoEmprestimo } from "./types";

export const emprestimosApi = {
  solicitar(payload: EmprestimoRequest): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>("/emprestimos", { method: "POST", body: payload });
  },
  listar(situacao?: SituacaoEmprestimo): Promise<EmprestimoResponse[]> {
    return apiRequest<EmprestimoResponse[]>("/emprestimos", { query: { situacao } });
  },
  buscar(id: number): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>(`/emprestimos/${id}`);
  },
  aprovar(id: number, observacao?: string): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>(`/emprestimos/${id}/aprovar`, {
      method: "POST",
      query: { observacao },
    });
  },
  recusar(id: number, observacao?: string): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>(`/emprestimos/${id}/recusar`, {
      method: "POST",
      query: { observacao },
    });
  },
  registrarRetirada(id: number): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>(`/emprestimos/${id}/retirada`, { method: "POST" });
  },
  registrarDevolucao(id: number, ocorrencia?: string): Promise<EmprestimoResponse> {
    return apiRequest<EmprestimoResponse>(`/emprestimos/${id}/devolucao`, {
      method: "POST",
      body: { ocorrencia: ocorrencia ?? null },
    });
  },
};
