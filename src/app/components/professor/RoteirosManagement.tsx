import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Plus, Edit, Trash2, X, Sparkles, Trash } from "lucide-react";
import { toast } from "sonner";
import { roteirosApi } from "../../../lib/api/roteiros";
import { produtosApi } from "../../../lib/api/produtos";
import { mensagemDeErro } from "../../auth/AuthContext";
import type {
  MaterialRoteiroRequest,
  NivelEnsino,
  NivelSeguranca,
  ProdutoResponse,
  RoteiroRequest,
  RoteiroResponse,
} from "../../../lib/api/types";

interface MaterialForm extends MaterialRoteiroRequest {
  key: string;
}

function buildEmptyForm(): RoteiroRequest {
  return {
    titulo: "",
    objetivo: "",
    procedimento: "",
    tema: "",
    disciplina: "",
    nivelEnsino: null,
    nivelSeguranca: null,
    tempoEstimadoMinutos: null,
    publicado: false,
    geradoPorIa: false,
    materiais: [],
  };
}

export function RoteirosManagement() {
  const [roteiros, setRoteiros] = useState<RoteiroResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<RoteiroResponse | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [geradoPorIa, setGeradoPorIa] = useState(false);

  const [form, setForm] = useState<RoteiroRequest>(buildEmptyForm());
  const [materiais, setMateriais] = useState<MaterialForm[]>([]);

  const [iaAberta, setIaAberta] = useState(false);
  const [iaForm, setIaForm] = useState({ tema: "", nivelEnsino: "" as NivelEnsino | "", disciplina: "", objetivo: "" });
  const [gerandoIa, setGerandoIa] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [roteirosData, produtosData] = await Promise.all([roteirosApi.listar(), produtosApi.listar()]);
      setRoteiros(roteirosData);
      setProdutos(produtosData);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar roteiros."));
    } finally {
      setLoading(false);
    }
  };

  const abrirNovo = () => {
    setEditando(null);
    setForm(buildEmptyForm());
    setMateriais([]);
    setGeradoPorIa(false);
    setModalAberto(true);
  };

  const abrirEdicao = (roteiro: RoteiroResponse) => {
    setEditando(roteiro);
    setForm({
      titulo: roteiro.titulo,
      objetivo: roteiro.objetivo ?? "",
      procedimento: roteiro.procedimento ?? "",
      tema: roteiro.tema ?? "",
      disciplina: roteiro.disciplina ?? "",
      nivelEnsino: roteiro.nivelEnsino,
      nivelSeguranca: roteiro.nivelSeguranca,
      tempoEstimadoMinutos: roteiro.tempoEstimadoMinutos,
      publicado: roteiro.publicado,
      geradoPorIa: roteiro.geradoPorIa,
      materiais: [],
    });
    setMateriais(
      roteiro.materiais.map((m) => ({
        key: crypto.randomUUID(),
        produtoId: m.produtoId,
        quantidadeNecessaria: m.quantidadeNecessaria,
        observacao: m.observacao,
      }))
    );
    setGeradoPorIa(roteiro.geradoPorIa);
    setModalAberto(true);
  };

  const gerarSugestaoIa = async () => {
    if (!iaForm.tema.trim()) {
      toast.error("Informe o tema da prática.");
      return;
    }
    setGerandoIa(true);
    try {
      const sugestao = await roteirosApi.sugestaoIa({
        tema: iaForm.tema,
        nivelEnsino: iaForm.nivelEnsino || null,
        disciplina: iaForm.disciplina || null,
        objetivo: iaForm.objetivo || null,
      });
      setForm((prev) => ({
        ...prev,
        titulo: sugestao.titulo || prev.titulo,
        objetivo: sugestao.objetivo ?? prev.objetivo,
        procedimento: sugestao.procedimento ?? prev.procedimento,
        tema: iaForm.tema,
        disciplina: iaForm.disciplina || prev.disciplina,
        nivelEnsino: (iaForm.nivelEnsino || prev.nivelEnsino) as NivelEnsino | null,
        tempoEstimadoMinutos: sugestao.tempoEstimadoMinutos ?? prev.tempoEstimadoMinutos,
      }));
      setMateriais(
        sugestao.materiaisSugeridos.map((m) => ({
          key: crypto.randomUUID(),
          produtoId: m.produtoId,
          quantidadeNecessaria: m.quantidadeNecessaria,
          observacao: null,
        }))
      );
      setGeradoPorIa(true);
      setIaAberta(false);
      toast.success("Sugestão gerada. Revise antes de salvar.");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível gerar a sugestão com IA agora."));
    } finally {
      setGerandoIa(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim()) {
      toast.error("Informe o título do roteiro.");
      return;
    }
    setSalvando(true);
    try {
      const payload: RoteiroRequest = {
        ...form,
        geradoPorIa,
        materiais: materiais
          .filter((m) => m.produtoId)
          .map(({ key, ...rest }) => rest),
      };
      if (editando) {
        await roteirosApi.atualizar(editando.id, payload);
        toast.success("Roteiro atualizado.");
      } else {
        await roteirosApi.criar(payload);
        toast.success("Roteiro criado.");
      }
      setModalAberto(false);
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao salvar roteiro."));
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (roteiro: RoteiroResponse) => {
    if (!confirm(`Remover o roteiro "${roteiro.titulo}"?`)) return;
    try {
      await roteirosApi.remover(roteiro.id);
      toast.success("Roteiro removido.");
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não é possível remover um roteiro vinculado a um agendamento."));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Roteiros de Aula</h1>
          </div>
          <p className="text-muted-foreground">Crie e gerencie seus roteiros de prática</p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo Roteiro</span>
        </button>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Título</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Disciplina</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Materiais</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : roteiros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum roteiro cadastrado ainda
                  </td>
                </tr>
              ) : (
                roteiros.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/professor/experimentos/${r.id}`} className="font-medium hover:text-primary">
                        {r.titulo}
                      </Link>
                      {r.geradoPorIa && <span className="ml-2 text-xs text-primary">✨ IA</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.disciplina ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.materiais.length}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          r.publicado
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {r.publicado ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicao(r)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-primary"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemover(r)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-xl font-semibold">{editando ? "Editar Roteiro" : "Novo Roteiro"}</h2>
              <div className="flex items-center gap-2">
                {!editando && (
                  <button
                    onClick={() => setIaAberta(true)}
                    className="px-3 py-1.5 rounded-lg border-2 border-primary/30 text-primary text-sm flex items-center gap-1.5 hover:bg-primary/10"
                  >
                    <Sparkles size={14} />
                    Sugerir com IA
                  </button>
                )}
                <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Disciplina</label>
                  <input
                    type="text"
                    value={form.disciplina ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, disciplina: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tema</label>
                  <input
                    type="text"
                    value={form.tema ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, tema: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Objetivo</label>
                <textarea
                  value={form.objetivo ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, objetivo: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Procedimento (um passo por linha)</label>
                <textarea
                  value={form.procedimento ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, procedimento: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nível de Ensino</label>
                  <select
                    value={form.nivelEnsino ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, nivelEnsino: (e.target.value || null) as NivelEnsino | null }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">—</option>
                    <option value="FUNDAMENTAL_I">Fundamental I</option>
                    <option value="FUNDAMENTAL_II">Fundamental II</option>
                    <option value="MEDIO">Ensino Médio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nível de Segurança</label>
                  <select
                    value={form.nivelSeguranca ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nivelSeguranca: (e.target.value || null) as NivelSeguranca | null }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">—</option>
                    <option value="BAIXO">Baixo</option>
                    <option value="MEDIO">Médio</option>
                    <option value="ALTO">Alto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tempo (min)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.tempoEstimadoMinutos ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, tempoEstimadoMinutos: e.target.value ? Number(e.target.value) : null }))
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Materiais</label>
                  <button
                    type="button"
                    onClick={() =>
                      setMateriais((prev) => [
                        ...prev,
                        { key: crypto.randomUUID(), produtoId: 0, quantidadeNecessaria: 1, observacao: null },
                      ])
                    }
                    className="text-xs text-primary hover:underline"
                  >
                    + Adicionar material
                  </button>
                </div>
                <div className="space-y-2">
                  {materiais.map((m) => (
                    <div key={m.key} className="grid grid-cols-12 gap-2 items-center">
                      <select
                        value={m.produtoId}
                        onChange={(e) =>
                          setMateriais((prev) =>
                            prev.map((it) => (it.key === m.key ? { ...it, produtoId: Number(e.target.value) } : it))
                          )
                        }
                        className="col-span-7 px-3 py-2 rounded-lg border-2 border-border bg-background text-sm"
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
                      <input
                        type="number"
                        min={1}
                        value={m.quantidadeNecessaria}
                        onChange={(e) =>
                          setMateriais((prev) =>
                            prev.map((it) =>
                              it.key === m.key ? { ...it, quantidadeNecessaria: Number(e.target.value) } : it
                            )
                          )
                        }
                        className="col-span-4 px-3 py-2 rounded-lg border-2 border-border bg-background text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setMateriais((prev) => prev.filter((it) => it.key !== m.key))}
                        className="col-span-1 p-2 hover:bg-accent rounded-lg text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.publicado}
                  onChange={(e) => setForm((p) => ({ ...p, publicado: e.target.checked }))}
                />
                Publicar roteiro (visível a outros professores no catálogo)
              </label>
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
                {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Roteiro"}
              </button>
            </div>
          </div>
        </div>
      )}

      {iaAberta && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIaAberta(false)} />
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Sugestão com IA
              </h2>
              <button onClick={() => setIaAberta(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Tema <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={iaForm.tema}
                  onChange={(e) => setIaForm((p) => ({ ...p, tema: e.target.value }))}
                  placeholder="Ex: Densidade dos líquidos"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nível de Ensino</label>
                <select
                  value={iaForm.nivelEnsino}
                  onChange={(e) => setIaForm((p) => ({ ...p, nivelEnsino: e.target.value as NivelEnsino | "" }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="">—</option>
                  <option value="FUNDAMENTAL_I">Fundamental I</option>
                  <option value="FUNDAMENTAL_II">Fundamental II</option>
                  <option value="MEDIO">Ensino Médio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Disciplina</label>
                <input
                  type="text"
                  value={iaForm.disciplina}
                  onChange={(e) => setIaForm((p) => ({ ...p, disciplina: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
              <button
                onClick={() => setIaAberta(false)}
                className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={gerarSugestaoIa}
                disabled={gerandoIa}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
              >
                {gerandoIa ? "Gerando..." : "Gerar sugestão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
