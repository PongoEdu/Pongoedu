import { useEffect, useState } from "react";
import { HandCoins, Check, X as XIcon, PackageCheck, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { emprestimosApi } from "../../../lib/api/emprestimos";
import { mensagemDeErro } from "../../auth/AuthContext";
import { BarraFiltros } from "../shared/BarraFiltros";
import type { EmprestimoResponse, SituacaoEmprestimo } from "../../../lib/api/types";

type Filtro = "todos" | SituacaoEmprestimo;

const situacaoBadge: Record<SituacaoEmprestimo, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  APROVADO: { label: "Aprovado", color: "bg-blue-100 text-blue-700 border-blue-200" },
  RECUSADO: { label: "Recusado", color: "bg-red-100 text-red-700 border-red-200" },
  RETIRADO: { label: "Retirado", color: "bg-purple-100 text-purple-700 border-purple-200" },
  DEVOLVIDO: { label: "Devolvido", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function EmprestimosAuxiliar() {
  const [emprestimos, setEmprestimos] = useState<EmprestimoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("PENDENTE");
  const [busca, setBusca] = useState("");
  const [processando, setProcessando] = useState<number | null>(null);

  useEffect(() => {
    fetchDados();
  }, [filtro]);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const data = await emprestimosApi.listar(filtro === "todos" ? undefined : filtro);
      setEmprestimos(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar empréstimos."));
    } finally {
      setLoading(false);
    }
  };

  const executar = async (acao: () => Promise<unknown>, id: number, sucesso: string) => {
    setProcessando(id);
    try {
      await acao();
      toast.success(sucesso);
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao processar solicitação."));
    } finally {
      setProcessando(null);
    }
  };

  const filtrados = emprestimos.filter((e) => {
    const q = busca.toLowerCase();
    return !q || e.produtoNome.toLowerCase().includes(q) || e.professorNome.toLowerCase().includes(q);
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HandCoins className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Empréstimos</h1>
        </div>
        <p className="text-muted-foreground">Atenda, controle a retirada e a devolução de equipamentos</p>
      </div>

      <BarraFiltros
        busca={busca}
        onBusca={setBusca}
        placeholder="Buscar por equipamento ou professor..."
        filtros={[
          {
            valor: filtro,
            onChange: (v) => setFiltro(v as Filtro),
            opcoes: [
              { valor: "todos", rotulo: "Todos os status" },
              { valor: "PENDENTE", rotulo: "Pendente" },
              { valor: "APROVADO", rotulo: "Aprovado" },
              { valor: "RETIRADO", rotulo: "Retirado" },
              { valor: "DEVOLVIDO", rotulo: "Devolvido" },
              { valor: "RECUSADO", rotulo: "Recusado" },
            ],
          },
        ]}
      />

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Equipamento</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Professor</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Período</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Situação</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum empréstimo encontrado
                  </td>
                </tr>
              ) : (
                filtrados.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{e.produtoNome}</td>
                    <td className="px-6 py-4 text-sm">{e.professorNome}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {e.dataInicio} – {e.dataFim}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[e.situacao].color}`}>
                        {situacaoBadge[e.situacao].label}
                      </span>
                      {e.atrasado && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 border border-red-200">
                          Atrasado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {e.situacao === "PENDENTE" && (
                          <>
                            <button
                              onClick={() => executar(() => emprestimosApi.aprovar(e.id), e.id, "Empréstimo aprovado.")}
                              disabled={processando === e.id}
                              className="p-2 hover:bg-accent rounded-lg text-green-600"
                              title="Aprovar"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => executar(() => emprestimosApi.recusar(e.id), e.id, "Empréstimo recusado.")}
                              disabled={processando === e.id}
                              className="p-2 hover:bg-accent rounded-lg text-red-600"
                              title="Recusar"
                            >
                              <XIcon size={16} />
                            </button>
                          </>
                        )}
                        {e.situacao === "APROVADO" && (
                          <button
                            onClick={() =>
                              executar(() => emprestimosApi.registrarRetirada(e.id), e.id, "Retirada registrada.")
                            }
                            disabled={processando === e.id}
                            className="p-2 hover:bg-accent rounded-lg text-primary flex items-center gap-1 text-sm"
                            title="Registrar retirada"
                          >
                            <PackageOpen size={16} />
                            Retirada
                          </button>
                        )}
                        {e.situacao === "RETIRADO" && (
                          <button
                            onClick={() =>
                              executar(() => emprestimosApi.registrarDevolucao(e.id), e.id, "Devolução registrada.")
                            }
                            disabled={processando === e.id}
                            className="p-2 hover:bg-accent rounded-lg text-primary flex items-center gap-1 text-sm"
                            title="Registrar devolução"
                          >
                            <PackageCheck size={16} />
                            Devolução
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
