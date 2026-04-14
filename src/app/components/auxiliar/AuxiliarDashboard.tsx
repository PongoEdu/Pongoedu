import { TestTube, Beaker, Package, AlertCircle, TrendingUp, ShoppingCart, FlaskConical, Clock } from "lucide-react";

export function AuxiliarDashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard do Auxiliar</h1>
        <p className="text-muted-foreground">Gestão completa do laboratório e estoque</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">342</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Itens em Estoque</h3>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">8</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Estoque Baixo</h3>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">5</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Solicitações Pendentes</h3>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">12</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Próximos Vencimentos</h3>
        </div>
      </div>

      {/* Alertas de Estoque */}
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
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <TestTube className="w-5 h-5 text-primary" />
                    <span className="text-sm">Ácido Clorídrico</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Reagentes</td>
                <td className="px-6 py-4 text-sm">2 frascos</td>
                <td className="px-6 py-4 text-sm">5 frascos</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">Crítico</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Beaker className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Béquer 500ml</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Vidrarias</td>
                <td className="px-6 py-4 text-sm">8 unidades</td>
                <td className="px-6 py-4 text-sm">10 unidades</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Atenção</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <TestTube className="w-5 h-5 text-primary" />
                    <span className="text-sm">Sulfato de Cobre</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Reagentes</td>
                <td className="px-6 py-4 text-sm">150g</td>
                <td className="px-6 py-4 text-sm">200g</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Atenção</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group">
            <Package className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Cadastrar Item</h3>
            <p className="text-sm text-muted-foreground">Adicionar novo item ao estoque</p>
          </button>

          <button className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group">
            <ShoppingCart className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Nova Solicitação</h3>
            <p className="text-sm text-muted-foreground">Solicitar compra de materiais</p>
          </button>

          <button className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group">
            <FlaskConical className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Preparar Prática</h3>
            <p className="text-sm text-muted-foreground">Separar materiais para aula</p>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl mb-4">Atividades Recentes</h2>
        <div className="bg-card border-2 border-border rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TestTube className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Entrada de 10 frascos de Ácido Sulfúrico</p>
                <p className="text-xs text-muted-foreground">Há 1 hora</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Solicitação de compra aprovada: Vidrarias</p>
                <p className="text-xs text-muted-foreground">Há 3 horas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Materiais separados para prática de Titulação</p>
                <p className="text-xs text-muted-foreground">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
