import { useEffect, useState } from "react";
import { TestTube, Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { CadastrarReagenteModal } from "../components/reagentes/CadastrarReagenteModal";

interface Reagente {
  id: number;
  nome: string;
  formula: string;
  descricao: string;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  localizacao: string;
  tipo: string;
  status: string;
}

type TipoFiltro = "todos" | "REAGENTE" | "VIDRARIA" | "COLECAO_ZOOLOGICA" | "MODELO_ANATOMICO" | "OUTROS";

export function ReagentesManagement() {
  const [reagentes, setReagentes] = useState<Reagente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("todos");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    fetchReagentes();
  }, []);

  const fetchReagentes = async () => {
    setLoading(true);
    try {
      localStorage.setItem("token", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJ1c3VhcmlvSWQiOjUsImlhdCI6MTc3NjgwMjM0MiwiZXhwIjoxNzc2ODg4NzQyfQ.tuCFbr9d0jYnNH013AbaB9f4jTIaR9pJgvCiqTVs3YHbP_lr-GR6hRoxop8BmtJJ4H4EBRvU9053nti1ISdt7w")
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/v1/reagentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReagentes(data);
    } catch (err) {
      console.error("Erro ao buscar reagentes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return { label: "Disponível", color: "bg-green-100 text-green-600 border-green-200" };
      case "BAIXO":
        return { label: "Baixo", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
      case "CRITICO":
        return { label: "Crítico", color: "bg-red-100 text-red-600 border-red-200" };
      case "ESGOTADO":
        return { label: "Esgotado", color: "bg-gray-100 text-gray-600 border-gray-200" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-600 border-gray-200" };
    }
  };

  const filteredReagentes = reagentes.filter((r) => {
    const matchesSearch =
      r.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.formula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.localizacao?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFiltro === "todos" || r.tipo === tipoFiltro;

    return matchesSearch && matchesTipo;
  });

  const tipoOptions: { value: TipoFiltro; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "REAGENTE", label: "Reagentes" },
    { value: "VIDRARIA", label: "Vidrarias" },
    { value: "COLECAO_ZOOLOGICA", label: "Coleção Zoológica" },
    { value: "MODELO_ANATOMICO", label: "Modelos Anatômicos" },
    { value: "OUTROS", label: "Outros" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <TestTube className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Reagentes</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie o estoque de reagentes, vidrarias e materiais do laboratório
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo Reagente</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, fórmula ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as TipoFiltro)}
            className="pl-10 pr-8 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[180px]"
          >
            {tipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredReagentes.length} de {reagentes.length} itens
        </p>
      </div>

      {/* Table */}
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Fórmula</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Unidade</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Localização</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReagentes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <TestTube className="w-12 h-12 text-muted-foreground/50" />
                      <p>Nenhum item encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReagentes.map((reagente) => {
                  const status = getStatusBadge(reagente.status);
                  return (
                    <tr
                      key={reagente.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium">{reagente.nome}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {reagente.formula}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={reagente.quantidade === 0 ? "text-red-600 font-medium" : ""}>
                          {reagente.quantidade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{reagente.unidade}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{reagente.localizacao}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-accent rounded-lg transition-colors text-primary"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards — usando status do back */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Disponível</p>
          <p className="text-2xl font-bold text-green-700">
            {reagentes.filter((r) => r.status === "DISPONIVEL").length}
          </p>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 mb-1">Baixo</p>
          <p className="text-2xl font-bold text-yellow-700">
            {reagentes.filter((r) => r.status === "BAIXO").length}
          </p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Crítico</p>
          <p className="text-2xl font-bold text-red-700">
            {reagentes.filter((r) => r.status === "CRITICO").length}
          </p>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Esgotado</p>
          <p className="text-2xl font-bold text-gray-700">
            {reagentes.filter((r) => r.status === "ESGOTADO").length}
          </p>
        </div>
      </div>

      <CadastrarReagenteModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={async (reagente) => {
          try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:8080/api/v1/reagentes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(reagente),
            });
            fetchReagentes();
          } catch (err) {
            console.error("Erro ao salvar:", err);
          }
        }}
      />
    </div>
  );
}
