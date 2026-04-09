import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { CreateAccount } from "./components/CreateAccount";
import { ProfessorLayout } from "./components/professor/ProfessorLayout";
import { Dashboard } from "./components/professor/Dashboard";
import { Reagentes } from "./components/professor/Reagentes";
import { ModulePlaceholder } from "./components/professor/ModulePlaceholder";
import {
  Beaker,
  Bug,
  Heart,
  BookOpen,
  ClipboardList,
  FlaskConical,
  Users,
  GraduationCap,
  Gamepad2,
} from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/criar-conta",
    element: <CreateAccount />,
  },
  {
    path: "/professor",
    element: <ProfessorLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "reagentes",
        element: <Reagentes />,
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
        element: (
          <ModulePlaceholder
            icon={BookOpen}
            title="Roteiros de Aulas"
            description="Crie e gerencie roteiros pedagógicos vinculados ao inventário"
          />
        ),
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
        path: "salas",
        element: (
          <ModulePlaceholder
            icon={GraduationCap}
            title="Salas"
            description="Gerencie turmas e horários de aula"
          />
        ),
      },
      {
        path: "alunos",
        element: (
          <ModulePlaceholder
            icon={Users}
            title="Alunos"
            description="Cadastro e acompanhamento de alunos"
          />
        ),
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
        path: "games/quimica-n2",
        element: (
          <ModulePlaceholder
            icon={Gamepad2}
            title="Química N2"
            description="Atividades gamificadas de Química - Nível 2"
          />
        ),
      },
      {
        path: "games/quimica-n3",
        element: (
          <ModulePlaceholder
            icon={Gamepad2}
            title="Química N3"
            description="Atividades gamificadas de Química - Nível 3"
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
]);
