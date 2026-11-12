import { useEffect, useState } from "react";
import { Truck, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { recebimentosApi } from "../../../lib/api/recebimentos";
import { produtosApi } from "../../../lib/api/produtos";
import { lotesApi } from "../../../lib/api/lotes";
import { mensagemDeErro } from "../../auth/AuthContext";
import { BarraFiltros } from "../shared/BarraFiltros";
import type {
  ItemRecebimentoRequest,
  LoteResponse,
  ProdutoResponse,
  RecebimentoResponse,
  TipoEntrada,
} from "../../../lib/api/types";

interface ItemForm extends ItemRecebimentoRequest {
  key: string;
}

function novoItem(): ItemForm {
  return { key: crypto.randomUUID(), produtoId: 0, loteId: 0, quantidade: 1, valorUnitario: null, confirmarVencido: false };
}

export function RecebimentoEntradas() {
  const [recebimentos, setRecebimentos] = useState<RecebimentoResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | TipoEntrada>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [tipoEntrada, setTipoEntrada] = useState<TipoEntrada>("CODIGO_SISTEMA");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [dataRecebimento, setDataRecebimento] = useState(() => new Date().toISOString().slice(0, 10));
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState<ItemForm[]>([novoItem()]);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [recebimentosData, produtosData, lotesData] = await Promise.all([
        recebimentosApi.listar(),
        produtosApi.listar(),
        lotesApi.listar(),
      ]);
      setRecebimentos(recebimentosData);
      setProdutos(produtosData);
      setLotes(lotesData);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar recebimentos."));
    } finally {
      setLoading(false);
    }
  };

  const abrirNovo = () => {
    setTipoEntrada("CODIGO_SISTEMA");
    setNumeroNotaFiscal("");
    setFornecedor("");
    setDataRecebimento(new Date().toISOString().slice(0, 10));
    setObservacao("");
    setItens([novoItem()]);
    setModalAberto(true);
  };

  const atualizarItem = (key: string, patch: Partial<ItemForm>) => {
    setItens((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const handleSubmit = async () => {
    if (tipoEntrada === "NOTA_FISCAL" && !numeroNotaFiscal.trim()) {
      toast.error("Informe o número da nota fiscal.");
      return;
    }
    if (itens.some((i) => !i.produtoId || !i.loteId || i.quantidade <= 0)) {
      toast.error("Preencha produto, lote e quantidade em todos os itens.");
      return;
    }

    setSalvando(true);
    try {
      await recebimentosApi.criar({
        tipoEntrada,
        numeroNotaFiscal: tipoEntrada === "NOTA_FISCAL" ? numeroNotaFiscal : null,
        fornecedor: fornecedor || null,
        dataRecebimento,
        observacao: observacao || null,
        itens: itens.map(({ key, ...rest }) => rest),
      });
      toast.success("Recebimento registrado e estoque atualizado.");
      setModalAberto(false);
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao registrar recebimento. Verifique se algum lote está vencido."));
    } finally {
      setSalvando(false);
    }
  };

  const filtrados = recebimentos.filter((r) => {
    const q = busca.toLowerCase();
    const matchBusca =
      !q ||
      (r.fornecedor ?? "").toLowerCase().includes(q) ||
      (r.numeroNotaFiscal ?? "").toLowerCase().includes(q) ||
      r.auxiliarNome.toLowerCase().includes(q);
    return matchBusca && (tipoFiltro === "todos" || r.tipoEntrada === tipoFiltro);
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Entradas</h1>
          </div>
          <p className="text-muted-foreground">Registre e acompanhe o recebimento de materiais</p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo Recebimento</span>
        </button>
      </div>

      <BarraFiltros
        busca={busca}
        onBusca={setBusca}
        placeholder="Buscar por fornecedor, nota fiscal ou responsável..."
        filtros={[
          {
            valor: tipoFiltro,
            onChange: (v) => setTipoFiltro(v as "todos" | TipoEntrada),
            opcoes: [
              { valor: "todos", rotulo: "Todos os tipos" },
              { valor: "NOTA_FISCAL", rotulo: "Nota Fiscal" },
              { valor: "CODIGO_SISTEMA", rotulo: "Código do Sistema" },
            ],
          },
        ]}
      />

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Nota Fiscal</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Fornecedor</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Itens</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Auxiliar</th>
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
                    Nenhum recebimento registrado
                  </td>
                </tr>
              ) : (
                filtrados.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 text-sm">{r.dataRecebimento}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {r.tipoEntrada === "NOTA_FISCAL" ? "Nota Fiscal" : "Código do Sistema"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.numeroNotaFiscal ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.fornecedor ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.itens.length} item(ns)</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.auxiliarNome}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-xl font-semibold">Novo Recebimento</h2>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tipo de entrada</label>
                  <select
                    value={tipoEntrada}
                    onChange={(e) => setTipoEntrada(e.target.value as TipoEntrada)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="CODIGO_SISTEMA">Código do Sistema</option>
                    <option value="NOTA_FISCAL">Nota Fiscal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Data do recebimento</label>
                  <input
                    type="date"
                    value={dataRecebimento}
                    onChange={(e) => setDataRecebimento(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {tipoEntrada === "NOTA_FISCAL" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Número da Nota Fiscal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={numeroNotaFiscal}
                    onChange={(e) => setNumeroNotaFiscal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Fornecedor</label>
                <input
                  type="text"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Itens</label>
                  <button
                    type="button"
                    onClick={() => setItens((prev) => [...prev, novoItem()])}
                    className="text-xs text-primary hover:underline"
                  >
                    + Adicionar item
                  </button>
                </div>
                <div className="space-y-3">
                  {itens.map((item) => (
                    <div key={item.key} className="grid grid-cols-12 gap-2 items-center">
                      <select
                        value={item.produtoId}
                        onChange={(e) => atualizarItem(item.key, { produtoId: Number(e.target.value) })}
                        className="col-span-4 px-3 py-2 rounded-lg border-2 border-border bg-background text-sm"
                      >
                        <option value={0} disabled>
                          Produto...
                        </option>
                        {produtos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                      <select
                        value={item.loteId}
                        onChange={(e) => atualizarItem(item.key, { loteId: Number(e.target.value) })}
                        className="col-span-3 px-3 py-2 rounded-lg border-2 border-border bg-background text-sm"
                      >
                        <option value={0} disabled>
                          Lote...
                        </option>
                        {lotes.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.codigo} {l.vencido ? "(vencido)" : ""}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(item.key, { quantidade: Number(e.target.value) })}
                        placeholder="Qtd."
                        className="col-span-2 px-3 py-2 rounded-lg border-2 border-border bg-background text-sm"
                      />
                      <label className="col-span-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={!!item.confirmarVencido}
                          onChange={(e) => atualizarItem(item.key, { confirmarVencido: e.target.checked })}
                        />
                        Confirmar vencido
                      </label>
                      <button
                        type="button"
                        onClick={() => setItens((prev) => prev.filter((i) => i.key !== item.key))}
                        className="col-span-1 p-2 hover:bg-accent rounded-lg text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Observação</label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
              <button
                onClick={() => setModalAberto(false)}
                className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={salvando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Registrar Recebimento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
