import { useEffect, useState } from "react";
import { ShoppingCart, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { solicitacoesCompraApi } from "../../../lib/api/solicitacoesCompra";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { SituacaoSolicitacaoCompra, SolicitacaoCompraResponse } from "../../../lib/api/types";

type Filtro = "todas" | SituacaoSolicitacaoCompra;

const situacaoBadge: Record<SituacaoSolicitacaoCompra, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  ATENDIDA: { label: "Atendida", color: "bg-green-100 text-green-700 border-green-200" },
  RECUSADA: { label: "Recusada", color: "bg-red-100 text-red-700 border-red-200" },
  CANCELADA: { label: "Cancelada", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function SolicitacoesCompra() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCompraResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("PENDENTE");
  const [processando, setProcessando] = useState<number | null>(null);

  useEffect(() => {
    fetchDados();
  }, [filtro]);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const data = await solicitacoesCompraApi.listar(filtro === "todas" ? undefined : filtro);
      setSolicitacoes(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar solicitações de compra."));
    } finally {
      setLoading(false);
    }
  };

  const atender = async (id: number) => {
    setProcessando(id);
    try {
      await solicitacoesCompraApi.atender(id);
      toast.success("Solicitação atendida.");
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao atender solicitação."));
    } finally {
      setProcessando(null);
    }
  };

  const recusar = async (id: number) => {
    const observacao = prompt("Motivo da recusa (opcional):") ?? undefined;
    setProcessando(id);
    try {
      await solicitacoesCompraApi.recusar(id, observacao);
      toast.success("Solicitação recusada.");
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao recusar solicitação."));
    } finally {
      setProcessando(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Solicitações de Compra</h1>
        </div>
        <p className="text-muted-foreground">
          Solicitações geradas automaticamente quando um produto atinge o estoque mínimo
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["PENDENTE", "ATENDIDA", "RECUSADA", "CANCELADA", "todas"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
              filtro === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
            }`}
          >
            {f === "todas" ? "Todas" : situacaoBadge[f].label}
          </button>
        ))}
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Estoque Atual</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Mínimo</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Qtd. Sugerida</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Situação</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : solicitacoes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              ) : (
                solicitacoes.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{s.produtoNome}</td>
                    <td className="px-6 py-4 text-sm">{s.quantidadeEstoque}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.estoqueMinimo}</td>
                    <td className="px-6 py-4 text-sm">{s.quantidadeSugerida}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[s.situacao].color}`}
                      >
                        {situacaoBadge[s.situacao].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.situacao === "PENDENTE" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => atender(s.id)}
                            disabled={processando === s.id}
                            className="p-2 hover:bg-accent rounded-lg transition-colors text-green-600"
                            title="Atender"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => recusar(s.id)}
                            disabled={processando === s.id}
                            className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600"
                            title="Recusar"
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {s.usuarioAtendimento ?? "—"}
                        </span>
                      )}
                    </td>
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
