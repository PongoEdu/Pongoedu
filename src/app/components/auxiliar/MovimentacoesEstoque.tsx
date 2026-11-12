import { useEffect, useState } from "react";
import { ArrowLeftRight, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { movimentacoesApi } from "../../../lib/api/movimentacoes";
import { produtosApi } from "../../../lib/api/produtos";
import { mensagemDeErro } from "../../auth/AuthContext";
import { BarraFiltros } from "../shared/BarraFiltros";
import type {
  MovimentacaoResponse,
  OrigemMovimentacao,
  ProdutoResponse,
  TipoMovimentacao,
} from "../../../lib/api/types";

const ORIGEM_LABEL: Record<OrigemMovimentacao, string> = {
  RECEBIMENTO: "Recebimento",
  PREPARACAO_PRATICA: "Preparação de prática",
  EMPRESTIMO: "Empréstimo",
  DEVOLUCAO_EMPRESTIMO: "Devolução de empréstimo",
  AJUSTE_MANUAL: "Ajuste manual",
  DESCARTE: "Descarte",
};

type FiltroTipo = "todos" | TipoMovimentacao;

function dataHora(iso: string): string {
  const [data, hora] = iso.split("T");
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a} ${hora?.slice(0, 5) ?? ""}`;
}

export function MovimentacoesEstoque() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<FiltroTipo>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    tipo: "ENTRADA" as TipoMovimentacao,
    produtoId: 0,
    quantidade: 1,
    observacao: "",
  });

  const carregar = async () => {
    setLoading(true);
    try {
      const [movs, prods] = await Promise.all([movimentacoesApi.listar(), produtosApi.listar()]);
      setMovimentacoes(movs);
      setProdutos(prods.filter((p) => p.categoria.movimentaEstoque));
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar movimentações."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirNovo = () => {
    setForm({ tipo: "ENTRADA", produtoId: produtos[0]?.id ?? 0, quantidade: 1, observacao: "" });
    setModalAberto(true);
  };

  const registrar = async () => {
    if (!form.produtoId || form.quantidade <= 0) {
      toast.error("Selecione o produto e informe uma quantidade válida.");
      return;
    }
    setSalvando(true);
    try {
      await movimentacoesApi.ajustar({
        produtoId: form.produtoId,
        tipo: form.tipo,
        quantidade: form.quantidade,
        observacao: form.observacao.trim() || null,
      });
      toast.success("Movimentação registrada.");
      setModalAberto(false);
      carregar();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível registrar a movimentação."));
    } finally {
      setSalvando(false);
    }
  };

  const q = busca.toLowerCase();
  const filtradas = movimentacoes.filter(
    (m) =>
      (tipoFiltro === "todos" || m.tipo === tipoFiltro) &&
      (!q ||
        m.produtoNome.toLowerCase().includes(q) ||
        m.usuarioNome.toLowerCase().includes(q) ||
        (m.observacao ?? "").toLowerCase().includes(q))
  );

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <ArrowLeftRight className="h-8 w-8 text-primary" />
            <h1 className="text-3xl">Movimentações de Estoque</h1>
          </div>
          <p className="text-muted-foreground">
            Acompanhe todas as entradas e saídas de materiais do laboratório.
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Nova Movimentação</span>
        </button>
      </div>

      <BarraFiltros
        busca={busca}
        onBusca={setBusca}
        placeholder="Buscar produto, responsável ou observação..."
        filtros={[
          {
            valor: tipoFiltro,
            onChange: (v) => setTipoFiltro(v as FiltroTipo),
            opcoes: [
              { valor: "todos", rotulo: "Todos os tipos" },
              { valor: "ENTRADA", rotulo: "Entrada" },
              { valor: "SAIDA", rotulo: "Saída" },
            ],
          },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border-2 border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-border bg-accent">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Data / Hora</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Origem</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filtradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma movimentação encontrada
                  </td>
                </tr>
              ) : (
                filtradas.map((m) => {
                  const entrada = m.tipo === "ENTRADA";
                  return (
                    <tr key={m.id} className="border-b border-border transition-colors hover:bg-accent/50">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{dataHora(m.dataMovimentacao)}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{m.produtoNome}</div>
                        {m.loteCodigo && <div className="text-xs text-muted-foreground">Lote {m.loteCodigo}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{m.quantidade}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            entrada
                              ? "border-green-200 bg-green-100 text-green-700"
                              : "border-orange-200 bg-orange-100 text-orange-700"
                          }`}
                        >
                          {entrada ? "Entrada" : "Saída"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {ORIGEM_LABEL[m.origem] ?? m.origem}
                      </td>
                      <td className="px-6 py-4 text-sm">{m.usuarioNome}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative mx-4 w-full max-w-lg rounded-2xl border-2 border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border p-6">
              <h2 className="text-xl font-semibold">Nova Movimentação</h2>
              <button onClick={() => setModalAberto(false)} className="rounded-lg p-2 hover:bg-accent">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as TipoMovimentacao }))}
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saída</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantidade}
                    onChange={(e) => setForm((p) => ({ ...p, quantidade: Number(e.target.value) }))}
                    className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Produto</label>
                <select
                  value={form.produtoId}
                  onChange={(e) => setForm((p) => ({ ...p, produtoId: Number(e.target.value) }))}
                  className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                >
                  <option value={0} disabled>
                    Selecione...
                  </option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.quantidadeEstoque} em estoque)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Observação</label>
                <textarea
                  rows={3}
                  value={form.observacao}
                  onChange={(e) => setForm((p) => ({ ...p, observacao: e.target.value }))}
                  placeholder="Detalhes sobre a movimentação..."
                  className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t-2 border-border p-6">
              <button
                onClick={() => setModalAberto(false)}
                className="rounded-xl border-2 border-border px-5 py-2.5 transition-colors hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                onClick={registrar}
                disabled={salvando}
                className="rounded-xl bg-primary px-6 py-2.5 text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
              >
                {salvando ? "Registrando..." : "Registrar Movimentação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
