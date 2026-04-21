import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Flame,
  Droplets,
  Palette,
  Lightbulb,
  Wind,
  Magnet,
  Clock,
  Shield,
  FlaskConical,
  Search,
  Sparkles,
} from "lucide-react";

interface ExperimentoDisponibilidade {
  id: number;
  nome: string;
  descricao: string;
  efeito: string;
  nivelSeguranca: string;
  tempoEstimado: number;
  serie: string;
  totalReagentes: number;
  reagentesDisponiveis: number;
  reagentesFaltando: string[];
  disponivel: boolean;
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

const segurancaConfig: Record<string, { label: string; color: string }> = {
  BAIXO: { label: "Baixo", color: "bg-green-100 text-green-600 border-green-200" },
  MEDIO: { label: "Médio", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
  ALTO: { label: "Alto", color: "bg-red-100 text-red-600 border-red-200" },
};

const API_BASE = "http://localhost:8080/api/v1";

export function ExperimentosCatalogo() {
  const [experimentos, setExperimentos] = useState<ExperimentoDisponibilidade[]>([]);
  const [filtroEfeito, setFiltroEfeito] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperimentos();
  }, [filtroEfeito]);

  const fetchExperimentos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = filtroEfeito
        ? `${API_BASE}/experimentos?efeito=${filtroEfeito}`
        : `${API_BASE}/experimentos`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExperimentos(data);
    } catch (err) {
      console.error("Erro ao buscar experimentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperimentos = experimentos.filter((exp) =>
    exp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.serie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisponibilidade = (exp: ExperimentoDisponibilidade) => {
    if (exp.disponivel) {
      return {
        label: "Disponível — todos os reagentes em estoque",
        icon: "✅",
        color: "bg-green-50 border-green-200 text-green-700",
      };
    }
    const faltam = exp.totalReagentes - exp.reagentesDisponiveis;
    if (faltam === 1) {
      return {
        label: `Falta 1 reagente: ${exp.reagentesFaltando[0]}`,
        icon: "⚠️",
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      };
    }
    return {
      label: `Indisponível — faltam ${faltam} reagentes`,
      icon: "❌",
      color: "bg-red-50 border-red-200 text-red-700",
    };
  };

  const efeitoKeys = Object.keys(efeitoConfig);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Experimentos</h1>
          </div>
          <p className="text-muted-foreground">
            Explore experimentos disponíveis no laboratório
          </p>
        </div>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
          <Sparkles size={20} />
          <span>Sugerir com IA</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome, descrição ou série..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Effect Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFiltroEfeito(null)}
          className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
            filtroEfeito === null
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:bg-accent"
          }`}
        >
          Todos
        </button>
        {efeitoKeys.map((key) => {
          const config = efeitoConfig[key];
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setFiltroEfeito(key)}
              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                filtroEfeito === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : `border-border hover:bg-accent`
              }`}
            >
              <Icon size={16} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredExperimentos.length} experimento
        {filteredExperimentos.length !== 1 ? "s" : ""} encontrado
        {filteredExperimentos.length !== 1 ? "s" : ""}
      </p>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredExperimentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FlaskConical className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Nenhum experimento encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperimentos.map((exp) => {
            const efeito = efeitoConfig[exp.efeito];
            const seguranca = segurancaConfig[exp.nivelSeguranca];
            const disponibilidade = getDisponibilidade(exp);
            const EfeitoIcon = efeito?.icon || FlaskConical;

            return (
              <Link
                to={`/auxiliar/experimentos/${exp.id}`}
                key={exp.id}
                className="bg-card border-2 border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
              >
                {/* Top badges */}
                <div className="flex items-center justify-between mb-3">
                  {efeito && (
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${efeito.color}`}
                    >
                      <EfeitoIcon size={14} />
                      {efeito.label}
                    </span>
                  )}
                  {seguranca && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${seguranca.color}`}
                    >
                      <Shield
                        size={12}
                        className="inline mr-1"
                      />
                      {seguranca.label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {exp.nome}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {exp.descricao}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  {exp.serie && (
                    <span className="flex items-center gap-1">
                      📚 {exp.serie}
                    </span>
                  )}
                  {exp.tempoEstimado && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {exp.tempoEstimado} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FlaskConical size={14} />
                    {exp.reagentesDisponiveis}/{exp.totalReagentes}
                  </span>
                </div>

                {/* Availability */}
                <div
                  className={`px-3 py-2 rounded-xl border text-xs font-medium ${disponibilidade.color}`}
                >
                  {disponibilidade.icon} {disponibilidade.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}