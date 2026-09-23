import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ClipboardCheck, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { preparacoesApi } from "../../../lib/api/preparacoes";
import { ApiError } from "../../../lib/api/http";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { PreparacaoResponse } from "../../../lib/api/types";

export function PrepararPratica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preparacao, setPreparacao] = useState<PreparacaoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [concluindo, setConcluindo] = useState(false);

  useEffect(() => {
    if (id) carregar(Number(id));
  }, [id]);

  const carregar = async (agendamentoId: number) => {
    setLoading(true);
    try {
      const data = await preparacoesApi.buscarPorAgendamento(agendamentoId);
      setPreparacao(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        try {
          const iniciada = await preparacoesApi.iniciar(agendamentoId);
          setPreparacao(iniciada);
        } catch (err2) {
          toast.error(mensagemDeErro(err2, "Erro ao iniciar a preparação."));
        }
      } else {
        toast.error(mensagemDeErro(err, "Erro ao carregar a preparação."));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSeparado = async (itemId: number, separado: boolean, quantidadeSeparada: number) => {
    if (!preparacao) return;
    try {
      const atualizada = await preparacoesApi.atualizarItem(preparacao.id, itemId, {
        separado,
        quantidadeSeparada,
        pendente: false,
      });
      setPreparacao(atualizada);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao atualizar item."));
    }
  };

  const marcarPendente = async (itemId: number, quantidadeSeparada: number) => {
    if (!preparacao) return;
    try {
      const atualizada = await preparacoesApi.atualizarItem(preparacao.id, itemId, {
        separado: false,
        quantidadeSeparada,
        pendente: true,
      });
      setPreparacao(atualizada);
      toast.info("Item marcado como pendente. O professor será notificado.");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao atualizar item."));
    }
  };

  const concluir = async () => {
    if (!preparacao) return;
    setConcluindo(true);
    try {
      const finalizada = await preparacoesApi.concluir(preparacao.id);
      setPreparacao(finalizada);
      toast.success(
        finalizada.situacao === "CONCLUIDA"
          ? "Preparação concluída e materiais baixados do estoque."
          : "Preparação concluída com pendências registradas."
      );
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao concluir preparação."));
    } finally {
      setConcluindo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!preparacao) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <p className="text-muted-foreground">Não foi possível carregar esta preparação.</p>
      </div>
    );
  }

  const finalizada = preparacao.situacao === "CONCLUIDA" || preparacao.situacao === "COM_PENDENCIA";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={20} />
        Voltar à agenda
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Preparar Prática</h1>
        </div>
        <p className="text-muted-foreground">Confira o checklist de materiais antes da aula</p>
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden mb-6">
        {preparacao.itens.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Nenhum material vinculado a este roteiro.</p>
        ) : (
          preparacao.itens.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-5 py-4 ${
                index < preparacao.itens.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSeparado(item.id, !item.separado, item.quantidadeNecessaria)}
                  disabled={finalizada}
                  className="flex-shrink-0"
                >
                  {item.separado ? (
                    <CheckCircle2 size={22} className="text-green-500" />
                  ) : (
                    <Circle size={22} className="text-muted-foreground" />
                  )}
                </button>
                <div>
                  <p className="font-medium">{item.produtoNome}</p>
                  <p className="text-sm text-muted-foreground">
                    Necessário: {item.quantidadeNecessaria} · Disponível: {item.quantidadeDisponivel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.vencido && (
                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 border border-red-200">
                    Vencido
                  </span>
                )}
                {item.pendente && (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">
                    Pendente
                  </span>
                )}
                {!finalizada && !item.separado && (
                  <button
                    onClick={() => marcarPendente(item.id, item.quantidadeNecessaria)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Marcar indisponível
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={concluir}
          disabled={finalizada || concluindo}
          className="px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-lg bg-primary text-primary-foreground hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {finalizada ? "Preparação concluída" : concluindo ? "Concluindo..." : "Concluir Preparação"}
        </button>
      </div>
    </div>
  );
}
