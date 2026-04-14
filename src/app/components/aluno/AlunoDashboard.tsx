import {
  BookOpen,
  ClipboardList,
  FlaskConical,
  Gamepad2,
  Users,
  Trophy,
  Flame,
  Star,
  TrendingUp,
} from "lucide-react";

export function AlunoDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Olá, aluno 👋</h1>
        <p className="text-muted-foreground">
          Continue sua jornada e mantenha sua ofensiva ativa 🚀
        </p>
      </div>

      {/* Stats + Gamificação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Ofensiva */}
        <div className="bg-gradient-to-br from-orange-200/40 to-orange-100 border-2 border-orange-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-3xl text-orange-500">7</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Ofensiva (dias)</h3>
        </div>

        {/* XP */}
        <div className="bg-gradient-to-br from-yellow-200/40 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl text-yellow-500">1240</span>
          </div>
          <h3 className="text-sm text-muted-foreground">XP Total</h3>
        </div>

        {/* Ranking */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-3xl text-primary">#3</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Posição na Turma</h3>
        </div>

        {/* Progresso */}
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-secondary" />
            <span className="text-3xl text-secondary">68%</span>
          </div>
          <h3 className="text-sm text-muted-foreground">Progresso Geral</h3>
        </div>
      </div>

      {/* Games estilo Duolingo */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Trilha de Aprendizado 🎮</h2>
        <div className="bg-card border-2 border-border rounded-xl p-6">
          <div className="space-y-4">

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm">Química - Átomo</p>
                  <p className="text-xs text-muted-foreground">Concluído</p>
                </div>
              </div>
              <span className="text-green-600 text-sm">✔</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-secondary" />
                <div>
                  <p className="text-sm">Ligações Químicas</p>
                  <p className="text-xs text-muted-foreground">Em progresso</p>
                </div>
              </div>
              <span className="text-yellow-600 text-sm">65%</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/20 opacity-60">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6" />
                <div>
                  <p className="text-sm">Reações Químicas</p>
                  <p className="text-xs text-muted-foreground">Bloqueado</p>
                </div>
              </div>
              <span className="text-muted-foreground text-sm">🔒</span>
            </div>

          </div>
        </div>
      </div>

      {/* Ranking da turma */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Ranking da Turma 🏆</h2>
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Posição</th>
                <th className="px-6 py-3 text-left text-sm">Aluno</th>
                <th className="px-6 py-3 text-left text-sm">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-yellow-100/40">
                <td className="px-6 py-4 text-sm">🥇 1º</td>
                <td className="px-6 py-4 text-sm">Ana</td>
                <td className="px-6 py-4 text-sm">1500</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm">🥈 2º</td>
                <td className="px-6 py-4 text-sm">Carlos</td>
                <td className="px-6 py-4 text-sm">1320</td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-6 py-4 text-sm">🥉 3º (Você)</td>
                <td className="px-6 py-4 text-sm">Você</td>
                <td className="px-6 py-4 text-sm">1240</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Atividades */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Atividades Pendentes</h2>
        <div className="bg-card border-2 border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="text-sm">Relatório de laboratório - vence amanhã</span>
          </div>

          <div className="flex items-center gap-3">
            <FlaskConical className="w-5 h-5 text-secondary" />
            <span className="text-sm">Prática: Titulação</span>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm">Leitura: Ligações químicas</span>
          </div>
        </div>
      </div>

      {/* Atividades recentes */}
      <div>
        <h2 className="text-xl mb-4">Atividades Recentes</h2>
        <div className="bg-card border-2 border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <p className="text-sm">Você completou o módulo "Átomo"</p>
          </div>

          <div className="flex items-center gap-4">
            <Users className="w-5 h-5 text-secondary" />
            <p className="text-sm">Você subiu para 3º lugar no ranking</p>
          </div>
        </div>
      </div>
    </div>
  );
}