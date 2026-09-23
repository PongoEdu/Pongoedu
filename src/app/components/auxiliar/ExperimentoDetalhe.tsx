import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Shield,
  FlaskConical,
  CheckCircle,
  XCircle,
  BookOpen,
  CalendarPlus,
} from "lucide-react";
import { roteirosApi } from "../../../lib/api/roteiros";
import { useAuth, mensagemDeErro } from "../../auth/AuthContext";
import type { NivelSeguranca, RoteiroResponse } from "../../../lib/api/types";

const segurancaConfig: Record<NivelSeguranca, { label: string; color: string; desc: string }> = {
  BAIXO: {
    label: "Baixo",
    color: "bg-green-100 text-green-600 border-green-200",
    desc: "Seguro para todas as séries com supervisão básica",
  },
  MEDIO: {
    label: "Médio",
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    desc: "Requer supervisão direta do professor",
  },
  ALTO: {
    label: "Alto",
    color: "bg-red-100 text-red-600 border-red-200",
    desc: "Exige EPIs e supervisão rigorosa",
  },
};

const nivelEnsinoLabel: Record<string, string> = {
  FUNDAMENTAL_I: "Fundamental I",
  FUNDAMENTAL_II: "Fundamental II",
  MEDIO: "Ensino Médio",
};

export function ExperimentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [roteiro, setRoteiro] = useState<RoteiroResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchRoteiro(Number(id));
  }, [id]);

  const fetchRoteiro = async (roteiroId: number) => {
    setLoading(true);
    try {
      const data = await roteirosApi.buscar(roteiroId);
      setRoteiro(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar roteiro."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!roteiro) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FlaskConical className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Roteiro não encontrado</p>
        </div>
      </div>
    );
  }

  const seguranca = roteiro.nivelSeguranca ? segurancaConfig[roteiro.nivelSeguranca] : null;
  const passos = roteiro.procedimento
    ? roteiro.procedimento.split("\n").filter((p) => p.trim())
    : [];

  const todosDisponiveis = roteiro.materiais.every((m) => m.disponivel && !m.vencido);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Voltar ao catálogo
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{roteiro.titulo}</h1>

        <div className="flex flex-wrap gap-3 mb-4">
          {seguranca && (
            <span className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border ${seguranca.color}`}>
              <Shield size={16} />
              Segurança: {seguranca.label}
            </span>
          )}
          {roteiro.nivelEnsino && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              📚 {nivelEnsinoLabel[roteiro.nivelEnsino]}
            </span>
          )}
          {roteiro.disciplina && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              📖 {roteiro.disciplina}
            </span>
          )}
          {roteiro.tempoEstimadoMinutos && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              <Clock size={16} />
              {roteiro.tempoEstimadoMinutos} minutos
            </span>
          )}
          {roteiro.geradoPorIa && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-primary/30 bg-primary/10 text-primary">
              ✨ Gerado com IA
            </span>
          )}
        </div>

        {seguranca && <p className="text-sm text-muted-foreground">⚠️ {seguranca.desc}</p>}
      </div>

      {roteiro.objetivo && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            Objetivo
          </h2>
          <div className="bg-card border-2 border-border rounded-2xl p-5">
            <p className="text-muted-foreground leading-relaxed">{roteiro.objetivo}</p>
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FlaskConical size={20} className="text-primary" />
          Materiais Necessários
        </h2>

        {roteiro.materiais.length > 0 && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl border-2 text-sm font-medium ${
              todosDisponiveis
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {todosDisponiveis
              ? "✅ Todos os materiais disponíveis em estoque"
              : `❌ Há materiais indisponíveis ou vencidos`}
          </div>
        )}

        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          {roteiro.materiais.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">Nenhum material vinculado a este roteiro.</p>
          ) : (
            roteiro.materiais.map((material, index) => {
              const disponivel = material.disponivel && !material.vencido;
              return (
                <div
                  key={material.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    index < roteiro.materiais.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {disponivel ? (
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{material.produtoNome}</p>
                      <p className="text-sm text-muted-foreground">
                        Necessário: {material.quantidadeNecessaria}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        disponivel
                          ? "bg-green-100 text-green-600 border-green-200"
                          : "bg-red-100 text-red-600 border-red-200"
                      }`}
                    >
                      {material.vencido
                        ? "Vencido"
                        : `${material.quantidadeDisponivel} em estoque`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {passos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">📋 Procedimento</h2>
          <div className="bg-card border-2 border-border rounded-2xl p-5">
            <div className="space-y-4">
              {passos.map((passo, index) => {
                const textoLimpo = passo.replace(/^\d+\.\s*/, "");
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-muted-foreground leading-relaxed">{textoLimpo}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {usuario?.perfil === "PROFESSOR" && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/professor/agendamentos/reservas?roteiroId=${roteiro.id}`)}
            className="px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-lg flex items-center gap-2 bg-primary text-primary-foreground hover:scale-105"
          >
            <CalendarPlus size={20} />
            Agendar prática com este roteiro
          </button>
        </div>
      )}
    </div>
  );
}
