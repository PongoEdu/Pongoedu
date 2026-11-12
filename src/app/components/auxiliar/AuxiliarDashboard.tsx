import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { agendamentosApi } from "../../../lib/api/agendamentos";
import { emprestimosApi } from "../../../lib/api/emprestimos";
import { movimentacoesApi } from "../../../lib/api/movimentacoes";
import { solicitacoesCompraApi } from "../../../lib/api/solicitacoesCompra";
import type {
  AgendamentoResponse,
  EmprestimoResponse,
  MovimentacaoResponse,
  SituacaoEmprestimo,
  SolicitacaoCompraResponse,
} from "../../../lib/api/types";
import { useAuth } from "../../auth/AuthContext";
import imagemAuxiliar from "../../../assets/dashboard-auxiliar.png";
import {
  AcessoRapido,
  AtividadesCard,
  DashboardGrid,
  Hero,
  ResumoCard,
  TabelaCard,
  baixarCSV,
  dataLocalISO,
  formatarDataBR,
  hhmm,
  saudacao,
  type Celula,
  type Cor,
} from "../dashboard/DashboardParts";

const ATIVIDADE_EMPRESTIMO: Record<SituacaoEmprestimo, { rotulo: string; icone: string; cor: Cor }> = {
  PENDENTE: { rotulo: "Empréstimo solicitado", icone: "schedule", cor: "yellow" },
  APROVADO: { rotulo: "Empréstimo aprovado", icone: "event_available", cor: "blue" },
  RECUSADO: { rotulo: "Empréstimo recusado", icone: "cancel", cor: "red" },
  RETIRADO: { rotulo: "Empréstimo em andamento", icone: "swap_horiz", cor: "orange" },
  DEVOLVIDO: { rotulo: "Empréstimo devolvido", icone: "check_circle", cor: "green" },
  CANCELADO: { rotulo: "Empréstimo cancelado", icone: "cancel", cor: "red" },
};

const ORIGEM_LABEL: Record<string, string> = {
  RECEBIMENTO: "Recebimento",
  PREPARACAO_PRATICA: "Preparação de prática",
  EMPRESTIMO: "Empréstimo",
  DEVOLUCAO_EMPRESTIMO: "Devolução",
  AJUSTE_MANUAL: "Ajuste manual",
  DESCARTE: "Descarte",
};

function dataHoraBR(iso: string): string {
  return `${formatarDataBR(iso)} às ${hhmm(iso.slice(11))}`;
}

export function AuxiliarDashboard() {
  const { usuario } = useAuth();
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [compras, setCompras] = useState<SolicitacaoCompraResponse[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoResponse[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const falha = (msg: string) => () => toast.error(msg);
    agendamentosApi.listar().then(setAgendamentos).catch(falha("Não foi possível carregar os agendamentos."));
    solicitacoesCompraApi.listar().then(setCompras).catch(falha("Não foi possível carregar as solicitações."));
    emprestimosApi.listar().then(setEmprestimos).catch(falha("Não foi possível carregar os empréstimos."));
    movimentacoesApi.listar().then(setMovimentacoes).catch(falha("Não foi possível carregar as movimentações."));
  }, []);

  const hoje = dataLocalISO();
  const primeiroNome = (usuario?.nome ?? "").trim().split(/\s+/).slice(0, 2).join(" ");

  const resumo = useMemo(
    () => ({
      aPreparar: agendamentos.filter((a) => a.situacao === "AGENDADO" && a.data >= hoje).length,
      comprasAbertas: compras.filter((c) => c.situacao === "PENDENTE").length,
      emprestimosPendentes: emprestimos.filter((e) => e.situacao === "PENDENTE").length,
      reservasHoje: agendamentos.filter((a) => a.data === hoje && a.situacao !== "CANCELADO").length,
    }),
    [agendamentos, compras, emprestimos, hoje]
  );

  const movFiltradas = movimentacoes.filter((m) => {
    const q = busca.toLowerCase();
    return (
      !q ||
      m.produtoNome.toLowerCase().includes(q) ||
      m.usuarioNome.toLowerCase().includes(q) ||
      (ORIGEM_LABEL[m.origem] ?? m.origem).toLowerCase().includes(q)
    );
  });

  const linhas: Celula[][] = movFiltradas.slice(0, 6).map((m) => {
    const entrada = m.tipo === "ENTRADA";
    return [
      { icone: "science", texto: m.produtoNome, cor: entrada ? "green" : "orange" },
      m.quantidade,
      { pill: entrada ? "Entrada" : "Saída", cor: entrada ? "green" : "orange" },
      ORIGEM_LABEL[m.origem] ?? m.origem,
      m.usuarioNome,
    ];
  });

  const exportar = () =>
    baixarCSV(
      "movimentacoes.csv",
      ["Produto", "Quantidade", "Tipo", "Origem", "Responsável", "Data"],
      movFiltradas.map((m) => [
        m.produtoNome,
        m.quantidade,
        m.tipo === "ENTRADA" ? "Entrada" : "Saída",
        ORIGEM_LABEL[m.origem] ?? m.origem,
        m.usuarioNome,
        dataHoraBR(m.dataMovimentacao),
      ])
    );

  const atividades = [...emprestimos]
    .sort((a, b) => b.dataSolicitacao.localeCompare(a.dataSolicitacao))
    .slice(0, 4)
    .map((e) => {
      const s = ATIVIDADE_EMPRESTIMO[e.situacao];
      return {
        titulo: `${s.rotulo}: ${e.produtoNome}`,
        tempo: `${formatarDataBR(e.dataInicio)} • ${e.professorNome}`,
        icone: s.icone,
        cor: s.cor,
      };
    });

  return (
    <div className="p-6">
      <Hero
        badge="Painel do Laboratório"
        badgeIcone="inventory_2"
        titulo={`${saudacao()}${primeiroNome ? `, ${primeiroNome}` : ""}!`}
        descricao="Acompanhe o estoque, prepare as práticas agendadas e responda às solicitações de professores, com tudo organizado em um único painel."
        acaoPrimaria={{ label: "Preparar práticas", icone: "inventory_2", to: "/auxiliar/agendamentos/agenda" }}
        acaoSecundaria={{ label: "Registrar entrada", icone: "arrow_forward", to: "/auxiliar/recebimento/entradas" }}
        imagem={imagemAuxiliar}
      />

      <DashboardGrid
        principal={
          <>
            <AcessoRapido
              itens={[
                {
                  titulo: "Estoque",
                  descricao: "Consulte e gerencie os produtos",
                  icone: "inventory_2",
                  cor: "green",
                  to: "/auxiliar/estoque/produtos",
                },
                {
                  titulo: "Compras",
                  descricao: "Solicitações de reposição",
                  icone: "shopping_cart",
                  cor: "purple",
                  to: "/auxiliar/solicitacoes/compras",
                },
                {
                  titulo: "Empréstimos",
                  descricao: "Aprove e acompanhe pedidos",
                  icone: "swap_horiz",
                  cor: "blue",
                  to: "/auxiliar/solicitacoes/emprestimos",
                },
              ]}
            />

            <TabelaCard
              icone="swap_vert"
              cor="orange"
              titulo="Últimas movimentações"
              colunas={["Produto", "Quantidade", "Tipo", "Origem", "Responsável"]}
              linhas={linhas}
              vazio="Nenhuma movimentação registrada."
              busca={busca}
              onBusca={setBusca}
              placeholderBusca="Buscar por produto, origem ou responsável..."
              onExportar={exportar}
            />
          </>
        }
        lateral={
          <>
            <ResumoCard
              titulo="Resumo operacional"
              itens={[
                {
                  titulo: "Práticas a preparar",
                  subtitulo: "Aguardando preparo",
                  valor: resumo.aPreparar,
                  icone: "event_note",
                  cor: "orange",
                },
                {
                  titulo: "Solicitações de compra",
                  subtitulo: "Pendentes de atendimento",
                  valor: resumo.comprasAbertas,
                  icone: "shopping_cart",
                  cor: "purple",
                },
                {
                  titulo: "Empréstimos pendentes",
                  subtitulo: "Aguardando análise",
                  valor: resumo.emprestimosPendentes,
                  icone: "swap_horiz",
                  cor: "blue",
                },
                {
                  titulo: "Reservas do dia",
                  subtitulo: "Hoje",
                  valor: resumo.reservasHoje,
                  icone: "today",
                  cor: "green",
                },
              ]}
              acao={{ label: "Ver agendamentos", icone: "arrow_forward", to: "/auxiliar/agendamentos/agenda" }}
            />
            <AtividadesCard
              titulo="Atividades recentes"
              itens={atividades}
              link={{ label: "Ver todos os empréstimos", to: "/auxiliar/solicitacoes/emprestimos" }}
              vazio="Nenhuma atividade recente."
            />
          </>
        }
      />
    </div>
  );
}
