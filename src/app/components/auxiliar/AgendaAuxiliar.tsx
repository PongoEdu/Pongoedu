import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CalendarCheck, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { agendamentosApi } from "../../../lib/api/agendamentos";
import { mensagemDeErro } from "../../auth/AuthContext";
import { AlternadorVisao, CalendarioSemanal, ModalAgendamento } from "../agenda/CalendarioSemanal";
import type { AgendamentoResponse, SituacaoAgendamento } from "../../../lib/api/types";

const situacaoBadge: Record<SituacaoAgendamento, { label: string; color: string }> = {
  AGENDADO: { label: "Agendado", color: "bg-blue-100 text-blue-700 border-blue-200" },
  PREPARADO: { label: "Preparado", color: "bg-purple-100 text-purple-700 border-purple-200" },
  REALIZADO: { label: "Realizado", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function AgendaAuxiliar() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [visao, setVisao] = useState<"calendario" | "lista">("calendario");
  const [selecionado, setSelecionado] = useState<AgendamentoResponse | null>(null);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const data = await agendamentosApi.listar();
      setAgendamentos(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar a agenda do laboratório."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
       <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Agenda</h1>
        </div>
        <p className="text-muted-foreground">Visualize todos os agendamentos de práticas solicitados pelos professores.</p>
       </div>
        <AlternadorVisao valor={visao} onChange={setVisao} />
      </div>

      {visao === "calendario" ? (
        <CalendarioSemanal
          agendamentos={agendamentos}
          mostrarProfessor
          carregando={loading}
          onSelecionar={setSelecionado}
        />
      ) : (
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent border-b-2 border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Horário</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Professor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Laboratório</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Roteiro</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Situação</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      Carregando...
                    </td>
                  </tr>
                ) : agendamentos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum agendamento encontrado
                    </td>
                  </tr>
                ) : (
                  agendamentos.map((a) => (
                    <tr key={a.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 text-sm">{a.data}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {a.horaInicio} – {a.horaFim}
                      </td>
                      <td className="px-6 py-4 text-sm">{a.professorNome}</td>
                      <td className="px-6 py-4 text-sm">{a.laboratorioNome}</td>
                      <td className="px-6 py-4 text-sm">{a.roteiroTitulo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[a.situacao].color}`}>
                          {situacaoBadge[a.situacao].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(a.situacao === "AGENDADO" || a.situacao === "PREPARADO") && (
                          <Link
                            to={`/auxiliar/agendamentos/${a.id}/preparar`}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <ClipboardCheck size={16} />
                            Preparar
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selecionado && (
        <ModalAgendamento
          agendamento={selecionado}
          mostrarProfessor
          onFechar={() => setSelecionado(null)}
          acoes={
            (selecionado.situacao === "AGENDADO" || selecionado.situacao === "PREPARADO") && (
              <Link
                to={`/auxiliar/agendamentos/${selecionado.id}/preparar`}
                className="inline-flex h-[42px] items-center gap-2 rounded-xl px-5 text-[13px] text-white no-underline"
                style={{ background: "#08b347", fontWeight: 700 }}
              >
                <ClipboardCheck size={16} />
                {selecionado.situacao === "AGENDADO" ? "Preparar prática" : "Ver preparação"}
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
