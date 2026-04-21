import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ReagenteForm {
  nome: string;
  formula: string;
  descricao: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  localizacao: string;
  tipo: string;
}

interface CadastrarReagenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reagente: ReagenteForm) => void;
  reagenteParaEditar?: ReagenteForm | null;
}

const emptyForm: ReagenteForm = {
  nome: "",
  formula: "",
  descricao: "",
  quantidade: 0,
  quantidadeMinima: 0,
  unidade: "ml",
  localizacao: "",
  tipo: "REAGENTE",
};

const unidadeOptions = [
  { value: "ml", label: "ml" },
  { value: "g", label: "g" },
  { value: "un", label: "Unidades" },
  { value: "L", label: "L" },
  { value: "kg", label: "kg" },
];

const tipoOptions = [
  { value: "REAGENTE", label: "Reagente" },
  { value: "VIDRARIA", label: "Vidraria" },
  { value: "COLECAO_ZOOLOGICA", label: "Coleção Zoológica" },
  { value: "MODELO_ANATOMICO", label: "Modelo Anatômico" },
  { value: "OUTROS", label: "Outros" },
];

export function CadastrarReagenteModal({
  isOpen,
  onClose,
  onSave,
  reagenteParaEditar,
}: CadastrarReagenteModalProps) {
  const [form, setForm] = useState<ReagenteForm>(emptyForm);

  useEffect(() => {
    if (reagenteParaEditar) {
      setForm(reagenteParaEditar);
    } else {
      setForm(emptyForm);
    }
  }, [reagenteParaEditar, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantidade" || name === "quantidadeMinima"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.nome.trim()) return;
    onSave(form);
    setForm(emptyForm);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!reagenteParaEditar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Editar Reagente" : "Novo Reagente"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Nome */}
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

          {/* Fórmula */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Fórmula Química
            </label>
            <input
              type="text"
              name="formula"
              value={form.formula}
              onChange={handleChange}
              placeholder="Ex: HCl, NaOH, CuSO₄"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição opcional do reagente..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Quantidade + Quantidade Mínima */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantidade"
                value={form.quantidade}
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
                name="quantidadeMinima"
                value={form.quantidadeMinima}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Unidade + Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Unidade
              </label>
              <select
                name="unidade"
                value={form.unidade}
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
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                {tipoOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Localização
            </label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              placeholder="Ex: Armário A, Prateleira 2"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            {isEditing ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}