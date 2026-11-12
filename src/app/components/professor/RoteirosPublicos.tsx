import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Globe, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { roteirosApi } from "../../../lib/api/roteiros";
import { mensagemDeErro, useAuth } from "../../auth/AuthContext";
import type { RoteiroResponse } from "../../../lib/api/types";

export function RoteirosPublicos() {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);
  const [roteiros, setRoteiros] = useState<RoteiroResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([roteirosApi.listar(true), roteirosApi.favoritos()])
      .then(([publicos, favs]) => {
        setRoteiros(publicos);
        setFavoritos(new Set(favs.map((f) => f.id)));
      })
      .catch((err) => toast.error(mensagemDeErro(err, "Erro ao buscar roteiros públicos.")))
      .finally(() => setLoading(false));
  }, []);

  const alternarFavorito = async (roteiro: RoteiroResponse) => {
    const eraFavorito = favoritos.has(roteiro.id);
    // atualização otimista
    setFavoritos((prev) => {
      const novo = new Set(prev);
      if (eraFavorito) novo.delete(roteiro.id);
      else novo.add(roteiro.id);
      return novo;
    });
    try {
      if (eraFavorito) await roteirosApi.desfavoritar(roteiro.id);
      else await roteirosApi.favoritar(roteiro.id);
    } catch (err) {
      setFavoritos((prev) => {
        const novo = new Set(prev);
        if (eraFavorito) novo.add(roteiro.id);
        else novo.delete(roteiro.id);
        return novo;
      });
      toast.error(mensagemDeErro(err, "Não foi possível atualizar os favoritos."));
    }
  };

  const termo = searchTerm.toLowerCase();
  const filtrados = roteiros
    .filter((r) => !somenteFavoritos || favoritos.has(r.id))
    .filter(
    (r) =>
      r.titulo.toLowerCase().includes(termo) ||
      (r.tema ?? "").toLowerCase().includes(termo) ||
      (r.disciplina ?? "").toLowerCase().includes(termo) ||
      r.professorNome.toLowerCase().includes(termo)
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Roteiros Públicos</h1>
        </div>
        <p className="text-muted-foreground">
          Todos os roteiros publicados pelos professores, independente do autor
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por título, tema, disciplina ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
        />
      </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={somenteFavoritos}
            onChange={(e) => setSomenteFavoritos(e.target.checked)}
          />
          <Star size={16} className="text-yellow-500" />
          Somente favoritos
        </label>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="w-12 px-4 py-4" aria-label="Favorito"></th>
                <th className="px-6 py-4 text-left text-sm font-medium">Título</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Disciplina</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Autor</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Duração</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Materiais</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum roteiro público encontrado
                  </td>
                </tr>
              ) : (
                filtrados.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-4">
                      {r.professorId === usuario?.id ? (
                        <span className="text-xs text-muted-foreground" title="Seu roteiro">
                          —
                        </span>
                      ) : (
                        <button
                          onClick={() => alternarFavorito(r)}
                          aria-label={favoritos.has(r.id) ? "Remover dos favoritos" : "Favoritar"}
                          title={favoritos.has(r.id) ? "Remover dos favoritos" : "Favoritar"}
                          className="rounded-lg p-1.5 transition-colors hover:bg-accent"
                        >
                          <Star
                            size={18}
                            className={favoritos.has(r.id) ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground"}
                          />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/professor/experimentos/${r.id}`} className="font-medium hover:text-primary">
                        {r.titulo}
                      </Link>
                      {r.geradoPorIa && <span className="ml-2 text-xs text-primary">✨ IA</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.disciplina ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.professorNome}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {r.tempoEstimadoMinutos ? `${r.tempoEstimadoMinutos} min` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.materiais.length}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
