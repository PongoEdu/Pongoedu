import { useState } from "react";
import { toast } from "sonner";
import { perfilApi } from "../../lib/api/perfil";
import { mensagemDeErro, useAuth } from "../auth/AuthContext";

const PERFIL_LABEL: Record<string, string> = {
  PROFESSOR: "Professor",
  AUXILIAR_LABORATORIO: "Auxiliar de Laboratório",
};

const inputClass =
  "w-full h-[46px] rounded-xl border bg-white px-3.5 text-sm outline-none transition focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(124,60,255,0.08)]";
const labelClass = "mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-[#344054]";
const readOnlyClass =
  "flex h-[46px] items-center rounded-xl border border-brand-line bg-[#f8f9ff] px-3.5 text-sm text-brand-muted";

function SenhaInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visivel ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-11`}
        style={{ borderColor: "#dce4f2" }}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-0 bg-transparent text-[#91a4bf]"
      >
        <span className="material-symbols-rounded">{visivel ? "visibility_off" : "visibility"}</span>
      </button>
    </div>
  );
}

export function MeuPerfil() {
  const { usuario, atualizarUsuario } = useAuth();

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [salvandoNome, setSalvandoNome] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const perfilLabel = PERFIL_LABEL[usuario?.perfil ?? ""] ?? usuario?.perfil;

  const salvarNome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe seu nome.");
      return;
    }
    setSalvandoNome(true);
    try {
      const atualizado = await perfilApi.atualizarNome(nome.trim());
      atualizarUsuario(atualizado);
      setNome(atualizado.nome);
      toast.success("Perfil atualizado.");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível atualizar o perfil."));
    } finally {
      setSalvandoNome(false);
    }
  };

  const salvarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSalvandoSenha(true);
    try {
      await perfilApi.alterarSenha({ senhaAtual, novaSenha });
      toast.success("Senha alterada com sucesso.");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível alterar a senha."));
    } finally {
      setSalvandoSenha(false);
    }
  };

  const inicial = (usuario?.nome ?? "U").trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-[760px] p-6">
      <div className="mb-6">
        <h1 className="mb-1 text-[24px] font-extrabold tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-brand-muted">Gerencie seus dados de acesso ao PongoEdu</p>
      </div>

      {/* Dados pessoais */}
      <form
        onSubmit={salvarNome}
        className="mb-5 flex flex-col gap-4 rounded-[18px] border border-brand-line bg-white p-7"
      >
        <h2 className="m-0 flex items-center gap-2 text-[15px] font-extrabold">
          <span className="material-symbols-rounded !text-[19px]" style={{ color: "var(--purple)" }}>
            person
          </span>
          Dados pessoais
        </h2>

        <div className="flex items-center gap-5">
          <div
            className="flex h-[72px] w-[72px] shrink-0 select-none items-center justify-center rounded-full text-[32px]"
            style={{ background: "linear-gradient(135deg, #ede8ff, #d1e8ff)", color: "var(--purple)", fontWeight: 800 }}
          >
            {inicial}
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-lg">{usuario?.nome}</strong>
            <small className="text-sm text-brand-muted">{perfilLabel}</small>
          </div>
        </div>

        <div>
          <label htmlFor="perfil-nome" className={labelClass}>
            Nome
          </label>
          <input
            id="perfil-nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={150}
            className={inputClass}
            style={{ borderColor: "#dce4f2" }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>E-mail</label>
            <div className={readOnlyClass}>{usuario?.email}</div>
          </div>
          <div>
            <label className={labelClass}>Perfil de acesso</label>
            <div className={readOnlyClass}>{perfilLabel}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={salvandoNome || nome.trim() === usuario?.nome}
            className="inline-flex h-11 items-center gap-2 rounded-xl border-0 px-6 text-sm text-white transition disabled:opacity-50"
            style={{ background: "var(--purple)", fontWeight: 700 }}
          >
            <span className="material-symbols-rounded !text-[18px]">save</span>
            {salvandoNome ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>

      {/* Senha */}
      <form
        onSubmit={salvarSenha}
        className="flex flex-col gap-4 rounded-[18px] border border-brand-line bg-white p-7"
      >
        <h2 className="m-0 flex items-center gap-2 text-[15px] font-extrabold">
          <span className="material-symbols-rounded !text-[19px]" style={{ color: "var(--purple)" }}>
            lock
          </span>
          Alterar senha
        </h2>
        <p className="m-0 text-[13px] text-brand-muted">Use pelo menos 6 caracteres.</p>

        <div>
          <label htmlFor="senha-atual" className={labelClass}>
            Senha atual
          </label>
          <SenhaInput id="senha-atual" value={senhaAtual} onChange={setSenhaAtual} placeholder="Senha atual" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nova-senha" className={labelClass}>
              Nova senha
            </label>
            <SenhaInput id="nova-senha" value={novaSenha} onChange={setNovaSenha} placeholder="Nova senha" />
          </div>
          <div>
            <label htmlFor="confirmar-senha" className={labelClass}>
              Confirmar nova senha
            </label>
            <SenhaInput
              id="confirmar-senha"
              value={confirmarSenha}
              onChange={setConfirmarSenha}
              placeholder="Confirme a nova senha"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={salvandoSenha || !senhaAtual || !novaSenha || !confirmarSenha}
            className="inline-flex h-11 items-center gap-2 rounded-xl border-0 px-6 text-sm text-white transition disabled:opacity-50"
            style={{ background: "var(--purple)", fontWeight: 700 }}
          >
            <span className="material-symbols-rounded !text-[18px]">check</span>
            {salvandoSenha ? "Salvando..." : "Alterar senha"}
          </button>
        </div>
      </form>
    </div>
  );
}
