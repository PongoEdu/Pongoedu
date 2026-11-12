import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Notificacoes } from "./components/Notificacoes";
import { MeuPerfil } from "./components/MeuPerfil";
import { RequireAuth } from "./auth/RequireAuth";

import { ProfessorLayout } from "./components/professor/ProfessorLayout";
import { Dashboard } from "./components/professor/Dashboard";
import { RoteirosManagement } from "./components/professor/RoteirosManagement";
import { RoteirosPublicos } from "./components/professor/RoteirosPublicos";
import { AgendaProfessor } from "./components/professor/AgendaProfessor";
import { MeusEmprestimos } from "./components/professor/MeusEmprestimos";

import { AuxiliarLayout } from "./components/auxiliar/AuxiliarLayout";
import { AuxiliarDashboard } from "./components/auxiliar/AuxiliarDashboard";
import { CategoriasManagement } from "./components/auxiliar/CategoriasManagement";
import { MovimentacoesEstoque } from "./components/auxiliar/MovimentacoesEstoque";
import { UsuariosManagement } from "./components/auxiliar/UsuariosManagement";
import { SolicitacoesCompra } from "./components/auxiliar/SolicitacoesCompra";
import { EmprestimosAuxiliar } from "./components/auxiliar/EmprestimosAuxiliar";
import { AgendaAuxiliar } from "./components/auxiliar/AgendaAuxiliar";
import { PrepararPratica } from "./components/auxiliar/PrepararPratica";
import { RecebimentoEntradas } from "./components/auxiliar/RecebimentoEntradas";

import { ExperimentosCatalogo } from "./components/components/experimentos/ExperimentosCatalogo";
import { ExperimentoDetalhe } from "./components/auxiliar/ExperimentoDetalhe";

import { ProdutosEstoque } from "./components/professor/ProdutosEstoque";
import { ReagentesManagement } from "./components/auxiliar/ReagentesManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // PROFESSOR
  {
    path: "/professor",
    element: (
      <RequireAuth perfil="PROFESSOR">
        <ProfessorLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "estoque/produtos",
        element: <ProdutosEstoque />,
      },
      {
        path: "estoque/emprestimos",
        element: <MeusEmprestimos />,
      },
      {
        path: "experimentos",
        element: <ExperimentosCatalogo />,
      },
      {
        path: "experimentos/:id",
        element: <ExperimentoDetalhe />,
      },
      {
        path: "roteiros",
        element: <RoteirosManagement />,
      },
      {
        path: "roteiros/publicos",
        element: <RoteirosPublicos />,
      },
      {
        path: "agendamentos/reservas",
        element: <AgendaProfessor />,
      },
      {
        path: "notificacoes",
        element: <Notificacoes />,
      },
      {
        path: "perfil",
        element: <MeuPerfil />,
      },
    ],
  },

  // AUXILIAR
  {
    path: "/auxiliar",
    element: (
      <RequireAuth perfil="AUXILIAR_LABORATORIO">
        <AuxiliarLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <AuxiliarDashboard />,
      },
      {
        path: "estoque/produtos",
        element: <ReagentesManagement />,
      },
      {
        path: "estoque/categorias",
        element: <CategoriasManagement />,
      },
      {
        path: "estoque/movimentacoes",
        element: <MovimentacoesEstoque />,
      },
      {
        path: "experimentos/:id",
        element: <ExperimentoDetalhe />,
      },
      {
        path: "solicitacoes/compras",
        element: <SolicitacoesCompra />,
      },
      {
        path: "solicitacoes/emprestimos",
        element: <EmprestimosAuxiliar />,
      },
      {
        path: "agendamentos/agenda",
        element: <AgendaAuxiliar />,
      },
      {
        path: "agendamentos/:id/preparar",
        element: <PrepararPratica />,
      },
      {
        path: "recebimento/entradas",
        element: <RecebimentoEntradas />,
      },
      {
        path: "administracao/usuarios",
        element: <UsuariosManagement />,
      },
      {
        path: "notificacoes",
        element: <Notificacoes />,
      },
      {
        path: "perfil",
        element: <MeuPerfil />,
      },
    ],
  },
]);
