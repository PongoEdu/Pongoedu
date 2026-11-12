/**
 * Círculos e pontos decorativos do fundo (usado no login e na página inicial).
 * Deve ficar dentro de um contêiner `relative` com `overflow-hidden`.
 * Com `fixo`, ocupa a janela inteira (a mesma composição do login, mesmo em páginas longas).
 */
const GREEN = "var(--green)";
const PURPLE = "var(--purple)";
const BLUE = "var(--blue)";

export function FundoDecorativo({
  className = "",
  alturaJanela = false,
}: {
  className?: string;
  /** Composição com a altura da janela (igual à do login) no topo da página; rola junto com o conteúdo. */
  alturaJanela?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${alturaJanela ? "inset-x-0 top-0 h-screen" : "inset-0"} hidden md:block ${className}`}
    >
      <div className="absolute -left-[50px] top-[120px] h-[150px] w-[150px] rounded-full border border-brand-purple/20" />
      <div className="absolute right-10 top-20 h-20 w-20 rounded-full border border-brand-purple/20" />
      <div className="absolute bottom-10 right-2.5 h-[120px] w-[120px] rounded-full border border-brand-purple/20" />

      <div className="absolute left-[120px] top-[140px] h-[18px] w-[18px] rounded-full" style={{ background: GREEN }} />
      <div className="absolute bottom-[300px] left-[100px] h-5 w-5 rounded-full" style={{ background: BLUE }} />
      <div className="absolute bottom-20 left-[160px] h-5 w-5 rounded-full" style={{ background: PURPLE }} />
      <div className="absolute right-[180px] top-[320px] h-4 w-4 rounded-full" style={{ background: GREEN }} />
      <div className="absolute bottom-[100px] right-[130px] h-[22px] w-[22px] rounded-full" style={{ background: BLUE }} />
      <div className="absolute bottom-[360px] right-[200px] h-4 w-4 rounded-full" style={{ background: PURPLE }} />
    </div>
  );
}
