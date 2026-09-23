import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../../lib/api/auth";
import { ApiError, getToken, setToken, setUnauthorizedHandler } from "../../lib/api/http";
import type { LoginRequest, UsuarioResponse } from "../../lib/api/types";

const USER_KEY = "pongoedu_usuario";

interface AuthContextValue {
  usuario: UsuarioResponse | null;
  carregando: boolean;
  login: (payload: LoginRequest) => Promise<UsuarioResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function lerUsuarioArmazenado(): UsuarioResponse | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UsuarioResponse) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(() =>
    getToken() ? lerUsuarioArmazenado() : null
  );
  const [carregando, setCarregando] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (payload: LoginRequest) => {
    setCarregando(true);
    try {
      const resposta = await authApi.login(payload);
      setToken(resposta.token);
      localStorage.setItem(USER_KEY, JSON.stringify(resposta.usuario));
      setUsuario(resposta.usuario);
      return resposta.usuario;
    } finally {
      setCarregando(false);
    }
  }, []);

  const value = useMemo(
    () => ({ usuario, carregando, login, logout }),
    [usuario, carregando, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function mensagemDeErro(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
