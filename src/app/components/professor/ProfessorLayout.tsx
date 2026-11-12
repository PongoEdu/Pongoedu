import { AppShell, type MenuItem } from "../layout/AppShell";

const menuItems: MenuItem[] = [
  {
    title: "Início",
    icon: "home",
    path: "/professor",
  },
  {
    title: "Estoque",
    icon: "inventory_2",
    submenu: [
      { title: "Produtos", path: "/professor/estoque/produtos", icon: "science" },
      { title: "Empréstimos", path: "/professor/estoque/emprestimos", icon: "swap_horiz" },
    ],
  },
  {
    title: "Roteiros",
    icon: "menu_book",
    submenu: [
      { title: "Meus Roteiros", path: "/professor/roteiros", icon: "description" },
      { title: "Roteiros Públicos", path: "/professor/roteiros/publicos", icon: "public" },
      { title: "Experimentos", path: "/professor/experimentos", icon: "experiment" },
    ],
  },
  {
    title: "Agendamentos",
    icon: "calendar_month",
    submenu: [
      { title: "Agendamento", path: "/professor/agendamentos/reservas", icon: "event" },
    ],
  },
];

export function ProfessorLayout() {
  return (
    <AppShell
      menuItems={menuItems}
      basePath="/professor"
      roleLabel="Professor"
      notificacoesPath="/professor/notificacoes"
    />
  );
}
