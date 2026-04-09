import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MascotLogo } from "./mascot-logo";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação seria implementada aqui
    console.log("Login attempt:", { email, password });
    // Redireciona para o dashboard do professor após login
    navigate("/professor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <MascotLogo />
            <h1 className="text-primary text-3xl mt-4">PongoEdu</h1>
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
              <label htmlFor="password" className="block text-sm mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg text-base"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/criar-conta" className="text-primary hover:underline">
                Criar conta
              </Link>
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
