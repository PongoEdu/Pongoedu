import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { agendamentosApi } from "../../../lib/api/agendamentos";
import { roteirosApi } from "../../../lib/api/roteiros";
import type { AgendamentoResponse, RoteiroResponse, SituacaoAgendamento } from "../../../lib/api/types";
import { useAuth } from "../../auth/AuthContext";
import imagemProfessor from "../../../assets/dashboard-professor.png";
import {
  AcessoRapido,
  AgendaHoje,
  DashboardGrid,
  Hero,
  PraticasLista,
  TabelaCard,
  baixarCSV,
  dataLocalISO,
  formatarDataBR,
  hhmm,
  saudacao,
  type Celula,
  type Cor,
} from "../dashboard/DashboardParts";

const STATUS_AGENDA: Record<SituacaoAgendamento, { rotulo: string; cor: Cor }> = {
  AGENDADO: { rotulo: "Em preparação", cor: "yellow" },
  PREPARADO: { rotulo: "Confirmado", cor: "green" },
  REALIZADO: { rotulo: "Realizado", cor: "blue" },
  CANCELADO: { rotulo: "Cancelado", cor: "red" },
};

function duracao(min: number | null): string {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function Dashboard() {
  const { usuario } = useAuth();
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [roteiros, setRoteiros] = useState<RoteiroResponse[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    agendamentosApi
      .listar()
      .then(setAgendamentos)
      .catch(() => toast.error("Não foi possível carregar seus agendamentos."));
    roteirosApi
      .listar()
      .then(setRoteiros)
      .catch(() => toast.error("Não foi possível carregar seus roteiros."));
  }, []);

  const hoje = dataLocalISO();
  const primeiroNome = (usuario?.nome ?? "").trim().split(/\s+/).slice(0, 2).join(" ");

  const agendaHoje = useMemo(
    () =>
      agendamentos
        .filter((a) => a.data === hoje && a.situacao !== "CANCELADO")
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
        .map((a) => ({
          inicio: hhmm(a.horaInicio),
          fim: hhmm(a.horaFim),
          titulo: a.roteiroTitulo,
          info: a.laboratorioNome,
          status: STATUS_AGENDA[a.situacao],
        })),
    [agendamentos, hoje]
  );

  const aguardando = useMemo(
    () =>
      agendamentos
        .filter((a) => a.situacao === "AGENDADO" && a.data >= hoje)
        .sort((a, b) => (a.data + a.horaInicio).localeCompare(b.data + b.horaInicio))
        .slice(0, 4)
        .map((a) => ({
          titulo: a.roteiroTitulo,
          descricao: `${a.laboratorioNome} • ${formatarDataBR(a.data)} às ${hhmm(a.horaInicio)}`,
          status: "pendente" as const,
          tempo: a.data === hoje ? "Hoje" : formatarDataBR(a.data),
        })),
    [agendamentos, hoje]
  );

  const roteirosFiltrados = roteiros.filter((r) => {
    const q = busca.toLowerCase();
    return (
      !q ||
      r.titulo.toLowerCase().includes(q) ||
      (r.disciplina ?? "").toLowerCase().includes(q) ||
      (r.tema ?? "").toLowerCase().includes(q)
    );
  });

  const linhas: Celula[][] = roteirosFiltrados.slice(0, 6).map((r) => [
    { icone: "assignment", texto: r.titulo, cor: "green" },
    r.disciplina ?? "—",
    duracao(r.tempoEstimadoMinutos),
    r.publicado ? { pill: "Público", cor: "green" } : { pill: "Rascunho", cor: "orange" },
    `${r.materiais.length} item(ns)`,
  ]);

  const exportar = () =>
    baixarCSV(
      "meus-roteiros.csv",
      ["Roteiro", "Disciplina", "Tema", "Duração", "Situação", "Materiais"],
      roteirosFiltrados.map((r) => [
        r.titulo,
        r.disciplina ?? "",
        r.tema ?? "",
        duracao(r.tempoEstimadoMinutos),
        r.publicado ? "Público" : "Rascunho",
        r.materiais.length,
      ])
    );

  return (
    <div className="p-6">
      <Hero
        badge="Portal do Professor"
        badgeIcone="school"
        titulo={`${saudacao()}${primeiroNome ? `, ${primeiroNome}` : ""}!`}
        descricao="Planeje suas práticas, acompanhe os agendamentos do laboratório e solicite os materiais que você precisa, tudo em um só lugar."
        acaoPrimaria={{ label: "Criar roteiro", icone: "add", to: "/professor/roteiros" }}
        acaoSecundaria={{ label: "Meus agendamentos", icone: "arrow_forward", to: "/professor/agendamentos/reservas" }}
        imagem={imagemProfessor}
      />

      <DashboardGrid
        principal={
          <>
            <AcessoRapido
              itens={[
                {
                  titulo: "Criar roteiro",
                  descricao: "Monte um novo roteiro de prática",
                  icone: "menu_book",
                  cor: "green",
                  to: "/professor/roteiros",
                },
                {
                  titulo: "Agendar prática",
                  descricao: "Reserve o laboratório",
                  icone: "event",
                  cor: "purple",
                  to: "/professor/agendamentos/reservas",
                },
                {
                  titulo: "Solicitar empréstimo",
                  descricao: "Peça equipamentos e modelos",
                  icone: "swap_horiz",
                  cor: "blue",
                  to: "/professor/estoque/emprestimos",
                },
              ]}
            />

            <TabelaCard
              icone="list_alt"
              cor="green"
              titulo="Meus roteiros"
              link={{ label: "Ver todos", to: "/professor/roteiros" }}
              colunas={["Roteiro", "Disciplina", "Duração", "Situação", "Materiais"]}
              linhas={linhas}
              vazio="Você ainda não criou nenhum roteiro."
              busca={busca}
              onBusca={setBusca}
              placeholderBusca="Buscar por título, disciplina ou tema..."
              onExportar={exportar}
            />
          </>
        }
        lateral={
          <>
            <AgendaHoje
              titulo="Agendamentos para hoje"
              itens={agendaHoje}
              link={{ label: "Ver todos", to: "/professor/agendamentos/reservas" }}
              vazio="Nenhum agendamento para hoje."
            />
            <PraticasLista
              titulo="Práticas aguardando"
              icone="schedule"
              cor="yellow"
              itens={aguardando}
              link={{ label: "Ver todas", to: "/professor/agendamentos/reservas" }}
              vazio="Nenhuma prática aguardando preparo."
            />
          </>
        }
      />
    </div>
  );
}
