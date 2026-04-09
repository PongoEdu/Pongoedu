import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  TestTube,
  Beaker,
  Bug,
  Heart,
  BookOpen,
  ClipboardList,
  FlaskConical,
  Users,
  GraduationCap,
  Gamepad2,
  Home,
  LogOut,
} from "lucide-react";
import { MascotLogo } from "../mascot-logo";

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
    path: "/professor",
  },
  {
    title: "Cadastros",
    icon: ClipboardList,
    submenu: [
      { title: "Reagentes", path: "/professor/reagentes", icon: TestTube },
      { title: "Vidrarias", path: "/professor/vidrarias", icon: Beaker },
      { title: "Coleção Zoológica", path: "/professor/colecao-zoologica", icon: Bug },
      { title: "Modelos Anatômicos", path: "/professor/modelos-anatomicos", icon: Heart },
    ],
  },
  {
    title: "Conteúdos",
    icon: BookOpen,
    submenu: [
      { title: "Roteiros de Aulas", path: "/professor/roteiros", icon: BookOpen },
      { title: "Atividades", path: "/professor/atividades", icon: ClipboardList },
      { title: "Práticas", path: "/professor/praticas", icon: FlaskConical },
    ],
  },
  {
    title: "Turmas",
    icon: Users,
    submenu: [
      { title: "Salas", path: "/professor/salas", icon: GraduationCap },
      { title: "Alunos", path: "/professor/alunos", icon: Users },
    ],
  },
  {
    title: "Games",
    icon: Gamepad2,
    submenu: [
      { title: "Química N1", path: "/professor/games/quimica-n1", icon: Gamepad2 },
      { title: "Química N2", path: "/professor/games/quimica-n2", icon: Gamepad2 },
      { title: "Química N3", path: "/professor/games/quimica-n3", icon: Gamepad2 },
      { title: "Biologia", path: "/professor/games/biologia", icon: Gamepad2 },
    ],
  },
];

export function ProfessorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Cadastros"]);
  const location = useLocation();

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-card border-r-2 border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-border flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <MascotLogo />
              <div>
                <h1 className="text-primary text-lg">PongoEdu</h1>
                <p className="text-xs text-muted-foreground">Professor</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <MascotLogo />
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                    isActive(item.path)
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors hover:bg-accent text-foreground ${
                      collapsed ? "justify-center" : "justify-between"
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
                        className={`transition-transform ${
                          expandedMenus.includes(item.title) ? "rotate-90" : ""
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors text-sm ${
                            isActive(subitem.path)
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
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent text-foreground transition-colors"
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sair</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
