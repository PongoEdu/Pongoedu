import { Link } from "react-router";

/* Componentes visuais do dashboard, seguindo o app.css do projeto em HTML. */

export type Cor = "green" | "purple" | "blue" | "orange" | "yellow" | "red";

export const COR_TEXTO: Record<Cor, string> = {
  green: "var(--green)",
  purple: "var(--purple)",
  blue: "var(--blue)",
  orange: "var(--orange)",
  yellow: "#d97706",
  red: "var(--red)",
};

export const COR_FUNDO: Record<Cor, string> = {
  green: "#dfffee",
  purple: "#eee6ff",
  blue: "#e5f0ff",
  orange: "#fff0e6",
  yellow: "#fef9c3",
  red: "#ffe4e8",
};

export function Icone({
  nome,
  className = "",
  style,
}: {
  nome: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`material-symbols-rounded ${className}`} style={style}>
      {nome}
    </span>
  );
}

export function IconBox({ icone, cor, size = 52 }: { icone: string; cor: Cor; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: size > 40 ? 15 : 11,
        background: COR_FUNDO[cor],
        color: COR_TEXTO[cor],
      }}
    >
      <Icone nome={icone} className={size > 40 ? "" : "!text-[20px]"} />
    </div>
  );
}

/* ------------------------------------------------------------------ Hero */

export interface AcaoHero {
  label: string;
  icone: string;
  to: string;
}

export function Hero({
  badge,
  badgeIcone,
  titulo,
  descricao,
  acaoPrimaria,
  acaoSecundaria,
  imagem,
}: {
  badge: string;
  badgeIcone: string;
  titulo: string;
  descricao: string;
  acaoPrimaria: AcaoHero;
  acaoSecundaria: AcaoHero;
  imagem: string;
}) {
  return (
    <section className="mb-6 grid items-center gap-7 rounded-[28px] border border-brand-line bg-white/95 p-5 shadow-[0_18px_45px_rgba(28,39,76,0.06)] md:px-9 md:py-[30px] lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <span
          className="inline-flex items-center gap-2 rounded-full px-[18px] py-[9px] text-[13px]"
          style={{ background: "#efe7ff", color: "var(--purple)", fontWeight: 900 }}
        >
          <Icone nome={badgeIcone} className="!text-[20px]" />
          {badge}
        </span>

        <h1 className="mb-5 mt-7 text-[28px] leading-tight tracking-[-0.8px] md:text-[34px]" style={{ fontWeight: 900 }}>
          {titulo}
        </h1>

        <p className="max-w-[620px] text-[17px] leading-[1.7] text-brand-muted">{descricao}</p>

        <div className="mt-[34px] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-[18px]">
          <Link
            to={acaoPrimaria.to}
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl px-7 text-[15px] text-white no-underline shadow-[0_14px_26px_rgba(8,180,79,0.24)] transition hover:shadow-[0_16px_30px_rgba(8,180,79,0.32)]"
            style={{ fontWeight: 900, background: "linear-gradient(135deg, #11bb58, #03a446)" }}
          >
            <Icone nome={acaoPrimaria.icone} />
            {acaoPrimaria.label}
          </Link>
          <Link
            to={acaoSecundaria.to}
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-[#cbb8ff] bg-white px-7 text-[15px] no-underline transition hover:border-brand-purple hover:bg-[#f3eeff]"
            style={{ fontWeight: 900, color: "var(--purple)" }}
          >
            {acaoSecundaria.label}
            <Icone nome={acaoSecundaria.icone} />
          </Link>
        </div>
      </div>

      <div className="hidden items-center justify-center md:flex">
        <img src={imagem} alt="" className="w-full max-w-[340px] select-none object-contain" draggable={false} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Card genérico */

export function Card({
  icone,
  cor,
  titulo,
  link,
  children,
  extra,
}: {
  icone: string;
  cor: Cor;
  titulo: string;
  link?: { label: string; to: string };
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[22px] rounded-[28px] border border-brand-line bg-white/95 p-4 shadow-[0_18px_45px_rgba(28,39,76,0.06)] md:p-6">
      <div className="mb-[22px] flex items-start justify-between gap-3 md:items-center">
        <div className="flex min-w-0 items-center gap-2.5 text-[15px] md:text-xl" style={{ fontWeight: 900 }}>
          <Icone nome={icone} style={{ color: COR_TEXTO[cor] }} />
          {titulo}
        </div>
        {extra}
        {link && (
          <Link
            to={link.to}
            className="inline-flex shrink-0 items-center gap-1.5 text-[13px] no-underline md:text-base"
            style={{ color: "var(--purple)", fontWeight: 900 }}
          >
            {link.label}
            <Icone nome="arrow_forward" className="!text-[20px]" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Acesso rápido */

export interface AtalhoRapido {
  titulo: string;
  descricao: string;
  icone: string;
  cor: Cor;
  to: string;
}

export function AcessoRapido({ itens }: { itens: AtalhoRapido[] }) {
  return (
    <Card icone="bolt" cor="green" titulo="Acesso rápido">
      <div className="grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2 min-[1180px]:grid-cols-3">
        {itens.map((item) => (
          <Link
            key={item.to + item.titulo}
            to={item.to}
            className="block min-h-[150px] rounded-[18px] border border-brand-line bg-white p-6 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(28,39,76,0.08)]"
          >
            <IconBox icone={item.icone} cor={item.cor} />
            <h3 className="mb-2.5 mt-4 text-xl" style={{ fontWeight: 700 }}>
              {item.titulo}
            </h3>
            <p className="m-0 text-sm text-brand-muted">{item.descricao}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ Tabela */

export type Celula = string | number | { icone: string; texto: string; cor: Cor } | { pill: string; cor: Cor };

function renderCelula(c: Celula) {
  if (typeof c === "string" || typeof c === "number") return c;
  if ("pill" in c) {
    return (
      <span
        className="inline-flex rounded-full px-3 py-1.5 text-xs"
        style={{ background: COR_FUNDO[c.cor], color: COR_TEXTO[c.cor], fontWeight: 900 }}
      >
        {c.pill}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-3" style={{ fontWeight: 800 }}>
      <IconBox icone={c.icone} cor={c.cor} size={34} />
      {c.texto}
    </div>
  );
}

export function TabelaCard({
  icone,
  cor,
  titulo,
  link,
  colunas,
  linhas,
  vazio,
  busca,
  onBusca,
  placeholderBusca,
  onExportar,
}: {
  icone: string;
  cor: Cor;
  titulo: string;
  link?: { label: string; to: string };
  colunas: string[];
  linhas: Celula[][];
  vazio: string;
  busca?: string;
  onBusca?: (v: string) => void;
  placeholderBusca?: string;
  onExportar?: () => void;
}) {
  return (
    <Card icone={icone} cor={cor} titulo={titulo} link={link}>
      {onBusca && (
        <div className="mb-4 flex gap-3.5 max-md:hidden">
          <label className="flex h-12 flex-1 items-center gap-2.5 rounded-[14px] border border-brand-line px-4 text-[#8a98ad]">
            <Icone nome="search" />
            <input
              type="text"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
              placeholder={placeholderBusca}
              className="w-full border-0 bg-transparent text-brand-dark outline-none"
            />
          </label>
          {onExportar && (
            <button
              onClick={onExportar}
              className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#8be4ad] bg-white px-5"
              style={{ color: "var(--green)", fontWeight: 900 }}
            >
              <Icone nome="download" />
              Exportar
            </button>
          )}
        </div>
      )}

      <div className="overflow-auto rounded-[18px] border border-brand-line">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead className="bg-[#f8fafc] text-brand-muted">
            <tr>
              {colunas.map((c) => (
                <th key={c} className="border-b border-brand-line p-4 text-left" style={{ fontWeight: 700 }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 ? (
              <tr>
                <td colSpan={colunas.length} className="p-10 text-center text-brand-muted">
                  {vazio}
                </td>
              </tr>
            ) : (
              linhas.map((linha, i) => (
                <tr key={i} className="[&:last-child>td]:border-b-0">
                  {linha.map((c, j) => (
                    <td key={j} className="border-b border-brand-line p-4 align-middle">
                      {renderCelula(c)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ Aside: listas */

export function PillStatus({ rotulo, cor }: { rotulo: string; cor: Cor }) {
  return (
    <span
      className="inline-flex shrink-0 whitespace-nowrap rounded-full px-[11px] py-1 text-[11px]"
      style={{ background: COR_FUNDO[cor], color: COR_TEXTO[cor], fontWeight: 700 }}
    >
      {rotulo}
    </span>
  );
}

export interface ItemAgenda {
  inicio: string;
  fim: string;
  titulo: string;
  info: string;
  status: { rotulo: string; cor: Cor };
}

export function AgendaHoje({
  titulo,
  itens,
  link,
  vazio,
}: {
  titulo: string;
  itens: ItemAgenda[];
  link: { label: string; to: string };
  vazio: string;
}) {
  return (
    <Card icone="event" cor="purple" titulo={titulo} link={link}>
      {itens.length === 0 ? (
        <p className="m-0 py-4 text-center text-sm text-brand-muted">{vazio}</p>
      ) : (
        <div className="flex flex-col">
          {itens.map((item, i) => (
            <div key={i} className="flex items-center gap-3.5 border-b border-brand-line py-3.5 last:border-b-0">
              <div className="flex min-w-[42px] shrink-0 flex-col gap-[3px] text-xs leading-[1.3] text-brand-muted" style={{ fontWeight: 700 }}>
                <span>{item.inicio}</span>
                <span>{item.fim}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="truncate text-[13px] text-brand-dark" style={{ fontWeight: 700 }}>
                  {item.titulo}
                </span>
                <span className="text-xs text-brand-muted">{item.info}</span>
              </div>
              <PillStatus rotulo={item.status.rotulo} cor={item.status.cor} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export interface ItemPratica {
  titulo: string;
  descricao: string;
  status: "preparada" | "pendente";
  tempo: string;
}

export function PraticasLista({
  titulo,
  icone,
  cor,
  itens,
  link,
  vazio,
}: {
  titulo: string;
  icone: string;
  cor: Cor;
  itens: ItemPratica[];
  link: { label: string; to: string };
  vazio: string;
}) {
  return (
    <Card icone={icone} cor={cor} titulo={titulo} link={link}>
      {itens.length === 0 ? (
        <p className="m-0 py-4 text-center text-sm text-brand-muted">{vazio}</p>
      ) : (
        <div className="flex flex-col">
          {itens.map((item, i) => {
            const ok = item.status === "preparada";
            return (
              <div key={i} className="flex items-center gap-3 border-b border-brand-line py-[13px] last:border-b-0">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: ok ? "#d1fadf" : "#fff3d6", color: ok ? "#027a48" : "#b45309" }}
                >
                  <Icone nome={ok ? "check_circle" : "schedule"} className="!text-[17px]" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="text-[13px] text-brand-dark" style={{ fontWeight: 700 }}>
                    {item.titulo}
                  </span>
                  <span className="truncate text-xs text-brand-muted">{item.descricao}</span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-xs" style={{ fontWeight: 700, color: ok ? "var(--green)" : "var(--orange)" }}>
                    {ok ? "Preparada" : "Pendente"}
                  </span>
                  <span className="text-[11px] text-brand-muted">{item.tempo}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export interface ItemResumo {
  titulo: string;
  subtitulo: string;
  valor: number;
  icone: string;
  cor: Cor;
}

export function ResumoCard({
  titulo,
  itens,
  acao,
}: {
  titulo: string;
  itens: ItemResumo[];
  acao: AcaoHero;
}) {
  return (
    <Card
      icone="monitoring"
      cor="blue"
      titulo={titulo}
      extra={<span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: "var(--purple)" }} />}
    >
      <div className="mb-4 flex flex-col">
        {itens.map((item) => (
          <div key={item.titulo} className="flex items-center gap-3.5 border-b border-brand-line py-3.5 last:border-b-0">
            <IconBox icone={item.icone} cor={item.cor} />
            <div className="flex flex-col gap-[3px]">
              <span className="text-sm text-brand-dark" style={{ fontWeight: 600 }}>
                {item.titulo}
              </span>
              <small className="text-xs text-brand-muted" style={{ fontWeight: 500 }}>
                {item.subtitulo}
              </small>
            </div>
            <strong className="ml-auto text-[22px] text-brand-dark" style={{ fontWeight: 800 }}>
              {item.valor}
            </strong>
          </div>
        ))}
      </div>

      <Link
        to={acao.to}
        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-[15px] text-white no-underline shadow-[0_14px_26px_rgba(8,180,79,0.24)]"
        style={{ fontWeight: 900, background: "linear-gradient(135deg, #11bb58, #03a446)" }}
      >
        {acao.label}
        <Icone nome={acao.icone} />
      </Link>
    </Card>
  );
}

export interface ItemAtividade {
  titulo: string;
  tempo: string;
  icone: string;
  cor: Cor;
}

export function AtividadesCard({
  titulo,
  itens,
  link,
  vazio,
}: {
  titulo: string;
  itens: ItemAtividade[];
  link: { label: string; to: string };
  vazio: string;
}) {
  return (
    <Card icone="history" cor="purple" titulo={titulo}>
      {itens.length === 0 ? (
        <p className="m-0 py-4 text-center text-sm text-brand-muted">{vazio}</p>
      ) : (
        itens.map((item, i) => (
          <div key={i} className="flex items-center gap-3.5 border-b border-brand-line py-3.5 last:border-b-0">
            <IconBox icone={item.icone} cor={item.cor} />
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[13px]">{item.titulo}</strong>
              <small className="text-brand-muted">{item.tempo}</small>
            </div>
            <Icone nome="chevron_right" className="text-[#98a2b3]" />
          </div>
        ))
      )}
      <div className="mt-[18px] text-center">
        <Link
          to={link.to}
          className="inline-flex items-center gap-1.5 no-underline"
          style={{ color: "var(--purple)", fontWeight: 900 }}
        >
          {link.label}
          <Icone nome="arrow_forward" className="!text-[20px]" />
        </Link>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ Grid + utilitários */

export function DashboardGrid({ principal, lateral }: { principal: React.ReactNode; lateral: React.ReactNode }) {
  return (
    <section className="grid gap-[22px] min-[1180px]:grid-cols-[minmax(0,1fr)_370px]">
      <div className="min-w-0">{principal}</div>
      <aside className="min-w-0">{lateral}</aside>
    </section>
  );
}

export function dataLocalISO(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function formatarDataBR(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

export function hhmm(hora: string): string {
  return (hora || "").slice(0, 5);
}

export function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function baixarCSV(nome: string, cabecalho: string[], linhas: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return /[,"\n]/.test(s) ? `"${s}"` : s;
  };
  const conteudo = [cabecalho.map(esc).join(","), ...linhas.map((l) => l.map(esc).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}
