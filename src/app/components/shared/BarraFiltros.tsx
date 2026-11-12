import { Filter, Search } from "lucide-react";

/**
 * Barra de busca + filtros no padrão da tela de Produtos:
 * campo de busca à esquerda e seletores de filtro à direita.
 */
export interface FiltroSelect {
  valor: string;
  onChange: (valor: string) => void;
  opcoes: { valor: string; rotulo: string }[];
}

interface Props {
  busca: string;
  onBusca: (valor: string) => void;
  placeholder: string;
  filtros?: FiltroSelect[];
}

export function BarraFiltros({ busca, onBusca, placeholder, filtros = [] }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          className="w-full rounded-xl border-2 border-border bg-background py-3 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      {filtros.map((f, i) => (
        <div key={i} className="relative">
          {i === 0 && (
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          )}
          <select
            value={f.valor}
            onChange={(e) => f.onChange(e.target.value)}
            className={`min-w-[180px] cursor-pointer appearance-none rounded-xl border-2 border-border bg-background py-3 pr-8 transition-colors focus:border-primary focus:outline-none ${
              i === 0 ? "pl-10" : "pl-4"
            }`}
          >
            {f.opcoes.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
