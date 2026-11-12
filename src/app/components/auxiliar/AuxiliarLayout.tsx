import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ChevronLeft,
  CalendarCheck,
  ChevronRight,
  TestTube,
  Beaker,
  Bug,
  Heart,
  ClipboardList,
  FlaskConical,
  Home,
  LogOut,
  Package,
  ShoppingCart,
  FileText,
  Truck,
  Users,
  HandCoins,
  Bell,
} from "lucide-react";
import { BrandLogo, MascotLogo } from "../mascot-logo";
import { useAuth } from "../../auth/AuthContext";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  submenu?: { title: string; path: string; icon: React.ElementType }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/auxiliar",
  },
  {
    title: "Estoque",
    icon: Package,
    submenu: [
      { title: "Reagentes", path: "/auxiliar/reagentes", icon: TestTube },
      { title: "Vidrarias", path: "/auxiliar/vidrarias", icon: Beaker },
      { title: "Coleção Zoológica", path: "/auxiliar/colecao-zoologica", icon: Bug },
      { title: "Modelos Anatômicos", path: "/auxiliar/modelos-anatomicos", icon: Heart },
      { title: "Experimentos", icon: FlaskConical, path: "/auxiliar/experimentos" },
      { title: "Inventário", path: "/auxiliar/inventario", icon: ClipboardList },
    ],
  },
  {
    title: "Solicitações",
    icon: ShoppingCart,
    submenu: [
      { title: "Compras", path: "/auxiliar/solicitacoes/compras", icon: ShoppingCart },
      { title: "Empréstimos", path: "/auxiliar/solicitacoes/emprestimos", icon: HandCoins },
      { title: "Roteiros de Aula", path: "/auxiliar/roteiros", icon: FileText },
      { title: "Agendamento", path: "/auxiliar/solicitacoes/reservas", icon: CalendarCheck },
    ],
  },
  {
    title: "Recebimento",
    icon: Truck,
    submenu: [
      { title: "Entradas", path: "/auxiliar/recebimento/entradas", icon: ClipboardList },
    ],
  },
  {
    title: "Usuários",
    icon: Users,
    path: "/auxiliar/usuarios",
  },
  {
    title: "Notificações",
    icon: Bell,
    path: "/auxiliar/notificacoes",
  },
];

export function AuxiliarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Função para alternar menu - fecha outros menus quando um é aberto
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(title)) {
        // Se está aberto, fecha
        return prev.filter((item) => item !== title);
      } else {
        // Se está fechado, abre e fecha os outros
        return [title];
      }
    });
  };

  // Detecta a rota atual e expande o módulo correto automaticamente
  useEffect(() => {
    const currentPath = location.pathname;

    // Encontra qual módulo contém a rota atual
    const activeModule = menuItems.find((item) => {
      if (item.submenu) {
        return item.submenu.some((subitem) => subitem.path === currentPath);
      }
      return false;
    });

    // Se encontrou um módulo, expande ele
    if (activeModule) {
      setExpandedMenus([activeModule.title]);
    } else if (currentPath === "/auxiliar") {
      // Se está no dashboard, fecha todos os módulos
      setExpandedMenus([]);
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-card border-r-2 border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-border flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <BrandLogo size={44} titleSize={20} subtitle={usuario?.nome ?? "Auxiliar"} className="max-w-[170px]" />
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <MascotLogo size={40} />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 -right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-10"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-foreground"
                    }`}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => !collapsed && toggleMenu(item.title)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors hover:bg-accent text-foreground ${collapsed ? "justify-center" : "justify-between"
                      }`}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${expandedMenus.includes(item.title) ? "rotate-90" : ""
                          }`}
                      />
                    )}
                  </button>
                  {!collapsed && expandedMenus.includes(item.title) && item.submenu && (
                    <div className="ml-4 mb-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors text-sm ${isActive(subitem.path)
                              ? "bg-primary/20 text-primary"
                              : "hover:bg-accent text-muted-foreground"
                            }`}
                        >
                          <subitem.icon size={16} className="flex-shrink-0" />
                          <span>{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-2 border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent text-foreground transition-colors"
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
