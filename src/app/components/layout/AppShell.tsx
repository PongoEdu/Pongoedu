import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { MascotLogo } from "../mascot-logo";
import { useAuth } from "../../auth/AuthContext";
import { notificacoesApi } from "../../../lib/api/notificacoes";
import type { NotificacaoResponse } from "../../../lib/api/types";

export interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  submenu?: { title: string; path: string; icon: string }[];
}

interface AppShellProps {
  menuItems: MenuItem[];
  /** Rota raiz do perfil (ex.: "/professor"). */
  basePath: string;
  /** Rótulo exibido abaixo da marca e no menu do usuário. */
  roleLabel: string;
  /** Rota da tela de notificações. */
  notificacoesPath: string;
}

const GREEN = "var(--green)";
const PURPLE = "var(--purple)";

const itemBase =
  "w-full flex items-center gap-3 min-h-[44px] px-3.5 py-[11px] rounded-2xl text-sm border-0 cursor-pointer no-underline transition-colors";
const itemHover = "hover:bg-gradient-to-br hover:from-brand-purple hover:to-[#6b18e8] hover:!text-white";
const itemActive =
  "text-white bg-gradient-to-br from-brand-green to-[#0da34b] shadow-[0_8px_20px_rgba(16,187,85,0.28)]";

export function AppShell({ menuItems, basePath, roleLabel, notificacoesPath }: AppShellProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[] | null>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Garante que o módulo da rota atual esteja aberto (sem fechar os demais) e fecha o menu mobile ao navegar
  useEffect(() => {
    const currentPath = location.pathname;
    const activeModule = menuItems.find((item) =>
      item.submenu?.some((subitem) => subitem.path === currentPath)
    );
    if (activeModule) {
      setExpandedMenus((prev) =>
        prev.includes(activeModule.title) ? prev : [...prev, activeModule.title]
      );
    }
    setMobileOpen(false);
  }, [location.pathname, menuItems]);

  // Fecha os dropdowns ao clicar fora
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const abrirNotificacoes = () => {
    const abrir = !notifOpen;
    setNotifOpen(abrir);
    setUserOpen(false);
    if (abrir) {
      notificacoesApi
        .minhas()
        .then(setNotificacoes)
        .catch(() => setNotificacoes([]));
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const nome = usuario?.nome ?? "Usuário";
  const inicial = nome.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-[248px] flex-col border-r border-brand-line bg-white px-3.5 py-6 transition-transform duration-[250ms] ease-out max-md:-translate-x-full ${
          mobileOpen ? "max-md:!translate-x-0" : ""
        }`}
      >
        <Link
          to={basePath}
          className="flex items-center gap-3 border-b border-brand-line px-2 pb-6 no-underline"
        >
          <MascotLogo size={58} />
          <div>
            <strong className="block text-lg leading-tight" style={{ fontWeight: 900 }}>
              <span style={{ color: GREEN }}>Pongo</span>
              <span style={{ color: PURPLE }}>Edu</span>
            </strong>
            <small className="mt-1 block text-[13px] leading-snug text-brand-muted">Laboratórios Educacionais</small>
          </div>
        </Link>

        <nav className="min-h-0 flex-1 overflow-y-auto pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => {
            const aberto = expandedMenus.includes(item.title);
            return (
              <div key={item.title}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`${itemBase} font-bold ${
                      isActive(item.path) ? itemActive : `bg-transparent text-brand-dark ${itemHover}`
                    }`}
                  >
                    <span className="material-symbols-rounded">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`${itemBase} font-bold bg-transparent text-brand-dark ${itemHover}`}
                    >
                      <span className="material-symbols-rounded">{item.icon}</span>
                      <span>{item.title}</span>
                      <span
                        className={`material-symbols-rounded ml-auto !text-[20px] transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                    </button>
                    {aberto && item.submenu && (
                      <div className="pb-2 pt-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`${itemBase} pl-[42px] font-semibold ${
                              isActive(subitem.path)
                                ? itemActive
                                : `bg-transparent text-[#7b8aa5] ${itemHover}`
                            }`}
                          >
                            <span className="material-symbols-rounded">{subitem.icon}</span>
                            <span>{subitem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[15] bg-[rgba(16,24,40,0.35)] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Conteúdo */}
      <div
        className="min-h-screen w-full overflow-x-hidden md:ml-[248px] md:w-[calc(100%-248px)]"
        style={{
          background:
            "radial-gradient(circle at 2% 5%, #f0eaff 0, transparent 15%), radial-gradient(circle at 100% 96%, #efe9ff 0, transparent 13%), #f8f9ff",
        }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-[82px] items-center justify-between border-b border-brand-line bg-white/80 px-4 backdrop-blur-[16px] md:px-[34px]">
          <div>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="grid h-11 w-11 place-items-center rounded-[14px] border-0 bg-white text-brand-dark md:hidden"
            >
              <span className="material-symbols-rounded">menu</span>
            </button>
          </div>

          <div className="flex items-center gap-[18px]">
            {/* Notificações */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={abrirNotificacoes}
                aria-label="Notificações"
                className="relative border-0 bg-transparent text-[#344054]"
              >
                <span className="material-symbols-rounded">notifications</span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] rounded-[20px] border border-brand-line bg-white p-3.5 shadow-[0_20px_40px_rgba(16,24,40,0.12)]">
                  <div className="mb-2.5 border-b border-brand-line px-1.5 pb-3">
                    <strong className="block text-xl" style={{ fontWeight: 800 }}>
                      Notificações
                    </strong>
                  </div>

                  {notificacoes === null ? (
                    <p className="py-6 text-center text-sm text-brand-muted">Carregando...</p>
                  ) : notificacoes.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-3 py-6 text-center text-brand-muted">
                      <span className="material-symbols-rounded !text-[36px] opacity-40">notifications_off</span>
                      <p className="m-0 text-sm">Nenhuma notificação por aqui.</p>
                    </div>
                  ) : (
                    <>
                      <ul className="max-h-[280px] overflow-y-auto">
                        {notificacoes.slice(0, 5).map((n) => (
                          <li key={n.id} className="border-b border-brand-line px-1.5 py-2.5 last:border-0">
                            <p className="m-0 truncate text-[13px] font-bold text-brand-dark">{n.assunto}</p>
                            <p className="m-0 line-clamp-2 text-xs text-brand-muted">{n.mensagem}</p>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={notificacoesPath}
                        onClick={() => setNotifOpen(false)}
                        className="mt-2 block rounded-[14px] py-2 text-center text-sm font-bold no-underline hover:bg-[#f4f7fb]"
                        style={{ color: PURPLE }}
                      >
                        Ver todas
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Usuário */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 border-0 bg-transparent"
              >
                <div
                  className="flex h-[46px] w-[46px] shrink-0 select-none items-center justify-center rounded-full text-xl"
                  style={{ background: "linear-gradient(135deg, #ede8ff, #d1e8ff)", color: PURPLE, fontWeight: 800 }}
                >
                  {inicial}
                </div>
                <div className="hidden text-left md:block">
                  <strong className="block text-sm">{nome}</strong>
                  <small className="text-xs text-brand-muted">{roleLabel}</small>
                </div>
                <span className="material-symbols-rounded hidden text-brand-muted md:block">expand_more</span>
              </button>

              {userOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] rounded-[20px] border border-brand-line bg-white p-3.5 shadow-[0_20px_40px_rgba(16,24,40,0.12)]">
                  <div className="mb-2.5 border-b border-brand-line px-1.5 pb-4">
                    <strong className="block truncate text-xl" style={{ fontWeight: 800 }}>
                      {nome}
                    </strong>
                    <small className="text-sm text-brand-muted">{roleLabel}</small>
                  </div>
                  <button
                    onClick={() => {
                      setUserOpen(false);
                      navigate(`${basePath}/perfil`);
                    }}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-[14px] border-0 bg-transparent px-3 text-base text-brand-dark hover:bg-[#f4f7fb]"
                    style={{ fontWeight: 600 }}
                  >
                    <span className="material-symbols-rounded">person</span>
                    Meu Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-[14px] border-0 bg-transparent px-3 text-base text-brand-red hover:bg-[#f4f7fb]"
                    style={{ fontWeight: 600 }}
                  >
                    <span className="material-symbols-rounded">logout</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="px-0 pb-12 pt-2.5 md:px-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
