import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  GraduationCap,
  ClipboardList,
  UserRound,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../components/ui/sidebar";

import { useAuthentication } from "../contexts/authentication/useAuthentication";

const ACCOUNT_PATH = "/dashboard/account";

const NAVIGATION = [
  {
    label: "Formações",
    to: "/dashboard/training-tracks",
    icon: GraduationCap,
  },
  {
    label: "Usuários",
    to: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Agendamento",
    to: "/dashboard/schedule",
    icon: CalendarDays,
  },
  {
    label: "Solicitações",
    to: "/dashboard/solicitations",
    icon: ClipboardList,
  },
];

const isActivePath = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`);

function DashboardSidebar() {
  const { user } = useAuthentication();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "?";

  function go(to: string) {
    navigate(to);
    setOpenMobile(false);
  }

  return (
    <Sidebar>
      {/* Perfil */}
      <SidebarHeader className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback className="bg-white text-[#514949] font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>

            <p className="truncate text-xs text-white/60">{user?.email}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navegação */}
      <SidebarContent>
        <SidebarGroup className="px-3 py-5">
          <SidebarGroupLabel className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            Menu principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAVIGATION.map(({ label, to, icon: Icon }) => {
                const active = isActivePath(pathname, to);

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => go(to)}
                      tooltip={label}
                      className={`
                        h-11 rounded-lg px-3 transition-colors
                        ${
                          active
                            ? "bg-white text-[#514949] font-semibold hover:bg-white hover:text-[#514949]"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <Icon className="size-5" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé */}
      <SidebarFooter className="border-t border-white/10 p-4">
        <Button
          type="button"
          size="lg"
          className="h-11 w-full bg-[#3B82F6] font-semibold text-white shadow-sm hover:bg-[#2563EB]"
          onClick={() => go(ACCOUNT_PATH)}
        >
          <UserRound className="mr-2 size-5" />
          Minha conta
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  const { pathname } = useLocation();

  const currentTitle =
    NAVIGATION.find(({ to }) => isActivePath(pathname, to))?.label ??
    (isActivePath(pathname, ACCOUNT_PATH) ? "Minha conta" : "Painel");

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-5" />

          <h1 className="text-sm font-semibold text-[#514949] dark:text-foreground">
            {currentTitle}
          </h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
