import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { MascotLogo } from "./mascot-logo";

export function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    // Lógica de criação de conta seria implementada aqui
    console.log("Create account:", { name, email, password });

    // Exibir mensagem de sucesso
    toast.success("Conta criada com sucesso! Verifique seu e-mail para confirmação.", {
      duration: 5000,
    });

    // Limpar formulário
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <MascotLogo />
            <h1 className="text-primary text-3xl mt-4">PongoEdu</h1>
            <p className="text-muted-foreground mt-2">Crie sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="Seu nome"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg text-base"
            >
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Entrar
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
