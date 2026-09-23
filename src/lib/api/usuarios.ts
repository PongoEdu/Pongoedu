import { apiRequest } from "./http";
import type { AtualizarUsuarioRequest, CriarUsuarioRequest, Perfil, UsuarioResponse } from "./types";

export const usuariosApi = {
  criar(payload: CriarUsuarioRequest): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>("/usuarios", { method: "POST", body: payload });
  },
  listar(perfil?: Perfil): Promise<UsuarioResponse[]> {
    return apiRequest<UsuarioResponse[]>("/usuarios", { query: { perfil } });
  },
  buscar(id: number): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>(`/usuarios/${id}`);
  },
  atualizar(id: number, payload: AtualizarUsuarioRequest): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>(`/usuarios/${id}`, { method: "PUT", body: payload });
  },
  remover(id: number): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>(`/usuarios/${id}`, { method: "DELETE" });
  },
};
