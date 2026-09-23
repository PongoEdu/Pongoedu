import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { categoriasApi } from "../../../../lib/api/categorias";
import { lotesApi } from "../../../../lib/api/lotes";
import { mensagemDeErro } from "../../../auth/AuthContext";
import type { CategoriaResponse, LoteResponse, ProdutoRequest, ProdutoResponse, UnidadeMedida } from "../../../../lib/api/types";

interface CadastrarReagenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: ProdutoRequest) => Promise<void> | void;
  produtoParaEditar?: ProdutoResponse | null;
}

const unidadeOptions: { value: UnidadeMedida; label: string }[] = [
  { value: "UNIDADE", label: "Unidade" },
  { value: "GRAMA", label: "Grama (g)" },
  { value: "QUILOGRAMA", label: "Quilograma (kg)" },
  { value: "MILILITRO", label: "Mililitro (ml)" },
  { value: "LITRO", label: "Litro (L)" },
  { value: "CAIXA", label: "Caixa" },
  { value: "PACOTE", label: "Pacote" },
  { value: "FRASCO", label: "Frasco" },
];

function buildEmptyForm(): ProdutoRequest {
  return {
    codigo: "",
    nome: "",
    descricao: "",
    categoriaId: 0,
    loteId: null,
    unidadeMedida: "UNIDADE",
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    localizacao: "",
  };
}

export function CadastrarReagenteModal({
  isOpen,
  onClose,
  onSave,
  produtoParaEditar,
}: CadastrarReagenteModalProps) {
  const [form, setForm] = useState<ProdutoRequest>(buildEmptyForm());
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [criarNovoLote, setCriarNovoLote] = useState(false);
  const [novoLote, setNovoLote] = useState({ codigo: "", dataValidade: "", fornecedor: "" });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    categoriasApi.listar(true).then(setCategorias).catch(() => setCategorias([]));
    lotesApi.listar().then(setLotes).catch(() => setLotes([]));
  }, [isOpen]);

  useEffect(() => {
    if (produtoParaEditar) {
      setForm({
        codigo: produtoParaEditar.codigo,
        nome: produtoParaEditar.nome,
        descricao: produtoParaEditar.descricao ?? "",
        categoriaId: produtoParaEditar.categoria.id,
        loteId: produtoParaEditar.lote?.id ?? null,
        unidadeMedida: produtoParaEditar.unidadeMedida,
        quantidadeEstoque: produtoParaEditar.quantidadeEstoque,
        estoqueMinimo: produtoParaEditar.estoqueMinimo,
        localizacao: produtoParaEditar.localizacao ?? "",
      });
    } else {
      setForm(buildEmptyForm());
    }
    setCriarNovoLote(false);
    setNovoLote({ codigo: "", dataValidade: "", fornecedor: "" });
  }, [produtoParaEditar, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantidadeEstoque" || name === "estoqueMinimo" || name === "categoriaId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.codigo.trim() || !form.nome.trim() || !form.categoriaId) {
      toast.error("Preencha código, nome e categoria.");
      return;
    }

    setSalvando(true);
    try {
      let payload = { ...form };

      if (criarNovoLote && novoLote.codigo.trim()) {
        const lote = await lotesApi.criar({
          codigo: novoLote.codigo,
          fornecedor: novoLote.fornecedor || null,
          dataValidade: novoLote.dataValidade || null,
        });
        payload = { ...payload, loteId: lote.id };
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao salvar produto."));
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!produtoParaEditar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <h2 className="text-xl font-semibold">{isEditing ? "Editar Produto" : "Novo Produto"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ex: HCl-500"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value={0} disabled>
                  Selecione...
                </option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Ácido Clorídrico"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao ?? ""}
              onChange={handleChange}
              placeholder="Descrição opcional do produto..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantidadeEstoque"
                value={form.quantidadeEstoque}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Qtd. Mínima <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="estoqueMinimo"
                value={form.estoqueMinimo}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Unidade</label>
              <select
                name="unidadeMedida"
                value={form.unidadeMedida}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                {unidadeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Localização</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao ?? ""}
              onChange={handleChange}
              placeholder="Ex: Armário A, Prateleira 2"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Lote</label>
              <button
                type="button"
                onClick={() => setCriarNovoLote((v) => !v)}
                className="text-xs text-primary hover:underline"
              >
                {criarNovoLote ? "Selecionar lote existente" : "+ Cadastrar novo lote"}
              </button>
            </div>

            {criarNovoLote ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Código do lote"
                  value={novoLote.codigo}
                  onChange={(e) => setNovoLote((p) => ({ ...p, codigo: e.target.value }))}
                  className="px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="date"
                  placeholder="Validade"
                  value={novoLote.dataValidade}
                  onChange={(e) => setNovoLote((p) => ({ ...p, dataValidade: e.target.value }))}
                  className="px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  placeholder="Fornecedor (opcional)"
                  value={novoLote.fornecedor}
                  onChange={(e) => setNovoLote((p) => ({ ...p, fornecedor: e.target.value }))}
                  className="col-span-2 px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ) : (
              <select
                value={form.loteId ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, loteId: e.target.value ? Number(e.target.value) : null }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="">Sem lote</option>
                {lotes.map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    {lote.codigo} {lote.dataValidade ? `(val. ${lote.dataValidade})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
          >
            {salvando ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
