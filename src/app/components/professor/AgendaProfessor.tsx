import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CalendarCheck, Plus, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { agendamentosApi } from "../../../lib/api/agendamentos";
import { laboratoriosApi } from "../../../lib/api/laboratorios";
import { roteirosApi } from "../../../lib/api/roteiros";
import { mensagemDeErro } from "../../auth/AuthContext";
import type {
  AgendamentoResponse,
  DisponibilidadeResponse,
  LaboratorioResponse,
  RoteiroResponse,
  SituacaoAgendamento,
} from "../../../lib/api/types";

const situacaoBadge: Record<SituacaoAgendamento, { label: string; color: string }> = {
  AGENDADO: { label: "Agendado", color: "bg-blue-100 text-blue-700 border-blue-200" },
  PREPARADO: { label: "Preparado", color: "bg-purple-100 text-purple-700 border-purple-200" },
  REALIZADO: { label: "Realizado", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function AgendaProfessor() {
  const [searchParams] = useSearchParams();
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [laboratorios, setLaboratorios] = useState<LaboratorioResponse[]>([]);
  const [roteiros, setRoteiros] = useState<RoteiroResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [disponibilidade, setDisponibilidade] = useState<DisponibilidadeResponse | null>(null);

  const [form, setForm] = useState({
    laboratorioId: 0,
    roteiroId: Number(searchParams.get("roteiroId")) || 0,
    turma: "",
    data: new Date().toISOString().slice(0, 10),
    horaInicio: "08:00",
    horaFim: "10:00",
    observacao: "",
  });

  useEffect(() => {
    fetchDados();
  }, []);

  useEffect(() => {
    if (Number(searchParams.get("roteiroId"))) {
      setForm((p) => ({ ...p, roteiroId: Number(searchParams.get("roteiroId")) }));
      setModalAberto(true);
    }
  }, [searchParams]);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [agendamentosData, laboratoriosData, roteirosData] = await Promise.all([
        agendamentosApi.listar(),
        laboratoriosApi.listar(),
        roteirosApi.listar(),
      ]);
      setAgendamentos(agendamentosData);
      setLaboratorios(laboratoriosData);
      setRoteiros(roteirosData);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar a agenda."));
    } finally {
      setLoading(false);
    }
  };

  const verificarDisponibilidade = async () => {
    if (!form.laboratorioId || !form.data) return;
    try {
      const resultado = await agendamentosApi.disponibilidade(form.laboratorioId, form.data);
      setDisponibilidade(resultado);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao verificar disponibilidade."));
    }
  };

  useEffect(() => {
    if (modalAberto) verificarDisponibilidade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.laboratorioId, form.data, modalAberto]);

  const abrirNovo = () => {
    setForm({
      laboratorioId: laboratorios[0]?.id ?? 0,
      roteiroId: Number(searchParams.get("roteiroId")) || 0,
      turma: "",
      data: new Date().toISOString().slice(0, 10),
      horaInicio: "08:00",
      horaFim: "10:00",
      observacao: "",
    });
    setModalAberto(true);
  };

  const handleSubmit = async () => {
    if (!form.laboratorioId || !form.roteiroId) {
      toast.error("Selecione o laboratório e o roteiro.");
      return;
    }
    setSalvando(true);
    try {
      await agendamentosApi.criar({
        laboratorioId: form.laboratorioId,
        roteiroId: form.roteiroId,
        turma: form.turma || null,
        data: form.data,
        horaInicio: `${form.horaInicio}:00`,
        horaFim: `${form.horaFim}:00`,
        observacao: form.observacao || null,
      });
      toast.success("Prática agendada com sucesso.");
      setModalAberto(false);
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao agendar prática. Verifique o horário escolhido."));
    } finally {
      setSalvando(false);
    }
  };

  const cancelar = async (id: number) => {
    if (!confirm("Cancelar este agendamento?")) return;
    try {
      await agendamentosApi.cancelar(id);
      toast.success("Agendamento cancelado.");
      fetchDados();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao cancelar agendamento."));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Reservas do Laboratório</h1>
          </div>
          <p className="text-muted-foreground">Acompanhe e organize seus agendamentos de práticas</p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Agendar Prática</span>
        </button>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Horário</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Laboratório</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Roteiro</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Turma</th>
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
                    <td className="px-6 py-4 text-sm">{a.laboratorioNome}</td>
                    <td className="px-6 py-4 text-sm">{a.roteiroTitulo}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{a.turma ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[a.situacao].color}`}>
                        {situacaoBadge[a.situacao].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.situacao === "AGENDADO" && (
                        <button
                          onClick={() => cancelar(a.id)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600"
                          title="Cancelar"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-xl font-semibold">Agendar Prática</h2>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Laboratório</label>
                <select
                  value={form.laboratorioId}
                  onChange={(e) => setForm((p) => ({ ...p, laboratorioId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value={0} disabled>
                    Selecione...
                  </option>
                  {laboratorios.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Roteiro</label>
                <select
                  value={form.roteiroId}
                  onChange={(e) => setForm((p) => ({ ...p, roteiroId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value={0} disabled>
                    Selecione...
                  </option>
                  {roteiros.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Turma</label>
                <input
                  type="text"
                  value={form.turma}
                  onChange={(e) => setForm((p) => ({ ...p, turma: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Data</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Início</label>
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) => setForm((p) => ({ ...p, horaInicio: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fim</label>
                  <input
                    type="time"
                    value={form.horaFim}
                    onChange={(e) => setForm((p) => ({ ...p, horaFim: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {disponibilidade && (
                <div
                  className={`px-4 py-3 rounded-xl border-2 text-sm ${
                    disponibilidade.disponivel
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-yellow-50 border-yellow-200 text-yellow-700"
                  }`}
                >
                  {disponibilidade.disponivel
                    ? "✅ Laboratório disponível neste dia."
                    : `⚠️ ${disponibilidade.mensagem ?? "Já existem horários ocupados neste dia."}`}
                  {disponibilidade.ocupados.length > 0 && (
                    <p className="mt-1 text-xs">
                      Ocupado: {disponibilidade.ocupados.map((o) => `${o.horaInicio}–${o.horaFim}`).join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Observação</label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => setForm((p) => ({ ...p, observacao: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
              <button
                onClick={() => setModalAberto(false)}
                className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={salvando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Confirmar Agendamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
