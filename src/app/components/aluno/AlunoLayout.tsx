import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  FlaskConical,
  CalendarCheck,
  Gamepad2,
} from "lucide-react";
import { MascotLogo } from "../mascot-logo";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  submenu?: {
    title: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/aluno",
  },
  {
    title: "Turmas",
    icon: Users,
    submenu: [
      {
        title: "Minhas Turmas",
        path: "/aluno/turmas",
        icon: Users,
      },
      {
        title: "Equipes",
        path: "/aluno/equipes",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Conteúdos",
    icon: BookOpen,
    submenu: [
      {
        title: "Roteiros de Aula",
        path: "/aluno/roteiros",
        icon: FileText,
      },
      {
        title: "Atividades",
        path: "/aluno/atividades",
        icon: ClipboardList,
      },
      {
        title: "Práticas",
        path: "/aluno/praticas",
        icon: FlaskConical,
      },
    ],
  },
  {
    title: "Agendamentos",
    icon: CalendarCheck,
    submenu: [
      {
        title: "Meus Eventos",
        path: "/aluno/agendamentos/reservas",
        icon: CalendarCheck,
      },
      {
        title: "Solicitações",
        path: "/aluno/agendamentos/solicitacoes",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Games",
    icon: Gamepad2,
    submenu: [
      {
        title: "Química",
        path: "/aluno/games/quimica",
        icon: Gamepad2,
      },
      {
        title: "Biologia",
        path: "/aluno/games/biologia",
        icon: Gamepad2,
      },
    ],
  },
];

export function AlunoLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(
    [],
  );
  const location = useLocation();

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(title)) {
        return prev.filter((item) => item !== title);
      }
      return [title];
    });
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const activeModule = menuItems.find((item) => {
      if (item.submenu) {
        return item.submenu.some((subitem) =>
          currentPath.startsWith(subitem.path),
        );
      }
      return false;
    });

    if (activeModule) {
      setExpandedMenus([activeModule.title]);
    } else if (currentPath === "/aluno") {
      setExpandedMenus([]);
    }
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/aluno") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-card border-r-2 border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b-2 border-border flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <MascotLogo />
              <div>
                <h1 className="text-primary text-lg">
                  PongoEdu
                </h1>
                <p className="text-xs text-muted-foreground">
                  Aluno
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto">
              <MascotLogo />
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 -right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-10"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>

        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-foreground"
                  }`}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon
                    size={20}
                    className="flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-sm">
                      {item.title}
                    </span>
                  )}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() =>
                      !collapsed && toggleMenu(item.title)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors hover:bg-accent text-foreground ${
                      collapsed
                        ? "justify-center"
                        : "justify-between"
                    }`}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className="flex-shrink-0"
                      />
                      {!collapsed && (
                        <span className="text-sm">
                          {item.title}
                        </span>
                      )}
                    </div>

                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${
                          expandedMenus.includes(item.title)
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    )}
                  </button>

                  {!collapsed &&
                    expandedMenus.includes(item.title) &&
                    item.submenu && (
                      <div className="ml-4 mb-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors text-sm ${
                              isActive(subitem.path)
                                ? "bg-primary/20 text-primary"
                                : "hover:bg-accent text-muted-foreground"
                            }`}
                          >
                            <subitem.icon
                              size={16}
                              className="flex-shrink-0"
                            />
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

        <div className="p-4 border-t-2 border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent text-foreground transition-colors"
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm">Sair</span>
            )}
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}