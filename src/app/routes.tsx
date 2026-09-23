import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Notificacoes } from "./components/Notificacoes";
import { RequireAuth } from "./auth/RequireAuth";

import { ProfessorLayout } from "./components/professor/ProfessorLayout";
import { Dashboard } from "./components/professor/Dashboard";
import { ModulePlaceholder } from "./components/professor/ModulePlaceholder";
import { RoteirosManagement } from "./components/professor/RoteirosManagement";
import { AgendaProfessor } from "./components/professor/AgendaProfessor";
import { MeusEmprestimos } from "./components/professor/MeusEmprestimos";

import { AuxiliarLayout } from "./components/auxiliar/AuxiliarLayout";
import { AuxiliarDashboard } from "./components/auxiliar/AuxiliarDashboard";
import { UsuariosManagement } from "./components/auxiliar/UsuariosManagement";
import { SolicitacoesCompra } from "./components/auxiliar/SolicitacoesCompra";
import { EmprestimosAuxiliar } from "./components/auxiliar/EmprestimosAuxiliar";
import { AgendaAuxiliar } from "./components/auxiliar/AgendaAuxiliar";
import { PrepararPratica } from "./components/auxiliar/PrepararPratica";
import { RecebimentoEntradas } from "./components/auxiliar/RecebimentoEntradas";

import { AlunoLayout } from "./components/aluno/AlunoLayout";
import { AlunoDashboard } from "./components/aluno/AlunoDashboard";
import { QuimicaGamePage } from "./components/aluno/games/pages/QuimicaGamePage";
import { BiologiaGamePage } from "./components/aluno/games/pages/BiologiaGamePage";
import { ExperimentosCatalogo } from "./components/components/experimentos/ExperimentosCatalogo";
import { ExperimentoDetalhe } from "./components/auxiliar/ExperimentoDetalhe";

import {
  Beaker,
  Bug,
  Heart,
  ClipboardList,
  FlaskConical,
  Users,
  GraduationCap,
  Gamepad2,
  Package,
} from "lucide-react";
import { ReagentesViewer } from "./components/professor/ReagentesViewer";
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
        path: "turmas",
        element: (
          <ModulePlaceholder
            icon={Users}
            title="Minhas Turmas"
            description="Visualize suas turmas e crie novas quando necessário"
          />
        ),
      },
      {
        path: "alunos",
        element: (
          <ModulePlaceholder
            icon={GraduationCap}
            title="Alunos"
            description="Cadastro e acompanhamento de alunos"
          />
        ),
      },
      {
        path: "reagentes",
        element: <ReagentesViewer />,
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
        path: "vidrarias",
        element: (
          <ModulePlaceholder
            icon={Beaker}
            title="Vidrarias"
            description="Rastreie cada item com estado de conservação e localização"
          />
        ),
      },
      {
        path: "colecao-zoologica",
        element: (
          <ModulePlaceholder
            icon={Bug}
            title="Coleção Zoológica"
            description="Catalogação taxonômica completa com registro fotográfico"
          />
        ),
      },
      {
        path: "modelos-anatomicos",
        element: (
          <ModulePlaceholder
            icon={Heart}
            title="Modelos Anatômicos"
            description="Gestão de peças didáticas com controle de empréstimo"
          />
        ),
      },
      {
        path: "roteiros",
        element: <RoteirosManagement />,
      },
      {
        path: "atividades",
        element: (
          <ModulePlaceholder
            icon={ClipboardList}
            title="Atividades"
            description="Gerencie atividades e avaliações para suas turmas"
          />
        ),
      },
      {
        path: "praticas",
        element: (
          <ModulePlaceholder
            icon={FlaskConical}
            title="Práticas"
            description="Organize práticas de laboratório com controle de materiais"
          />
        ),
      },
      {
        path: "agendamentos/reservas",
        element: <AgendaProfessor />,
      },
      {
        path: "agendamentos/solicitacoes",
        element: <MeusEmprestimos />,
      },
      {
        path: "notificacoes",
        element: <Notificacoes />,
      },
      {
        path: "games/quimica-n1",
        element: (
          <ModulePlaceholder
            icon={Gamepad2}
            title="Química N1"
            description="Atividades gamificadas de Química - Nível 1"
          />
        ),
      },
      {
        path: "games/biologia",
        element: (
          <ModulePlaceholder
            icon={Gamepad2}
            title="Biologia"
            description="Atividades gamificadas de Biologia"
          />
        ),
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
        path: "reagentes",
        element: <ReagentesManagement />,
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
        path: "vidrarias",
        element: (
          <ModulePlaceholder
            icon={Beaker}
            title="Vidrarias"
            description="Gerencie vidrarias com estado de conservação e localização"
          />
        ),
      },
      {
        path: "colecao-zoologica",
        element: (
          <ModulePlaceholder
            icon={Bug}
            title="Coleção Zoológica"
            description="Catalogação taxonômica completa com registro fotográfico"
          />
        ),
      },
      {
        path: "modelos-anatomicos",
        element: (
          <ModulePlaceholder
            icon={Heart}
            title="Modelos Anatômicos"
            description="Gestão de peças didáticas com controle de empréstimo"
          />
        ),
      },
      {
        path: "inventario",
        element: (
          <ModulePlaceholder
            icon={Package}
            title="Inventário"
            description="Visualize e organize o inventário completo do laboratório"
          />
        ),
      },
      {
        path: "usuarios",
        element: <UsuariosManagement />,
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
        path: "roteiros",
        element: <ExperimentosCatalogo />,
      },
      {
        path: "solicitacoes/reservas",
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
        path: "notificacoes",
        element: <Notificacoes />,
      },
    ],
  },

  // ALUNO (fora do escopo do backend de gestão de laboratório — visão gamificada, mantida como protótipo)
  {
    path: "/aluno",
    element: <AlunoLayout />,
    children: [
      {
        index: true,
        element: <AlunoDashboard />
      },
      {
        path: "turmas",
        element: (
          <ModulePlaceholder
            icon={Users}
            title="Minhas Turmas"
            description="Visualize suas turmas e informações relacionadas"
          />
        ),
      },
      {
        path: "colegas",
        element: (
          <ModulePlaceholder
            icon={GraduationCap}
            title="Colegas"
            description="Consulte os colegas das suas turmas"
          />
        ),
      },
      {
        path: "roteiros",
        element: (
          <ModulePlaceholder
            icon={ClipboardList}
            title="Roteiros de Aula"
            description="Acesse os roteiros disponibilizados pelos professores"
          />
        ),
      },
      {
        path: "atividades",
        element: (
          <ModulePlaceholder
            icon={ClipboardList}
            title="Atividades"
            description="Visualize e acompanhe suas atividades"
          />
        ),
      },
      {
        path: "praticas",
        element: (
          <ModulePlaceholder
            icon={FlaskConical}
            title="Práticas"
            description="Acompanhe as práticas de laboratório"
          />
        ),
      },
      {
        path: "agendamentos/reservas",
        element: (
          <ModulePlaceholder
            icon={ClipboardList}
            title="Minhas Reservas"
            description="Consulte suas reservas e agendamentos"
          />
        ),
      },
      {
        path: "agendamentos/solicitacoes",
        element: (
          <ModulePlaceholder
            icon={ClipboardList}
            title="Solicitações"
            description="Acompanhe solicitações relacionadas às atividades"
          />
        ),
      },
      {
        path: "games/quimica",
        element: <QuimicaGamePage />,
      },
      {
        path: "games/biologia",
        element: <BiologiaGamePage />,
      },
    ],
  },
]);
