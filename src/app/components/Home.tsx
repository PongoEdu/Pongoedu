import { Link } from "react-router";
import { Beaker, TestTube, Bug, Heart, FlaskConical, Shield, BookOpen, Bell, Gamepad2, Route, Trophy, Award } from "lucide-react";
import { MascotLogo } from "./mascot-logo";
import { FeatureCard } from "./feature-card";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      {/* Header */}
      <header className="border-b-2 border-border bg-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MascotLogo />
            <div>
              <h1 className="text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl">PongoEdu</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Gestão Inteligente de Laboratórios</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <button className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 bg-[#ffffff]">
                <span className="material-symbols-outlined text-lg sm:text-xl text-[#ffffff]">login</span>
                <span className="text-[#ffffff]">Entrar</span>
              </button>
            </Link>
            <Link to="/criar-conta">
              <button className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-sm sm:text-base">Criar Conta</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 text-center">
        <div className="flex justify-center mb-6">
          <MascotLogo />
        </div>

        <h1 className="mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
          Transforme a gestão do seu laboratório
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-6 sm:mb-8 px-3">O único sistema que conecta o laboratório <span className="text-primary font-bold">tem</span> ao que os professores <span className="text-secondary font-bold">precisam ensinar</span> — em tempo real!</p>

        <div className="flex gap-3 justify-center flex-wrap px-3">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-2xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl text-sm sm:text-base">
            Começar Agora
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-card border-2 border-border text-foreground rounded-2xl hover:scale-105 transition-transform text-sm sm:text-base">
            Ver Demonstração
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">100%</div>
            <div className="text-foreground text-sm sm:text-base">Inventário Centralizado</div>
          </div>
          <div className="bg-secondary/10 border-2 border-secondary/20 rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-secondary mb-1 sm:mb-2">70%</div>
            <div className="text-foreground text-sm sm:text-base">Redução de Tempo</div>
          </div>
          <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">50%</div>
            <div className="text-foreground text-sm sm:text-base">Mais Reaproveitamento</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-2 sm:mb-3 px-2">Módulos de Inventário</h2>
          <p className="text-muted-foreground text-sm sm:text-base px-3">Gerencie todos os materiais do seu laboratório em um só lugar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
          <FeatureCard
            icon={TestTube}
            title="Reagentes Químicos"
            description="Controle completo com FISPQ, validade e alertas de segurança"
            color="green"
          />
          <FeatureCard
            icon={Beaker}
            title="Vidraria"
            description="Rastreie cada item com estado de conservação e localização"
            color="purple"
          />
          <FeatureCard
            icon={Bug}
            title="Coleção Zoológica"
            description="Catalogação taxonômica completa com registro fotográfico"
            color="green"
          />
          <FeatureCard
            icon={Heart}
            title="Modelos Anatômicos"
            description="Gestão de peças didáticas com controle de empréstimo"
            color="purple"
          />
        </div>

        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-2 sm:mb-3 px-2">Funcionalidades Inteligentes</h2>
          <p className="text-muted-foreground text-sm sm:text-base px-3">Recursos que facilitam o dia a dia do laboratório</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FeatureCard
            icon={Shield}
            title="Conformidade"
            description="Atenda normas ABNT e ANVISA com alertas automáticos"
            color="purple"
          />
          <FeatureCard
            icon={BookOpen}
            title="Roteiros Pedagógicos"
            description="Vincule práticas ao inventário para planejamento eficiente"
            color="green"
          />
          <FeatureCard
            icon={Bell}
            title="Alertas Inteligentes"
            description="Notificações de vencimento, estoque baixo e temperatura"
            color="purple"
          />
          <FeatureCard
            icon={FlaskConical}
            title="Histórico Completo"
            description="Rastreie cada movimentação com responsável e finalidade"
            color="green"
          />
        </div>
      </section>

      {/* Student Gamification Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-2 sm:mb-3 px-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Portal do Aluno Gamificado</h2>
          <p className="text-muted-foreground text-sm sm:text-base px-3">Aprendizado interativo com trilhas personalizadas e rankings motivadores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Left Card - Trilhas e Jogos */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/30 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
              </div>
              <h3 className="text-secondary">Atividades em Formato de Jogos</h3>
            </div>
            <p className="text-foreground/80 mb-4 text-sm sm:text-base">
              Professores criam trilhas de aprendizado moldadas para cada aula, transformando práticas de laboratório em desafios interativos e divertidos.
            </p>
            <div className="flex items-start gap-2 mb-3">
              <Route className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-secondary text-sm sm:text-base">Trilhas Personalizadas</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sequências de atividades adaptadas a cada aula e conteúdo</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Award className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-secondary text-sm sm:text-base">Desafios Progressivos</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Níveis que evoluem conforme o domínio do conteúdo</p>
              </div>
            </div>
          </div>

          {/* Right Card - Rankings e Selos */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-primary">Rankings e Conquistas</h3>
            </div>
            <p className="text-foreground/80 mb-4 text-sm sm:text-base">
              Sistema de pontuação e selos motiva os alunos a se dedicarem mais nas atividades práticas e teóricas do laboratório.
            </p>
            <div className="flex items-start gap-2 mb-3">
              <Trophy className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-primary text-sm sm:text-base">Rankings por Turma</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Competição saudável entre alunos com placar em tempo real</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-primary text-sm sm:text-base">Selos de Conquista</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Badges especiais por desempenho e conclusão de trilhas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Badges */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8">
          <h3 className="text-center mb-5 sm:mb-6">Exemplos de Selos de Conquista</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-xs sm:text-sm">Químico Mestre</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <Bug className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-xs sm:text-sm">Explorador Bio</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-xs sm:text-sm">Top 3 da Turma</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-xs sm:text-sm">100% Completo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-white mb-3 sm:mb-4 px-2">Pronto para transformar seu laboratório?</h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-3">
            Junte-se a instituições que já estão revolucionando a gestão de laboratórios didáticos
          </p>
          <button className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-primary rounded-2xl hover:scale-105 transition-transform shadow-xl text-sm sm:text-base text-[#7c3aed]">Comece Gratuitamente</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t-2 border-border py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            © 2026 PongoEdu. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
