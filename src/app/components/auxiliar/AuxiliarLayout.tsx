import { AppShell, type MenuItem } from "../layout/AppShell";

const menuItems: MenuItem[] = [
  {
    title: "Início",
    icon: "home",
    path: "/auxiliar",
  },
  {
    title: "Estoque",
    icon: "inventory_2",
    submenu: [
      { title: "Produtos", path: "/auxiliar/estoque/produtos", icon: "science" },
      { title: "Categoria de Produtos", path: "/auxiliar/estoque/categorias", icon: "category" },
      { title: "Movimentações", path: "/auxiliar/estoque/movimentacoes", icon: "swap_horiz" },
    ],
  },
  {
    title: "Solicitações",
    icon: "shopping_cart",
    submenu: [
      { title: "Compras", path: "/auxiliar/solicitacoes/compras", icon: "shopping_bag" },
      { title: "Empréstimos", path: "/auxiliar/solicitacoes/emprestimos", icon: "swap_horiz" },
    ],
  },
  {
    title: "Recebimento",
    icon: "local_shipping",
    submenu: [{ title: "Entradas", path: "/auxiliar/recebimento/entradas", icon: "move_to_inbox" }],
  },
  {
    title: "Agendamentos",
    icon: "calendar_month",
    submenu: [{ title: "Agenda", path: "/auxiliar/agendamentos/agenda", icon: "calendar_month" }],
  },
  {
    title: "Administração",
    icon: "admin_panel_settings",
    submenu: [{ title: "Usuários", path: "/auxiliar/administracao/usuarios", icon: "group" }],
  },
];

export function AuxiliarLayout() {
  return (
    <AppShell
      menuItems={menuItems}
      basePath="/auxiliar"
      roleLabel="Auxiliar de Laboratório"
      notificacoesPath="/auxiliar/notificacoes"
    />
  );
}
