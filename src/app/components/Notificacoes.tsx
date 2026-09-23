import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { notificacoesApi } from "../../lib/api/notificacoes";
import { mensagemDeErro } from "../auth/AuthContext";
import type { NotificacaoResponse, SituacaoNotificacao } from "../../lib/api/types";

const situacaoBadge: Record<SituacaoNotificacao, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  ENVIADA: { label: "Enviada", color: "bg-green-100 text-green-700 border-green-200" },
  FALHA: { label: "Falha", color: "bg-red-100 text-red-700 border-red-200" },
};

const tipoLabel: Record<string, string> = {
  NOVIDADES_SEMANAIS: "Novidades da semana",
  LEMBRETE_PRATICA: "Lembrete de prática",
  SOLICITACAO_COMPRA: "Solicitação de compra",
  SOLICITACAO_EMPRESTIMO: "Solicitação de empréstimo",
  AGENDAMENTO: "Agendamento",
  PREPARACAO_PRATICA: "Preparação de prática",
};

export function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificacoesApi
      .minhas()
      .then(setNotificacoes)
      .catch((err) => toast.error(mensagemDeErro(err, "Erro ao buscar notificações.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl">Notificações</h1>
        </div>
        <p className="text-muted-foreground">Novidades semanais e lembretes enviados para você</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">Nenhuma notificação por aqui</p>
          </div>
        ) : (
          notificacoes.map((n) => (
            <div key={n.id} className="bg-card border-2 border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{tipoLabel[n.tipo] ?? n.tipo}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${situacaoBadge[n.situacao].color}`}>
                  {situacaoBadge[n.situacao].label}
                </span>
              </div>
              <h3 className="font-medium mb-1">{n.assunto}</h3>
              <p className="text-sm text-muted-foreground">{n.mensagem}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {n.dataEnvio ? `Enviada em ${n.dataEnvio}` : `Gerada em ${n.dataGeracao}`}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
