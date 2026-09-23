import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Clock, Shield, FlaskConical, Search, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { roteirosApi } from "../../../../lib/api/roteiros";
import { mensagemDeErro, useAuth } from "../../../auth/AuthContext";
import type { NivelSeguranca, RoteiroResponse } from "../../../../lib/api/types";

const segurancaConfig: Record<NivelSeguranca, { label: string; color: string }> = {
  BAIXO: { label: "Baixo", color: "bg-green-100 text-green-600 border-green-200" },
  MEDIO: { label: "Médio", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
  ALTO: { label: "Alto", color: "bg-red-100 text-red-600 border-red-200" },
};

export function ExperimentosCatalogo() {
  const { usuario } = useAuth();
  const basePath = usuario?.perfil === "AUXILIAR_LABORATORIO" ? "/auxiliar" : "/professor";
  const isProfessor = usuario?.perfil === "PROFESSOR";

  const [roteiros, setRoteiros] = useState<RoteiroResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [somentePublicados, setSomentePublicados] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoteiros();
  }, [somentePublicados]);

  const fetchRoteiros = async () => {
    setLoading(true);
    try {
      const data = await roteirosApi.listar(somentePublicados || undefined);
      setRoteiros(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar roteiros de prática."));
    } finally {
      setLoading(false);
    }
  };

  const filteredRoteiros = roteiros.filter(
    (r) =>
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.tema ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.disciplina ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Experimentos</h1>
          </div>
          <p className="text-muted-foreground">
            Explore os roteiros de prática e a disponibilidade dos materiais no laboratório
          </p>
        </div>
        {isProfessor && (
          <Link
            to="/professor/roteiros"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Novo Roteiro</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por título, tema ou disciplina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-border text-sm whitespace-nowrap cursor-pointer">
          <input
            type="checkbox"
            checked={somentePublicados}
            onChange={(e) => setSomentePublicados(e.target.checked)}
          />
          Somente publicados
        </label>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filteredRoteiros.length} roteiro{filteredRoteiros.length !== 1 ? "s" : ""} encontrado
        {filteredRoteiros.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredRoteiros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FlaskConical className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Nenhum roteiro encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoteiros.map((roteiro) => {
            const seguranca = roteiro.nivelSeguranca ? segurancaConfig[roteiro.nivelSeguranca] : null;
            const totalMateriais = roteiro.materiais.length;
            const disponiveis = roteiro.materiais.filter((m) => m.disponivel && !m.vencido).length;
            const disponivel = totalMateriais > 0 ? disponiveis === totalMateriais : true;

            return (
              <Link
                to={`${basePath}/experimentos/${roteiro.id}`}
                key={roteiro.id}
                className="bg-card border-2 border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  {seguranca && (
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${seguranca.color}`}>
                      <Shield size={14} />
                      {seguranca.label}
                    </span>
                  )}
                  {!roteiro.publicado && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-accent text-muted-foreground">
                      Rascunho
                    </span>
                  )}
                  {roteiro.possuiPendenciaMaterial && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <AlertTriangle size={14} />
                      Pendência
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {roteiro.titulo}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {roteiro.objetivo ?? roteiro.tema ?? "Sem descrição"}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
                  {roteiro.disciplina && <span>📖 {roteiro.disciplina}</span>}
                  {roteiro.tempoEstimadoMinutos && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {roteiro.tempoEstimadoMinutos} min
                    </span>
                  )}
                  {totalMateriais > 0 && (
                    <span className="flex items-center gap-1">
                      <FlaskConical size={14} />
                      {disponiveis}/{totalMateriais}
                    </span>
                  )}
                </div>

                {totalMateriais > 0 && (
                  <div
                    className={`px-3 py-2 rounded-xl border text-xs font-medium ${
                      disponivel
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {disponivel
                      ? "✅ Disponível — todos os materiais em estoque"
                      : `❌ Faltam ${totalMateriais - disponiveis} material(is)`}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
