import { useEffect, useState } from "react";
import {
  UsersRound,
  Mail,
  GraduationCap,
  Eye,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  Trash2,
  Building2,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useUsers } from "../../contexts/users/useUsers";

import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { DataPagination } from "../../components/shared/DataPagination";
import { DataSearch } from "../../components/shared/DataSearch.tsx";

import DeleteUser from "./DeleteUser.tsx";
import { useAuthentication } from "../../contexts/authentication/useAuthentication.tsx";

const PAGE_SIZE = 9;

const ROLE_OPTIONS = [
  { value: "ALL", label: "Todos os papéis" },
  { value: "ADMIN", label: "Administrador" },
  { value: "TRAINER", label: "Instrutor" },
  { value: "PARTICIPANT", label: "Participante" },
  { value: "CONSULTANT", label: "Consultor" },
] as const;

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  TRAINER: "bg-blue-50 text-blue-700",
  PARTICIPANT: "bg-green-50 text-green-700",
  CONSULTANT: "bg-orange-50 text-orange-700",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TRAINER: "Instrutor",
  PARTICIPANT: "Participante",
  CONSULTANT: "Consultor",
};

function getRoleIcon(role: string) {
  switch (role) {
    case "ADMIN":
      return ShieldCheck;
    case "TRAINER":
      return BriefcaseBusiness;
    case "CONSULTANT":
      return GraduationCap;
    default:
      return UserRound;
  }
}

export default function UsersList() {
  const navigate = useNavigate();

  const { user: authenticatedUser } = useAuthentication();
  const { users, meta, isLoading, error, fetchUsers } = useUsers();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);

  // Fetch users whenever pagination, search or role changes.
  useEffect(() => {
    fetchUsers({
      page,
      limit: PAGE_SIZE,
      search,
      ...(role !== "ALL"
        ? { role: role as "ADMIN" | "TRAINER" | "PARTICIPANT" | "CONSULTANT" }
        : {}),
    }).catch(() => {
      // Error is already handled by the context.
    });
  }, [fetchUsers, page, search, role]);

  const handleRetry = () => {
    fetchUsers({
      page,
      limit: PAGE_SIZE,
      search,
      ...(role !== "ALL"
        ? { role: role as "ADMIN" | "TRAINER" | "PARTICIPANT" | "CONSULTANT" }
        : {}),
    }).catch(() => {});
  };

  return (
    <div className="space-y-5">
      {/* Search, filter and results count */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <DataSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Pesquisar usuários..."
          />

          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[190px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>

            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          {meta?.total ?? 0}{" "}
          {(meta?.total ?? 0) === 1
            ? "usuário encontrado"
            : "usuários encontrados"}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>

              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>

          <Button variant="outline" className="mt-3" onClick={handleRetry}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
            <UsersRound className="size-8 text-[#514949]" />
          </div>

          <h3 className="font-semibold text-[#514949]">
            {search.trim() || role !== "ALL"
              ? "Nenhum usuário encontrado"
              : "Nenhum usuário cadastrado"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search.trim() || role !== "ALL"
              ? "Tente alterar os filtros ou utilizar outro termo de pesquisa."
              : "Os usuários cadastrados na plataforma aparecerão aqui."}
          </p>
        </div>
      )}

      {/* User cards */}
      {!isLoading && !error && users.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const RoleIcon = getRoleIcon(user.role);

            const isSelf = user.id === authenticatedUser?.id;
            const isAdmin = user.role === "ADMIN";

            const canManage = !isSelf && !isAdmin;

            return (
              <div
                key={user.id}
                className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#514949]/10">
                      <UsersRound className="size-5 text-[#514949]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#514949]">
                        {user.name}
                      </h3>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      ROLE_STYLES[user.role] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </div>

                {/* User information */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RoleIcon className="size-4 shrink-0" />

                    <span>{ROLE_LABELS[user.role] ?? user.role}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4 shrink-0" />

                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <GraduationCap className="size-4 shrink-0" />

                    <span className="truncate">
                      {user.university
                        ? `${user.university.acronym} - ${user.university.name}`
                        : "Sem universidade vinculada"}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <Building2 className="size-4 shrink-0" />

                    <span className="truncate">
                      {user.unity
                        ? user.unity.acronym
                          ? `${user.unity.acronym} - ${user.unity.name}`
                          : user.unity.name
                        : "Sem unidade vinculada"}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <Briefcase className="size-4 shrink-0" />

                    <span className="truncate">
                      {user.occupation
                        ? user.occupation.name
                        : "Sem cargo vinculado"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-end gap-1 border-t pt-3 mt-4">
                  {!isSelf && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Visualizar usuário"
                      onClick={() => navigate(`/dashboard/users/${user.id}`)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  )}

                  {canManage && <DeleteUser id={user.id} name={user.name} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && meta && meta.totalPages > 1 && (
        <DataPagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.limit}
          onPageChange={setPage}
          showSummary
        />
      )}
    </div>
  );
}
