import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { BrandLogo } from "./mascot-logo";
import { useAuth, mensagemDeErro } from "../auth/AuthContext";

const PATH_POR_PERFIL: Record<string, string> = {
  PROFESSOR: "/professor",
  AUXILIAR_LABORATORIO: "/auxiliar",
};

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const usuario = await login({ email, senha });
      navigate(PATH_POR_PERFIL[usuario.perfil] ?? "/");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível entrar. Verifique suas credenciais."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <BrandLogo />
            <p className="text-muted-foreground mt-2">Entre na sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg text-base disabled:opacity-60 disabled:hover:scale-100"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta? Peça ao auxiliar de laboratório para cadastrar você.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
