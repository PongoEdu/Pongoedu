import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  Shield,
  FlaskConical,
  CheckCircle,
  XCircle,
  BookOpen,
  Flame,
  Droplets,
  Palette,
  Lightbulb,
  Wind,
  Magnet,
} from "lucide-react";

interface ReagenteDetalhe {
  id: number;
  nome: string;
  formula: string;
  quantidade: number;
  status: string;
}

interface ExperimentoDetalhe {
  id: number;
  nome: string;
  descricao: string;
  passoAPasso: string;
  efeito: string;
  nivelSeguranca: string;
  tempoEstimado: number;
  serie: string;
  disciplina: string;
  reagentes: ReagenteDetalhe[];
}

const efeitoConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  FOGO: { label: "Fogo", icon: Flame, color: "text-orange-500 bg-orange-50 border-orange-200" },
  ESPUMA: { label: "Espuma", icon: Droplets, color: "text-blue-500 bg-blue-50 border-blue-200" },
  COR: { label: "Cor", icon: Palette, color: "text-purple-500 bg-purple-50 border-purple-200" },
  LUZ: { label: "Luz", icon: Lightbulb, color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
  GAS: { label: "Gás", icon: Wind, color: "text-teal-500 bg-teal-50 border-teal-200" },
  MAGNETISMO: { label: "Magnetismo", icon: Magnet, color: "text-red-500 bg-red-50 border-red-200" },
};

const segurancaConfig: Record<string, { label: string; color: string; desc: string }> = {
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

const API_BASE = "http://localhost:8080/api/v1";

export function ExperimentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experimento, setExperimento] = useState<ExperimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperimento();
  }, [id]);

  const fetchExperimento = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/experimentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExperimento(data);
    } catch (err) {
      console.error("Erro ao buscar experimento:", err);
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

  if (!experimento) {
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
          <p className="text-lg">Experimento não encontrado</p>
        </div>
      </div>
    );
  }

  const efeito = efeitoConfig[experimento.efeito];
  const seguranca = segurancaConfig[experimento.nivelSeguranca];
  const EfeitoIcon = efeito?.icon || FlaskConical;
  const passos = experimento.passoAPasso
    ? experimento.passoAPasso.split("\n").filter((p) => p.trim())
    : [];

  const todosDisponiveis = experimento.reagentes?.every(
    (r) => r.quantidade > 0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Voltar ao catálogo
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{experimento.nome}</h1>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mb-4">
          {efeito && (
            <span
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border ${efeito.color}`}
            >
              <EfeitoIcon size={16} />
              {efeito.label}
            </span>
          )}
          {seguranca && (
            <span
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border ${seguranca.color}`}
            >
              <Shield size={16} />
              Segurança: {seguranca.label}
            </span>
          )}
          {experimento.serie && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              📚 {experimento.serie}
            </span>
          )}
          {experimento.disciplina && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              📖 {experimento.disciplina}
            </span>
          )}
          {experimento.tempoEstimado && (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-accent">
              <Clock size={16} />
              {experimento.tempoEstimado} minutos
            </span>
          )}
        </div>

        {/* Safety note */}
        {seguranca && (
          <p className="text-sm text-muted-foreground">
            ⚠️ {seguranca.desc}
          </p>
        )}
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          Descrição
        </h2>
        <div className="bg-card border-2 border-border rounded-2xl p-5">
          <p className="text-muted-foreground leading-relaxed">
            {experimento.descricao}
          </p>
        </div>
      </section>

      {/* Reagents */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FlaskConical size={20} className="text-primary" />
          Reagentes Necessários
        </h2>

        {/* Overall status */}
        <div
          className={`mb-4 px-4 py-3 rounded-xl border-2 text-sm font-medium ${
            todosDisponiveis
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {todosDisponiveis
            ? "✅ Todos os reagentes disponíveis em estoque"
            : `❌ Faltam ${experimento.reagentes.filter((r) => r.quantidade <= 0).length} reagente(s)`}
        </div>

        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          {experimento.reagentes?.map((reagente, index) => {
            const disponivel = reagente.quantidade > 0;
            return (
              <div
                key={reagente.id || index}
                className={`flex items-center justify-between px-5 py-4 ${
                  index < experimento.reagentes.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {disponivel ? (
                    <CheckCircle
                      size={20}
                      className="text-green-500 flex-shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={20}
                      className="text-red-500 flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-medium">{reagente.nome}</p>
                    {reagente.formula && (
                      <p className="text-sm text-muted-foreground font-mono">
                        {reagente.formula}
                      </p>
                    )}
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
                    {disponivel
                      ? `${reagente.quantidade} em estoque`
                      : "Indisponível"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step by step */}
      {passos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            📋 Passo a Passo
          </h2>
          <div className="bg-card border-2 border-border rounded-2xl p-5">
            <div className="space-y-4">
              {passos.map((passo, index) => {
                const textoLimpo = passo.replace(/^\d+\.\s*/, "");
                return (
                  <div
                    key={index}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-muted-foreground leading-relaxed">
                      {textoLimpo}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Action button */}
      <div className="flex justify-end">
        <button
          className={`px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-lg flex items-center gap-2 ${
            todosDisponiveis
              ? "bg-primary text-primary-foreground hover:scale-105"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!todosDisponiveis}
        >
          <BookOpen size={20} />
          Usar este experimento
        </button>
      </div>
    </div>
  );
}