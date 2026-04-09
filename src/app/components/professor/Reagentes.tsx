import { useState } from "react";
import { TestTube, Plus, Search, Edit, Trash2 } from "lucide-react";

interface Reagente {
  id: string;
  nome: string;
  formula: string;
  quantidade: string;
  validade: string;
  localizacao: string;
  status: "normal" | "baixo" | "vencido";
}

const mockReagentes: Reagente[] = [
  {
    id: "1",
    nome: "Ácido Clorídrico",
    formula: "HCl",
    quantidade: "500ml",
    validade: "2026-12-31",
    localizacao: "Armário A1",
    status: "normal",
  },
  {
    id: "2",
    nome: "Hidróxido de Sódio",
    formula: "NaOH",
    quantidade: "100g",
    validade: "2026-06-15",
    localizacao: "Armário A2",
    status: "baixo",
  },
  {
    id: "3",
    nome: "Sulfato de Cobre",
    formula: "CuSO₄",
    quantidade: "250g",
    validade: "2025-03-10",
    localizacao: "Armário B1",
    status: "vencido",
  },
];

export function Reagentes() {
  const [reagentes] = useState<Reagente[]>(mockReagentes);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReagentes = reagentes.filter((r) =>
    r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "baixo":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "vencido":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "baixo":
        return "Estoque Baixo";
      case "vencido":
        return "Vencido";
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TestTube className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Reagentes Químicos</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie reagentes com FISPQ, validade e alertas de segurança
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar reagentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2 justify-center">
          <Plus size={20} />
          <span>Novo Reagente</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm">Nome</th>
                <th className="px-6 py-4 text-left text-sm">Fórmula</th>
                <th className="px-6 py-4 text-left text-sm">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm">Validade</th>
                <th className="px-6 py-4 text-left text-sm">Localização</th>
                <th className="px-6 py-4 text-left text-sm">Status</th>
                <th className="px-6 py-4 text-left text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReagentes.map((reagente) => (
                <tr key={reagente.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">{reagente.nome}</td>
                  <td className="px-6 py-4 font-mono text-sm">{reagente.formula}</td>
                  <td className="px-6 py-4">{reagente.quantidade}</td>
                  <td className="px-6 py-4">{reagente.validade}</td>
                  <td className="px-6 py-4">{reagente.localizacao}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                        reagente.status
                      )}`}
                    >
                      {getStatusLabel(reagente.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
