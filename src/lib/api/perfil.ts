import { apiRequest } from "./http";
import type { UsuarioResponse } from "./types";

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export const perfilApi = {
  meuPerfil(): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>("/perfil");
  },
  atualizarNome(nome: string): Promise<UsuarioResponse> {
    return apiRequest<UsuarioResponse>("/perfil", { method: "PUT", body: { nome } });
  },
  alterarSenha(payload: AlterarSenhaRequest): Promise<void> {
    return apiRequest<void>("/perfil/senha", { method: "PUT", body: payload });
  },
};
