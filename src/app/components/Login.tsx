import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, House, Lock, Mail } from "lucide-react";
import { BrandLogo, MascotLogo } from "./mascot-logo";
import { useAuth, mensagemDeErro } from "../auth/AuthContext";

const PATH_POR_PERFIL: Record<string, string> = {
  PROFESSOR: "/professor",
  AUXILIAR_LABORATORIO: "/auxiliar",
};

const GREEN = "#08b347";
const PURPLE = "#7c3cff";
const BLUE = "#2878ff";
const DARK = "#111827";
const MUTED = "#74829c";
const BORDER = "#d9e1ef";

const inputClass =
  "w-full h-[62px] rounded-[18px] border bg-white px-[54px] text-[15px] outline-none transition focus:border-[#7c3cff] focus:shadow-[0_0_0_4px_rgba(124,60,255,0.08)]";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#f7f7fb]">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-[#e8edf5] bg-white/95 backdrop-blur-[14px]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 py-5 md:min-h-[72px] md:flex-row md:justify-between md:py-0">
          <Link to="/" className="no-underline">
            <BrandLogo subtitle="Gestão de Laboratórios" />
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-[#4b5563] no-underline hover:text-[#111827]"
          >
            <House size={20} />
            Página inicial
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20">
        {/* Círculos e pontos decorativos */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute -left-[50px] top-[120px] h-[150px] w-[150px] rounded-full border border-[#7c3cff]/20" />
          <div className="absolute right-10 top-20 h-20 w-20 rounded-full border border-[#7c3cff]/20" />
          <div className="absolute bottom-10 right-2.5 h-[120px] w-[120px] rounded-full border border-[#7c3cff]/20" />

          <div className="absolute left-[120px] top-[140px] h-[18px] w-[18px] rounded-full" style={{ background: GREEN }} />
          <div className="absolute bottom-[300px] left-[100px] h-5 w-5 rounded-full" style={{ background: BLUE }} />
          <div className="absolute bottom-20 left-[160px] h-5 w-5 rounded-full" style={{ background: PURPLE }} />
          <div className="absolute right-[180px] top-[320px] h-4 w-4 rounded-full" style={{ background: GREEN }} />
          <div className="absolute bottom-[100px] right-[130px] h-[22px] w-[22px] rounded-full" style={{ background: BLUE }} />
          <div className="absolute bottom-[360px] right-[200px] h-4 w-4 rounded-full" style={{ background: PURPLE }} />
        </div>

        <div className="relative z-[2] w-full max-w-[520px] rounded-[34px] border border-[#e7ecf5] bg-white px-6 py-[29px] shadow-[0_30px_60px_rgba(25,33,61,0.08)] md:px-12 md:py-11">
          <div className="mx-auto mb-2.5 flex justify-center">
            <MascotLogo size={90} />
          </div>

          <h2 className="mb-3 text-center text-[34px] font-black leading-none md:text-[42px]" style={{ fontWeight: 900 }}>
            <span style={{ color: GREEN }}>Pongo</span>
            <span style={{ color: PURPLE }}>Edu</span>
          </h2>

          <h3
            className="mb-2 text-center text-[20px] leading-tight md:text-[24px]"
            style={{ fontWeight: 800, color: DARK }}
          >
            Entrar na sua conta
          </h3>

          <p className="mb-10 text-center text-[15px]" style={{ color: MUTED }}>
            Digite seu e-mail e senha para acessar sua conta.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="mb-2.5 block text-sm font-bold text-[#344054]">
                E-mail
              </label>
              <div className="relative">
                <Mail size={22} className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#8fa0ba]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  style={{ borderColor: BORDER }}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="mb-2.5 block text-sm font-bold text-[#344054]">
                Senha
              </label>
              <div className="relative">
                <Lock size={22} className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#8fa0ba]" />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className={inputClass}
                  style={{ borderColor: BORDER }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-[18px] top-1/2 -translate-y-1/2 border-0 bg-transparent text-[#8fa0ba]"
                >
                  {mostrarSenha ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="mb-7 flex justify-end">
              <a
                href="#esqueci-a-senha"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Para redefinir sua senha, peça ao auxiliar de laboratório.");
                }}
                className="text-sm font-bold no-underline hover:underline"
                style={{ color: GREEN }}
              >
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="flex h-[62px] w-full items-center justify-center gap-2.5 rounded-[18px] border-0 text-base text-white shadow-[0_16px_32px_rgba(8,179,71,0.28)] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ fontWeight: 800, background: "linear-gradient(135deg, #06b347, #009f3c)" }}
            >
              {enviando ? "Entrando..." : "Entrar"}
              {!enviando && <ArrowRight size={22} />}
            </button>
          </form>

          <div className="my-[34px] flex items-center gap-4 text-sm text-[#98a4b8] before:h-px before:flex-1 before:bg-[#e2e8f0] before:content-[''] after:h-px after:flex-1 after:bg-[#e2e8f0] after:content-['']">
            <span>ou</span>
          </div>

          <p className="text-center text-[#7b879b]">
            Não tem uma conta? Peça ao auxiliar de laboratório para cadastrar você.
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-[#e8edf5] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-5 text-center md:h-[100px] md:flex-row md:justify-between md:py-0 md:text-left">
          <div>
            <strong className="text-xl" style={{ color: PURPLE }}>
              <span style={{ color: GREEN }}>Pongo</span>Edu
            </strong>
            <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
              Gestão de Laboratórios
            </p>
          </div>
          <small className="text-sm" style={{ color: MUTED }}>
            © 2026 PongoEdu. Todos os direitos reservados.
          </small>
        </div>
      </footer>
    </div>
  );
}
