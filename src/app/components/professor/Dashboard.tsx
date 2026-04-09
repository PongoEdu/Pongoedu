import { Users, GraduationCap, BookOpen, Gamepad2, ClipboardCheck, Calendar, AlertCircle } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel de controle do professor</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">156</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Alunos</h3>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <GraduationCap className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">8</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Turmas</h3>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">12</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Atividades Ativas</h3>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">5</span>
          </div>
          <h3 className="text-sm text-muted-foreground">A Vencer</h3>
        </div>
      </div>

      {/* Atividades a Vencer */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Atividades a Vencer</h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Atividade</th>
                <th className="px-6 py-3 text-left text-sm">Turma</th>
                <th className="px-6 py-3 text-left text-sm">Data de Entrega</th>
                <th className="px-6 py-3 text-left text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    <span className="text-sm">Prática de Titulação</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">3º Ano A</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">10/04/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">Amanhã</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Game Química N2</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">2º Ano B</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">12/04/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">3 dias</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-sm">Relatório de Laboratório</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">3º Ano B</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">14/04/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">5 dias</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Estudo de Caso Biologia</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">1º Ano A</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">15/04/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">6 dias</span>
                </td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                    <span className="text-sm">Trilha Gamificada - Átomo</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">1º Ano B</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">16/04/2026</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">7 dias</span>
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
            <BookOpen className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Criar Roteiro</h3>
            <p className="text-sm text-muted-foreground">Novo roteiro de aula</p>
          </button>

          <button className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group">
            <Gamepad2 className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Novo Game</h3>
            <p className="text-sm text-muted-foreground">Criar atividade gamificada</p>
          </button>

          <button className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors text-left group">
            <Users className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="mb-1">Gerenciar Alunos</h3>
            <p className="text-sm text-muted-foreground">Ver e adicionar alunos</p>
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
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">15 novos alunos adicionados à turma 1º Ano C</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Roteiro "Titulação Ácido-Base" criado</p>
                <p className="text-xs text-muted-foreground">Ontem</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Game "Química N1" atualizado</p>
                <p className="text-xs text-muted-foreground">Há 3 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
