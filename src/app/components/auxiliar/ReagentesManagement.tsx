import { useEffect, useState } from "react";
import { TestTube, Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { CadastrarReagenteModal } from "../components/reagentes/CadastrarReagenteModal";
import { produtosApi } from "../../../lib/api/produtos";
import { categoriasApi } from "../../../lib/api/categorias";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { CategoriaResponse, ProdutoRequest, ProdutoResponse, StatusEstoque } from "../../../lib/api/types";

type FiltroStatus = "todos" | StatusEstoque;

export function ReagentesManagement() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | "todos">("todos");
  const [statusFiltro, setStatusFiltro] = useState<FiltroStatus>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<ProdutoResponse | null>(null);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [produtosData, categoriasData] = await Promise.all([
        produtosApi.listar(),
        categoriasApi.listar(true),
      ]);
      setProdutos(produtosData);
      setCategorias(categoriasData);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar produtos."));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: StatusEstoque) => {
    switch (status) {
      case "DISPONIVEL":
        return { label: "Disponível", color: "bg-green-100 text-green-600 border-green-200" };
      case "BAIXO":
        return { label: "Baixo", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
      case "CRITICO":
        return { label: "Crítico", color: "bg-red-100 text-red-600 border-red-200" };
      case "ESGOTADO":
        return { label: "Esgotado", color: "bg-gray-100 text-gray-600 border-gray-200" };
    }
  };

  const abrirNovo = () => {
    setEditando(null);
    setModalAberto(true);
  };

  const abrirEdicao = (produto: ProdutoResponse) => {
    setEditando(produto);
    setModalAberto(true);
  };

  const salvarProduto = async (payload: ProdutoRequest) => {
    if (editando) {
      await produtosApi.atualizar(editando.id, payload);
      toast.success("Produto atualizado com sucesso.");
    } else {
      await produtosApi.criar(payload);
      toast.success("Produto cadastrado com sucesso.");
    }
    fetchDados();
  };

  const handleRemover = async (produto: ProdutoResponse) => {
    if (!confirm(`Remover o produto "${produto.nome}"?`)) return;
    try {
      await produtosApi.remover(produto.id);
      toast.success("Produto removido (ou inativado, se houver movimentações).");
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao remover produto."));
    }
  };

  const filteredProdutos = produtos.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.localizacao ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategoria = categoriaFiltro === "todos" || p.categoria.id === categoriaFiltro;
    const matchesStatus = statusFiltro === "todos" || p.statusEstoque === statusFiltro;

    return matchesSearch && matchesCategoria && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <TestTube className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Produtos</h1>
          </div>
          <p className="text-muted-foreground">
            Consulte e gerencie o inventário de materiais e reagentes do laboratório
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, código ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value === "todos" ? "todos" : Number(e.target.value))}
            className="pl-10 pr-8 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="todos">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as FiltroStatus)}
            className="pl-4 pr-8 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="todos">Todos os status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="BAIXO">Baixo</option>
            <option value="CRITICO">Crítico</option>
            <option value="ESGOTADO">Esgotado</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredProdutos.length} de {produtos.length} itens
        </p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Código</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Localização</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filteredProdutos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <TestTube className="w-12 h-12 text-muted-foreground/50" />
                      <p>Nenhum item encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProdutos.map((produto) => {
                  const status = getStatusBadge(produto.statusEstoque);
                  return (
                    <tr key={produto.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{produto.codigo}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{produto.nome}</span>
                        {produto.vencido && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 border border-red-200">
                            Vencido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{produto.categoria.nome}</td>
                      <td className="px-6 py-4">
                        <span className={produto.quantidadeEstoque === 0 ? "text-red-600 font-medium" : ""}>
                          {produto.quantidadeEstoque} {produto.unidadeMedida.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{produto.localizacao ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEdicao(produto)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors text-primary"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleRemover(produto)}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Disponível</p>
          <p className="text-2xl font-bold text-green-700">
            {produtos.filter((p) => p.statusEstoque === "DISPONIVEL").length}
          </p>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 mb-1">Baixo</p>
          <p className="text-2xl font-bold text-yellow-700">
            {produtos.filter((p) => p.statusEstoque === "BAIXO").length}
          </p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Crítico</p>
          <p className="text-2xl font-bold text-red-700">
            {produtos.filter((p) => p.statusEstoque === "CRITICO").length}
          </p>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Esgotado</p>
          <p className="text-2xl font-bold text-gray-700">
            {produtos.filter((p) => p.statusEstoque === "ESGOTADO").length}
          </p>
        </div>
      </div>

      <CadastrarReagenteModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={salvarProduto}
        produtoParaEditar={editando}
      />
    </div>
  );
}
