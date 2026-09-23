import { useEffect, useState } from "react";
import { ClipboardList, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { emprestimosApi } from "../../../lib/api/emprestimos";
import { produtosApi } from "../../../lib/api/produtos";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { EmprestimoResponse, ProdutoResponse, SituacaoEmprestimo } from "../../../lib/api/types";

const situacaoBadge: Record<SituacaoEmprestimo, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  APROVADO: { label: "Aprovado", color: "bg-blue-100 text-blue-700 border-blue-200" },
  RECUSADO: { label: "Recusado", color: "bg-red-100 text-red-700 border-red-200" },
  RETIRADO: { label: "Retirado", color: "bg-purple-100 text-purple-700 border-purple-200" },
  DEVOLVIDO: { label: "Devolvido", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function MeusEmprestimos() {
  const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState({
    produtoId: 0,
    quantidade: 1,
    dataInicio: new Date().toISOString().slice(0, 10),
    dataFim: new Date().toISOString().slice(0, 10),
    finalidade: "",
  });

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [emprestimosData, produtosData] = await Promise.all([
        emprestimosApi.listar(),
        produtosApi.emprestaveis(),
      ]);
      setEmprestimos(emprestimosData);
      setProdutos(produtosData);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar empréstimos."));
    } finally {
      setLoading(false);
    }
  };

  const abrirNovo = () => {
    setForm({
      produtoId: produtos[0]?.id ?? 0,
      quantidade: 1,
      dataInicio: new Date().toISOString().slice(0, 10),
      dataFim: new Date().toISOString().slice(0, 10),
      finalidade: "",
    });
    setModalAberto(true);
  };

  const handleSubmit = async () => {
    if (!form.produtoId) {
      toast.error("Selecione o equipamento.");
      return;
    }
    setSalvando(true);
    try {
      await emprestimosApi.solicitar({
        produtoId: form.produtoId,
        quantidade: form.quantidade,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        finalidade: form.finalidade || null,
      });
      toast.success("Solicitação de empréstimo enviada.");
      setModalAberto(false);
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao solicitar empréstimo."));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Minhas Solicitações</h1>
          </div>
          <p className="text-muted-foreground">Solicite e acompanhe empréstimos de equipamentos do laboratório</p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Solicitar Empréstimo</span>
        </button>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Equipamento</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Período</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : emprestimos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              ) : (
                emprestimos.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{e.produtoNome}</td>
                    <td className="px-6 py-4 text-sm">{e.quantidade}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {e.dataInicio} – {e.dataFim}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[e.situacao].color}`}>
                        {situacaoBadge[e.situacao].label}
                      </span>
                      {e.atrasado && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 border border-red-200">
                          Atrasado
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

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-xl font-semibold">Solicitar Empréstimo</h2>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Equipamento</label>
                <select
                  value={form.produtoId}
                  onChange={(e) => setForm((p) => ({ ...p, produtoId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value={0} disabled>
                    Selecione...
                  </option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.quantidadeEstoque} disponíveis)
                    </option>
                  ))}
                </select>
                {produtos.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Nenhum equipamento com empréstimo habilitado no momento.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantidade}
                  onChange={(e) => setForm((p) => ({ ...p, quantidade: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Data início</label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) => setForm((p) => ({ ...p, dataInicio: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Data fim</label>
                  <input
                    type="date"
                    value={form.dataFim}
                    onChange={(e) => setForm((p) => ({ ...p, dataFim: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Finalidade</label>
                <textarea
                  value={form.finalidade}
                  onChange={(e) => setForm((p) => ({ ...p, finalidade: e.target.value }))}
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
                {salvando ? "Enviando..." : "Solicitar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
