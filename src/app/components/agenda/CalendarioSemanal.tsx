import { useMemo, useState } from "react";
import type { AgendamentoResponse, SituacaoAgendamento } from "../../../lib/api/types";

/* Agenda semanal (domingo a sábado), no mesmo padrão visual do projeto em HTML. */

const HORA_INICIO = 7;
const HORA_FIM = 18;
const PX_POR_HORA = 64;
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

type CorEvento = "yellow" | "blue" | "green" | "red";

const ESTILO: Record<CorEvento, { bg: string; borda: string; texto: string }> = {
  yellow: { bg: "#fef9c3", borda: "#ca8a04", texto: "#854d0e" },
  blue: { bg: "#dbeafe", borda: "#2878ff", texto: "#1e40af" },
  green: { bg: "#d1fadf", borda: "#08b347", texto: "#065f46" },
  red: { bg: "#fee2e2", borda: "#ff304f", texto: "#991b1b" },
};

export const SITUACAO_AGENDA: Record<SituacaoAgendamento, { rotulo: string; cor: CorEvento; icone: string }> = {
  AGENDADO: { rotulo: "Pendente", cor: "yellow", icone: "schedule" },
  PREPARADO: { rotulo: "Preparado", cor: "blue", icone: "inventory_2" },
  REALIZADO: { rotulo: "Concluído", cor: "green", icone: "check_circle" },
  CANCELADO: { rotulo: "Cancelado", cor: "red", icone: "cancel" },
};

function paraMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + (m || 0);
}

function dataISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

function diasDaSemana(offset: number): Date[] {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i));
}

function intervaloSemana(dias: Date[]): string {
  const ini = String(dias[0].getDate()).padStart(2, "0");
  const fim = String(dias[6].getDate()).padStart(2, "0");
  const mesAno = dias[6].toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return `${ini} – ${fim} de ${mesAno}`;
}

/** Distribui eventos sobrepostos em colunas lado a lado. */
function distribuir(eventos: AgendamentoResponse[]) {
  const ordenados = [...eventos].sort((a, b) => paraMinutos(a.horaInicio) - paraMinutos(b.horaInicio));
  const fimColuna: number[] = [];
  const coluna = new Map<number, number>();
  for (const e of ordenados) {
    const ini = paraMinutos(e.horaInicio);
    let c = fimColuna.findIndex((fim) => fim <= ini);
    if (c === -1) c = fimColuna.length;
    fimColuna[c] = paraMinutos(e.horaFim);
    coluna.set(e.id, c);
  }
  return { coluna, total: Math.max(fimColuna.length, 1) };
}

interface Props {
  agendamentos: AgendamentoResponse[];
  /** Mostra o nome do professor no evento (visão do auxiliar). Se falso, mostra o laboratório. */
  mostrarProfessor?: boolean;
  onSelecionar: (agendamento: AgendamentoResponse) => void;
  carregando?: boolean;
}

export function CalendarioSemanal({ agendamentos, mostrarProfessor = false, onSelecionar, carregando }: Props) {
  const [offset, setOffset] = useState(0);
  const dias = useMemo(() => diasDaSemana(offset), [offset]);
  const hojeStr = dataISO(new Date());
  const horas = Array.from({ length: HORA_FIM - HORA_INICIO }, (_, i) => HORA_INICIO + i);

  const agora = new Date();
  const topAgora = (agora.getHours() - HORA_INICIO) * PX_POR_HORA + (agora.getMinutes() / 60) * PX_POR_HORA;
  const mostrarAgora = offset === 0 && agora.getHours() >= HORA_INICIO && agora.getHours() < HORA_FIM;

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#e4e9f3] bg-white">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e9f3] px-4 py-[18px] md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[17px]" style={{ fontWeight: 700 }}>
            Agenda da semana
          </span>
          <button
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Semana anterior"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#e4e9f3] bg-[#f5f7fb] text-[#667085] hover:bg-[#edf0f8]"
          >
            <span className="material-symbols-rounded !text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Próxima semana"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#e4e9f3] bg-[#f5f7fb] text-[#667085] hover:bg-[#edf0f8]"
          >
            <span className="material-symbols-rounded !text-[18px]">chevron_right</span>
          </button>
          <span className="ml-1 text-[13px] text-[#667085]" style={{ fontWeight: 600 }}>
            {intervaloSemana(dias)}
          </span>
          {offset !== 0 && (
            <button
              onClick={() => setOffset(0)}
              className="ml-1 rounded-lg border border-[#e4e9f3] px-2.5 py-1 text-xs text-[#7c3cff] hover:bg-[#f3eeff]"
              style={{ fontWeight: 700 }}
            >
              Hoje
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {Object.values(SITUACAO_AGENDA).map((s) => (
              <span key={s.rotulo} className="inline-flex items-center gap-1.5 text-xs text-[#667085]" style={{ fontWeight: 600 }}>
                <span
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: ESTILO[s.cor].bg, borderLeft: `3px solid ${ESTILO[s.cor].borda}` }}
                />
                {s.rotulo}
              </span>
            ))}
          </div>
          <span
            className="rounded-full px-3.5 py-[5px] text-xs"
            style={{ background: "#ede8ff", color: "#7c3cff", fontWeight: 700 }}
          >
            {agendamentos.length} reserva(s)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Cabeçalho dos dias */}
          <div className="flex border-b border-[#e4e9f3]">
            <div className="w-[60px] shrink-0 border-r border-[#e4e9f3]" />
            {dias.map((d, i) => {
              const hoje = dataISO(d) === hojeStr;
              return (
                <div key={i} className="flex flex-1 flex-col items-center border-l border-[#e4e9f3] py-2.5 first:border-l-0">
                  <span className="text-[11px] uppercase tracking-[0.4px] text-[#667085]" style={{ fontWeight: 600 }}>
                    {DIAS[i]}
                  </span>
                  <span
                    className="mt-1 flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm"
                    style={{
                      fontWeight: 700,
                      background: hoje ? "#08b347" : "transparent",
                      color: hoje ? "#fff" : "#101828",
                    }}
                  >
                    {String(d.getDate()).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Corpo */}
          <div>
            <div className="relative flex" style={{ height: horas.length * PX_POR_HORA }}>
              <div className="relative w-[60px] shrink-0 border-r border-[#e4e9f3]">
                {horas.map((h) => (
                  <div
                    key={h}
                    className="absolute right-2 -translate-y-1/2 whitespace-nowrap text-[10px] text-[#667085]"
                    style={{ top: (h - HORA_INICIO) * PX_POR_HORA, fontWeight: 600 }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {dias.map((d, i) => {
                const doDia = agendamentos.filter((a) => a.data === dataISO(d));
                const { coluna, total } = distribuir(doDia);
                return (
                  <div
                    key={i}
                    className="relative flex-1 border-l border-[#e4e9f3]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(to bottom, #e4e9f3 0, #e4e9f3 1px, transparent 1px, transparent ${PX_POR_HORA}px)`,
                    }}
                  >
                    {doDia.map((a) => {
                      const info = SITUACAO_AGENDA[a.situacao];
                      const cor = ESTILO[info.cor];
                      const ini = paraMinutos(a.horaInicio);
                      const fim = paraMinutos(a.horaFim);
                      const top = ((ini - HORA_INICIO * 60) / 60) * PX_POR_HORA;
                      const altura = Math.max(((fim - ini) / 60) * PX_POR_HORA, 24);
                      const col = coluna.get(a.id) ?? 0;
                      return (
                        <button
                          key={a.id}
                          onClick={() => onSelecionar(a)}
                          className="absolute z-[1] flex cursor-pointer flex-col gap-px overflow-hidden rounded-lg px-2 py-1.5 text-left"
                          style={{
                            top,
                            height: altura,
                            left: total > 1 ? `calc(${((col / total) * 100).toFixed(1)}% + 3px)` : 4,
                            width: total > 1 ? `calc(${(100 / total).toFixed(1)}% - 6px)` : undefined,
                            right: total > 1 ? undefined : 4,
                            background: cor.bg,
                            borderLeft: `3px solid ${cor.borda}`,
                            color: cor.texto,
                          }}
                          title={`${a.professorNome} — ${info.rotulo}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px]" style={{ fontWeight: 600, opacity: 0.8 }}>
                              {a.horaInicio.slice(0, 5)} – {a.horaFim.slice(0, 5)}
                            </span>
                            <span className="material-symbols-rounded !text-[12px]">{info.icone}</span>
                          </div>
                          <span className="text-xs leading-tight" style={{ fontWeight: 800 }}>
                            {a.professorNome}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {mostrarAgora && (
                <>
                  <div
                    className="pointer-events-none absolute right-0 z-[3] h-0.5"
                    style={{ left: 60, top: topAgora, background: "#08b347" }}
                  />
                  <div
                    className="pointer-events-none absolute z-[4] h-2.5 w-2.5 rounded-full"
                    style={{ left: 56, top: topAgora - 5, background: "#08b347" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {carregando && <div className="border-t border-[#e4e9f3] p-3 text-center text-sm text-[#667085]">Carregando...</div>}
    </div>
  );
}

export function AlternadorVisao({
  valor,
  onChange,
}: {
  valor: "calendario" | "lista";
  onChange: (v: "calendario" | "lista") => void;
}) {
  const itens: { id: "calendario" | "lista"; rotulo: string; icone: string }[] = [
    { id: "calendario", rotulo: "Agenda", icone: "calendar_view_week" },
    { id: "lista", rotulo: "Lista", icone: "list" },
  ];
  return (
    <div className="inline-flex rounded-xl border border-[#e4e9f3] bg-white p-1">
      {itens.map((i) => (
        <button
          key={i.id}
          onClick={() => onChange(i.id)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] transition-colors"
          style={{
            fontWeight: 700,
            background: valor === i.id ? "#7c3cff" : "transparent",
            color: valor === i.id ? "#fff" : "#667085",
          }}
        >
          <span className="material-symbols-rounded !text-[18px]">{i.icone}</span>
          {i.rotulo}
        </button>
      ))}
    </div>
  );
}

export function ModalAgendamento({
  agendamento,
  onFechar,
  mostrarProfessor,
  acoes,
}: {
  agendamento: AgendamentoResponse;
  onFechar: () => void;
  mostrarProfessor?: boolean;
  acoes?: React.ReactNode;
}) {
  const info = SITUACAO_AGENDA[agendamento.situacao];
  const cor = ESTILO[info.cor];
  const [a, m, d] = agendamento.data.split("-");
  const campo = (rotulo: string, valor: React.ReactNode) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-[0.4px] text-[#667085]" style={{ fontWeight: 700 }}>
        {rotulo}
      </span>
      <span className="text-sm" style={{ fontWeight: 600 }}>
        {valor}
      </span>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative w-full max-w-lg rounded-[20px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e4e9f3] px-6 py-5">
          <span className="text-base" style={{ fontWeight: 800 }}>
            {agendamento.professorNome}
          </span>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#f3f4f6] text-[#667085] hover:bg-[#e8edf5]"
          >
            <span className="material-symbols-rounded !text-[18px]">close</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-6 py-5">
          {campo("Data", `${d}/${m}/${a}`)}
          {campo("Horário", `${agendamento.horaInicio.slice(0, 5)} – ${agendamento.horaFim.slice(0, 5)}`)}
          {campo("Prática", agendamento.roteiroTitulo)}
          {campo(
            "Situação",
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
              style={{ background: cor.bg, color: cor.texto, fontWeight: 700 }}
            >
              <span className="material-symbols-rounded !text-[14px]">{info.icone}</span>
              {info.rotulo}
            </span>
          )}
          {agendamento.observacao && (
            <div className="col-span-2">{campo("Observações", agendamento.observacao)}</div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#e4e9f3] px-6 py-4">
          {acoes}
          <button
            onClick={onFechar}
            className="h-[42px] rounded-xl border border-[#e4e9f3] px-5 text-[13px] text-[#667085] hover:bg-[#f5f7fa]"
            style={{ fontWeight: 600 }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
