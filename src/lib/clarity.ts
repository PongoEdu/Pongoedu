/**
 * Microsoft Clarity (mapas de calor e gravações de sessão).
 * Só é carregado quando VITE_CLARITY_PROJECT_ID estiver definido, então não roda em desenvolvimento
 * nem em ambientes sem o ID configurado.
 */
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export function iniciarClarity(projectId: string | undefined): void {
  if (!projectId || typeof window === "undefined" || document.getElementById("clarity-script")) return;

  // Mesmo snippet oficial do Clarity, sem depender de pacote extra.
  const fila: ClarityFn = function (...args: unknown[]) {
    (fila.q = fila.q || []).push(args);
  };
  window.clarity = window.clarity || fila;

  const script = document.createElement("script");
  script.id = "clarity-script";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  document.head.appendChild(script);
}
