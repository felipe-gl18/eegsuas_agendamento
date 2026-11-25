import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  BookOpen,
  AlertCircle,
  Building2,
  Briefcase,
} from "lucide-react";

import { useUsers } from "../../contexts/users/useUsers";

import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import UserEnrollments from "./UserEnrollments";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TRAINER: "Instrutor",
  PARTICIPANT: "Participante",
  CONSULTANT: "Consultor",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  TRAINER: "bg-blue-50 text-blue-700",
  PARTICIPANT: "bg-green-50 text-green-700",
  CONSULTANT: "bg-orange-50 text-orange-700",
};

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentUser,
    enrollments,
    isLoading,
    error,
    fetchUserById,
    clearError,
  } = useUsers();

  useEffect(() => {
    if (id) {
      fetchUserById(id).catch(() => {});
    }

    return () => {
      clearError();
    };
  }, [id, fetchUserById, clearError]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  // ------------------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </div>

        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  // ------------------------------------------------------------------------
  // Error
  // ------------------------------------------------------------------------

  if (error || !currentUser) {
    return (
      <div className="space-y-5">
        <Button
          variant="ghost"
          className="gap-2 text-[#514949]"
          onClick={() => navigate("/dashboard/users")}
        >
          <ArrowLeft className="size-4" />
          Voltar para usuários
        </Button>

        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
          <AlertCircle className="mb-4 size-10 text-destructive" />

          <h3 className="font-semibold text-[#514949]">
            Não foi possível carregar o usuário
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "Usuário não encontrado."}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              if (id) fetchUserById(id).catch(() => {});
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const user = currentUser;

  // ------------------------------------------------------------------------
  // Details
  // ------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-2 -ml-3 gap-2 text-[#514949]"
            onClick={() => navigate("/dashboard/users")}
          >
            <ArrowLeft className="size-4" />
            Voltar para usuários
          </Button>

          <h1 className="text-2xl font-bold tracking-tight text-[#514949]">
            Detalhes do usuário
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Consulte as informações e atividades do usuário na plataforma.
          </p>
        </div>
      </div>

      {/* User Profile */}
      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#514949]/10">
            <UserRound className="size-8 text-[#514949]" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-[#514949]">{user.name}</h2>

            <p className="mt-1 break-all text-sm text-muted-foreground">
              {user.email}
            </p>

            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  ROLE_STYLES[user.role] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="pt-6">
          <h3 className="mb-5 font-semibold text-[#514949]">
            Informações do perfil
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <UserRound className="size-4 text-[#514949]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Nome completo</p>
                <p className="mt-1 font-medium text-[#514949]">{user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <Mail className="size-4 text-[#514949]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="mt-1 break-all font-medium text-[#514949]">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <ShieldCheck className="size-4 text-[#514949]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Papel na plataforma
                </p>
                <p className="mt-1 font-medium text-[#514949]">
                  {ROLE_LABELS[user.role] ?? user.role}
                </p>
              </div>
            </div>

            {/* University */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <GraduationCap className="size-4 text-[#514949]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Universidade</p>

                {user.university ? (
                  <>
                    <p className="mt-1 font-medium text-[#514949]">
                      {user.university.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user.university.acronym}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 font-medium text-muted-foreground">
                    Não vinculada
                  </p>
                )}
              </div>
            </div>

            {/* Unity */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <Building2 className="size-4 text-[#514949]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Unidade</p>

                <p className="mt-1 font-medium text-[#514949]">
                  {user.unity.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {user.unity.acronym}
                </p>
              </div>
            </div>

            {/* Occupation */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <Briefcase className="size-4 text-[#514949]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Ocupação</p>

                <p className="mt-1 font-medium text-[#514949]">
                  {user.occupation.name}
                </p>
              </div>
            </div>

            {/* Registration date */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#514949]/10 p-2">
                <CalendarDays className="size-4 text-[#514949]" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Data de cadastro
                </p>

                <p className="mt-1 font-medium text-[#514949]">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* University status */}
            {user.university && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#514949]/10 p-2">
                  <GraduationCap className="size-4 text-[#514949]" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Status da universidade
                  </p>

                  <p className="mt-1 font-medium text-[#514949]">
                    {
                      {
                        PENDING: "Pendente",
                        VERIFIED: "Verificada",
                        REJECTED: "Rejeitada",
                      }[user.university.status]
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Training Tracks */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#514949]">
            Formações do usuário
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Formações nas quais este usuário está participando ou já participou.
          </p>
        </div>

        {enrollments ? (
          <UserEnrollments userId={id!} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
            <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
              <BookOpen className="size-8 text-[#514949]" />
            </div>

            <h3 className="font-semibold text-[#514949]">
              Nenhuma formação vinculada
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              As formações em que este usuário participar serão exibidas aqui.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
