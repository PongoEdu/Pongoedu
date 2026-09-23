import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TestTube, Package, AlertCircle, ShoppingCart, FlaskConical, Clock } from "lucide-react";
import { toast } from "sonner";
import { produtosApi } from "../../../lib/api/produtos";
import { solicitacoesCompraApi } from "../../../lib/api/solicitacoesCompra";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { ProdutoResponse, SolicitacaoCompraResponse } from "../../../lib/api/types";

export function AuxiliarDashboard() {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState<ProdutoResponse[]>([]);
  const [proximosVencimento, setProximosVencimento] = useState<ProdutoResponse[]>([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<SolicitacaoCompraResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      produtosApi.listar(),
      produtosApi.estoqueBaixo(),
      produtosApi.proximosVencimento(),
      solicitacoesCompraApi.listar("PENDENTE"),
    ])
      .then(([produtos, baixo, vencimento, solicitacoes]) => {
        setTotalProdutos(produtos.length);
        setEstoqueBaixo(baixo);
        setProximosVencimento(vencimento);
        setSolicitacoesPendentes(solicitacoes);
      })
      .catch((err) => toast.error(mensagemDeErro(err, "Erro ao carregar o painel.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard do Auxiliar</h1>
        <p className="text-muted-foreground">Gestão completa do laboratório e estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">{loading ? "…" : totalProdutos}</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Itens em Estoque</h3>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">{loading ? "…" : estoqueBaixo.length}</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Estoque Baixo</h3>
        </div>

        <Link
          to="/auxiliar/solicitacoes/compras"
          className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">{loading ? "…" : solicitacoesPendentes.length}</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Solicitações Pendentes</h3>
        </Link>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">{loading ? "…" : proximosVencimento.length}</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Próximos Vencimentos</h3>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-4">Alertas de Estoque</h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Item</th>
                <th className="px-6 py-3 text-left text-sm">Categoria</th>
                <th className="px-6 py-3 text-left text-sm">Quantidade Atual</th>
                <th className="px-6 py-3 text-left text-sm">Mínimo</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : estoqueBaixo.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Nenhum item com estoque baixo no momento
                  </td>
                </tr>
              ) : (
                estoqueBaixo.map((produto) => (
                  <tr key={produto.id} className="hover:bg-accent/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <TestTube className="w-5 h-5 text-primary" />
                        <span className="text-sm">{produto.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{produto.categoria.nome}</td>
                    <td className="px-6 py-4 text-sm">
                      {produto.quantidadeEstoque} {produto.unidadeMedida.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {produto.estoqueMinimo} {produto.unidadeMedida.toLowerCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          produto.statusEstoque === "CRITICO" || produto.statusEstoque === "ESGOTADO"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {produto.statusEstoque === "CRITICO"
                          ? "Crítico"
                          : produto.statusEstoque === "ESGOTADO"
                          ? "Esgotado"
                          : "Atenção"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/auxiliar/reagentes"
            className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group block"
          >
            <Package className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Cadastrar Item</h3>
            <p className="text-sm text-muted-foreground">Adicionar novo item ao estoque</p>
          </Link>

          <Link
            to="/auxiliar/solicitacoes/compras"
            className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group block"
          >
            <ShoppingCart className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Solicitações de Compra</h3>
            <p className="text-sm text-muted-foreground">Atender solicitações pendentes</p>
          </Link>

          <Link
            to="/auxiliar/solicitacoes/reservas"
            className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group block"
          >
            <FlaskConical className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Preparar Prática</h3>
            <p className="text-sm text-muted-foreground">Separar materiais para aula</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
