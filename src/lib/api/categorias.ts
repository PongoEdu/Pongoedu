import { apiRequest } from "./http";
import type { CategoriaRequest, CategoriaResponse } from "./types";

export const categoriasApi = {
  criar(payload: CategoriaRequest): Promise<CategoriaResponse> {
    return apiRequest<CategoriaResponse>("/categorias", { method: "POST", body: payload });
  },
  listar(somenteAtivas = true): Promise<CategoriaResponse[]> {
    return apiRequest<CategoriaResponse[]>("/categorias", { query: { somenteAtivas } });
  },
  buscar(id: number): Promise<CategoriaResponse> {
    return apiRequest<CategoriaResponse>(`/categorias/${id}`);
  },
  atualizar(id: number, payload: CategoriaRequest): Promise<CategoriaResponse> {
    return apiRequest<CategoriaResponse>(`/categorias/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<void> {
    return apiRequest<void>(`/categorias/${id}`, { method: "DELETE" });
  },
};
