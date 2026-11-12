import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FlaskConical, Shield, BookOpen, Bell } from "lucide-react";
import { BrandLogo } from "./mascot-logo";
import { FeatureCard } from "./feature-card";
import { CalendarioSemanal } from "./agenda/CalendarioSemanal";
import type { AgendamentoResponse } from "../../lib/api/types";
import { agendaPublicaApi, type OcupacaoPublica } from "../../lib/api/agendaPublica";

/** Converte a ocupação pública (sem dados pessoais) no formato do calendário. */
function paraAgendamentos(itens: OcupacaoPublica[]): AgendamentoResponse[] {
  return itens.map((o, i) => ({
    id: i + 1,
    professorId: 0,
    professorNome: "Reservado",
    laboratorioId: 0,
    laboratorioNome: "",
    roteiroId: 0,
    roteiroTitulo: "",
    data: o.data,
    horaInicio: o.horaInicio,
    horaFim: o.horaFim,
    situacao: o.situacao,
    observacao: null,
  }));
}

export function Home() {
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState<AgendamentoResponse[]>([]);

  const carregarSemana = useCallback((inicio: string, fim: string) => {
    agendaPublicaApi
      .ocupacao(inicio, fim)
      .then((itens) => setAgenda(paraAgendamentos(itens)))
      .catch(() => setAgenda([]));
  }, []);

  return (
    // Qualquer clique na página inicial leva ao login
    <div
      className="min-h-screen cursor-pointer bg-gradient-to-b from-background to-accent"
      onClick={() => navigate("/login")}
    >
      {/* Header */}
      <header className="border-b-2 border-border bg-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <BrandLogo />
          <div className="flex gap-2">
            <Link to="/login">
              <button className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 bg-[#ffffff]">
                <span className="material-symbols-outlined text-lg sm:text-xl text-[#ffffff]">login</span>
                <span className="text-[#ffffff]">Entrar</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-3 sm:mb-4 px-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Consulte a agenda em tempo real!</h2>
          <p className="text-muted-foreground text-base sm:text-lg px-3">
            Veja a ocupação do laboratório na semana e reserve a sua prática sem conflitos de horário
          </p>
        </div>

        <div className="mb-3">
          <CalendarioSemanal agendamentos={agenda} anonimo onSemana={carregarSemana} onSelecionar={() => navigate("/login")} />
        </div>
        <p className="mb-10 sm:mb-14 text-center text-xs text-muted-foreground">
          Ocupação atualizada em tempo real. Entre para reservar a sua prática.
        </p>

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
            description="Vincule práticas ao estoque para planejamento eficiente"
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
