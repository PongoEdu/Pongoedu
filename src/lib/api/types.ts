// Tipos e enums que espelham o contrato da API do backend PongoEdu (Spring Boot).

export type Perfil = "PROFESSOR" | "AUXILIAR_LABORATORIO";

export type UnidadeMedida =
  | "UNIDADE"
  | "GRAMA"
  | "QUILOGRAMA"
  | "MILILITRO"
  | "LITRO"
  | "CAIXA"
  | "PACOTE"
  | "FRASCO";

export type StatusEstoque = "DISPONIVEL" | "BAIXO" | "CRITICO" | "ESGOTADO";

export type TipoMovimentacao = "ENTRADA" | "SAIDA";

export type OrigemMovimentacao =
  | "RECEBIMENTO"
  | "PREPARACAO_PRATICA"
  | "EMPRESTIMO"
  | "DEVOLUCAO_EMPRESTIMO"
  | "AJUSTE_MANUAL"
  | "DESCARTE";

export type TipoEntrada = "CODIGO_SISTEMA" | "NOTA_FISCAL";

export type SituacaoSolicitacaoCompra = "PENDENTE" | "ATENDIDA" | "RECUSADA" | "CANCELADA";

export type SituacaoEmprestimo =
  | "PENDENTE"
  | "APROVADO"
  | "RECUSADO"
  | "RETIRADO"
  | "DEVOLVIDO"
  | "CANCELADO";

export type SituacaoAgendamento = "AGENDADO" | "PREPARADO" | "REALIZADO" | "CANCELADO";

export type SituacaoPreparacao = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "COM_PENDENCIA";

export type NivelEnsino = "FUNDAMENTAL_I" | "FUNDAMENTAL_II" | "MEDIO";

export type NivelSeguranca = "BAIXO" | "MEDIO" | "ALTO";

export type TipoNotificacao =
  | "NOVIDADES_SEMANAIS"
  | "LEMBRETE_PRATICA"
  | "SOLICITACAO_COMPRA"
  | "SOLICITACAO_EMPRESTIMO"
  | "AGENDAMENTO"
  | "PREPARACAO_PRATICA";

export type SituacaoNotificacao = "PENDENTE" | "ENVIADA" | "FALHA";

export interface ApiErrorShape {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  campos?: Record<string, string>;
}

// ---------- Auth / Usuários ----------

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  criadoEm: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEmMs: number;
  usuario: UsuarioResponse;
}

export interface CriarUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

export interface AtualizarUsuarioRequest {
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  senha?: string | null;
}

// ---------- Categorias ----------

export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao: string | null;
  permiteEmprestimo: boolean;
  ativo: boolean;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string | null;
  permiteEmprestimo: boolean;
}

// ---------- Lotes ----------

export interface LoteResponse {
  id: number;
  codigo: string;
  fornecedor: string | null;
  dataFabricacao: string | null;
  dataValidade: string | null;
  vencido: boolean;
  observacao: string | null;
}

export interface LoteRequest {
  codigo: string;
  fornecedor?: string | null;
  dataFabricacao?: string | null;
  dataValidade?: string | null;
  observacao?: string | null;
}

// ---------- Produtos ----------

export interface ProdutoResponse {
  id: number;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: CategoriaResponse;
  lote: LoteResponse | null;
  unidadeMedida: UnidadeMedida;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  statusEstoque: StatusEstoque;
  localizacao: string | null;
  vencido: boolean;
  permiteEmprestimo: boolean;
  ativo: boolean;
}

export interface ProdutoRequest {
  codigo: string;
  nome: string;
  descricao?: string | null;
  categoriaId: number;
  loteId?: number | null;
  unidadeMedida: UnidadeMedida;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  localizacao?: string | null;
}

// ---------- Laboratórios ----------

export interface LaboratorioResponse {
  id: number;
  nome: string;
  descricao: string | null;
  capacidade: number | null;
  ativo: boolean;
}

export interface LaboratorioRequest {
  nome: string;
  descricao?: string | null;
  capacidade?: number | null;
}

// ---------- Movimentações ----------

export interface MovimentacaoResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  loteCodigo: string | null;
  tipo: TipoMovimentacao;
  origem: OrigemMovimentacao;
  quantidade: number;
  quantidadeAnterior: number;
  quantidadeResultante: number;
  usuarioNome: string;
  observacao: string | null;
  dataMovimentacao: string;
}

export interface AjusteEstoqueRequest {
  produtoId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string | null;
}

// ---------- Recebimentos ----------

export interface ItemRecebimentoRequest {
  produtoId: number;
  loteId: number;
  quantidade: number;
  valorUnitario?: number | null;
  confirmarVencido?: boolean;
}

export interface RecebimentoRequest {
  tipoEntrada: TipoEntrada;
  numeroNotaFiscal?: string | null;
  fornecedor?: string | null;
  dataRecebimento: string;
  observacao?: string | null;
  itens: ItemRecebimentoRequest[];
}

export interface ItemRecebimentoResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  loteCodigo: string;
  dataValidade: string | null;
  quantidade: number;
  valorUnitario: number | null;
}

export interface RecebimentoResponse {
  id: number;
  tipoEntrada: TipoEntrada;
  numeroNotaFiscal: string | null;
  fornecedor: string | null;
  dataRecebimento: string;
  auxiliarNome: string;
  observacao: string | null;
  itens: ItemRecebimentoResponse[];
}

// ---------- Solicitações de compra ----------

export interface SolicitacaoCompraResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  quantidadeSugerida: number;
  situacao: SituacaoSolicitacaoCompra;
  geradaAutomaticamente: boolean;
  dataGeracao: string;
  dataAtendimento: string | null;
  usuarioAtendimento: string | null;
  observacao: string | null;
}

// ---------- Empréstimos ----------

export interface EmprestimoResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  professorNome: string;
  auxiliarAtendimento: string | null;
  quantidade: number;
  dataInicio: string;
  dataFim: string;
  finalidade: string | null;
  situacao: SituacaoEmprestimo;
  dataSolicitacao: string;
  dataRetirada: string | null;
  dataDevolucao: string | null;
  ocorrencia: string | null;
  observacao: string | null;
  atrasado: boolean;
}

export interface EmprestimoRequest {
  produtoId: number;
  quantidade: number;
  dataInicio: string;
  dataFim: string;
  finalidade?: string | null;
}

// ---------- Roteiros ----------

export interface MaterialRoteiroRequest {
  produtoId: number;
  quantidadeNecessaria: number;
  observacao?: string | null;
}

export interface MaterialRoteiroResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeNecessaria: number;
  quantidadeDisponivel: number;
  disponivel: boolean;
  vencido: boolean;
  observacao: string | null;
}

export interface RoteiroRequest {
  titulo: string;
  objetivo?: string | null;
  procedimento?: string | null;
  tema?: string | null;
  disciplina?: string | null;
  nivelEnsino?: NivelEnsino | null;
  nivelSeguranca?: NivelSeguranca | null;
  tempoEstimadoMinutos?: number | null;
  publicado: boolean;
  geradoPorIa: boolean;
  materiais: MaterialRoteiroRequest[];
}

export interface RoteiroResponse {
  id: number;
  titulo: string;
  objetivo: string | null;
  procedimento: string | null;
  tema: string | null;
  disciplina: string | null;
  nivelEnsino: NivelEnsino | null;
  nivelSeguranca: NivelSeguranca | null;
  tempoEstimadoMinutos: number | null;
  professorId: number;
  professorNome: string;
  geradoPorIa: boolean;
  publicado: boolean;
  possuiPendenciaMaterial: boolean;
  criadoEm: string;
  materiais: MaterialRoteiroResponse[];
}

export interface SugestaoIaRequest {
  tema: string;
  nivelEnsino?: NivelEnsino | null;
  disciplina?: string | null;
  objetivo?: string | null;
}

export interface MaterialSugeridoIa {
  produtoId: number;
  produtoNome: string;
  quantidadeNecessaria: number;
  quantidadeDisponivel: number;
}

export interface SugestaoIaResponse {
  titulo: string;
  objetivo: string | null;
  procedimento: string | null;
  tempoEstimadoMinutos: number | null;
  materiaisSugeridos: MaterialSugeridoIa[];
  observacao: string | null;
}

// ---------- Agendamentos ----------

export interface AgendamentoRequest {
  laboratorioId: number;
  roteiroId: number;
  turma?: string | null;
  data: string;
  horaInicio: string;
  horaFim: string;
  observacao?: string | null;
}

export interface AgendamentoResponse {
  id: number;
  professorId: number;
  professorNome: string;
  laboratorioId: number;
  laboratorioNome: string;
  roteiroId: number;
  roteiroTitulo: string;
  turma: string | null;
  data: string;
  horaInicio: string;
  horaFim: string;
  situacao: SituacaoAgendamento;
  observacao: string | null;
}

export interface FaixaHorario {
  horaInicio: string;
  horaFim: string;
}

export interface DisponibilidadeResponse {
  disponivel: boolean;
  mensagem: string | null;
  ocupados: FaixaHorario[];
  sugestoes: FaixaHorario[];
}

// ---------- Preparações ----------

export interface ItemPreparacaoResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeNecessaria: number;
  quantidadeDisponivel: number;
  quantidadeSeparada: number;
  separado: boolean;
  pendente: boolean;
  vencido: boolean;
  observacao: string | null;
}

export interface PreparacaoResponse {
  id: number;
  agendamentoId: number;
  auxiliarNome: string;
  situacao: SituacaoPreparacao;
  dataInicio: string;
  dataConclusao: string | null;
  observacao: string | null;
  itens: ItemPreparacaoResponse[];
}

export interface AtualizarItemPreparacaoRequest {
  separado: boolean;
  quantidadeSeparada: number;
  pendente: boolean;
  observacao?: string | null;
}

// ---------- Notificações ----------

export interface NotificacaoResponse {
  id: number;
  destinatario: string;
  tipo: TipoNotificacao;
  assunto: string;
  mensagem: string;
  situacao: SituacaoNotificacao;
  tentativas: number;
  erro: string | null;
  dataGeracao: string;
  dataEnvio: string | null;
}
