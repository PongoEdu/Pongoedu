import { useEffect, useState } from "react";
import { Layers, Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { categoriasApi } from "../../../lib/api/categorias";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { CategoriaRequest, CategoriaResponse } from "../../../lib/api/types";

const vazio: CategoriaRequest = { nome: "", descricao: "", permiteEmprestimo: false, movimentaEstoque: true };

export function CategoriasManagement() {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<CategoriaResponse | null>(null);
  const [form, setForm] = useState<CategoriaRequest>(vazio);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      setCategorias(await categoriasApi.listar(false));
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar categorias."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirNovo = () => {
    setEditando(null);
    setForm(vazio);
    setModalAberto(true);
  };

  const abrirEdicao = (c: CategoriaResponse) => {
    setEditando(c);
    setForm({
      nome: c.nome,
      descricao: c.descricao ?? "",
      permiteEmprestimo: c.permiteEmprestimo,
      movimentaEstoque: c.movimentaEstoque,
    });
    setModalAberto(true);
  };

  const salvar = async () => {
    if (!form.nome.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }
    setSalvando(true);
    try {
      const payload = { ...form, nome: form.nome.trim(), descricao: form.descricao?.trim() || null };
      if (editando) await categoriasApi.atualizar(editando.id, payload);
      else await categoriasApi.criar(payload);
      toast.success(editando ? "Categoria atualizada." : "Categoria criada.");
      setModalAberto(false);
      carregar();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não foi possível salvar a categoria."));
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (c: CategoriaResponse) => {
    if (!confirm(`Excluir a categoria "${c.nome}"?`)) return;
    try {
      await categoriasApi.remover(c.id);
      toast.success("Categoria removida.");
      carregar();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Não é possível remover uma categoria com produtos vinculados."));
    }
  };

  const filtradas = categorias.filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" />
            <h1 className="text-3xl">Categoria de Produtos</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie as categorias de materiais e configure as permissões de empréstimo.
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border-2 border-border bg-background py-3 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-border bg-card">
        <table className="w-full">
          <thead className="border-b-2 border-border bg-accent">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium">Categoria</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Descrição</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Permite empréstimo</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Movimenta estoque</th>
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
            ) : filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhuma categoria encontrada
                </td>
              </tr>
            ) : (
              filtradas.map((c) => (
                <tr key={c.id} className="border-b border-border transition-colors hover:bg-accent/50">
                  <td className="px-6 py-4 font-medium">{c.nome}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.descricao ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        c.permiteEmprestimo
                          ? "border-green-200 bg-green-100 text-green-700"
                          : "border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.permiteEmprestimo ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        c.movimentaEstoque
                          ? "border-green-200 bg-green-100 text-green-700"
                          : "border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.movimentaEstoque ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEdicao(c)}
                        title="Editar"
                        className="rounded-lg p-2 text-primary transition-colors hover:bg-accent"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => remover(c)}
                        title="Excluir"
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-accent"
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

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative mx-4 w-full max-w-lg rounded-2xl border-2 border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-border p-6">
              <h2 className="text-xl font-semibold">{editando ? "Editar Categoria" : "Nova Categoria"}</h2>
              <button onClick={() => setModalAberto(false)} className="rounded-lg p-2 hover:bg-accent">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex.: Reagentes"
                  className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 transition-colors focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Descrição</label>
                <textarea
                  rows={3}
                  value={form.descricao ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                  className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 transition-colors focus:border-primary focus:outline-none"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.permiteEmprestimo}
                  onChange={(e) => setForm((p) => ({ ...p, permiteEmprestimo: e.target.checked }))}
                />
                <span className="text-sm">Produtos desta categoria podem ser emprestados</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.movimentaEstoque}
                  onChange={(e) => setForm((p) => ({ ...p, movimentaEstoque: e.target.checked }))}
                />
                <span className="text-sm">
                  Movimenta saldo de estoque
                  <span className="block text-xs text-muted-foreground">
                    Quando ativo, preparações, empréstimos e recebimentos dão baixa ou entrada no saldo dos produtos
                    desta categoria.
                  </span>
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t-2 border-border p-6">
              <button
                onClick={() => setModalAberto(false)}
                className="rounded-xl border-2 border-border px-5 py-2.5 transition-colors hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="rounded-xl bg-primary px-6 py-2.5 text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar Categoria"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
