import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import type { Perfil } from "../../lib/api/types";

interface RequireAuthProps {
  perfil: Perfil;
  children: React.ReactNode;
}

const PATH_POR_PERFIL: Record<Perfil, string> = {
  PROFESSOR: "/professor",
  AUXILIAR_LABORATORIO: "/auxiliar",
};

export function RequireAuth({ perfil, children }: RequireAuthProps) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (usuario.perfil !== perfil) {
    return <Navigate to={PATH_POR_PERFIL[usuario.perfil]} replace />;
  }

  return <>{children}</>;
}
