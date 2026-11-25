import { useEffect, useMemo, useState } from "react";
import {
  AwardIcon,
  CalendarIcon,
  Clock,
  Eye,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { DataPagination } from "../../components/shared/DataPagination";
import { DataSearch } from "../../components/shared/DataSearch.tsx";
import { useUsers } from "../../contexts/users/useUsers";

const PAGE_SIZE = 6;

interface UserEnrollmentsProps {
  userId: string;
}

// Remove acentos e ignora maiúsculas/minúsculas ("formacao" encontra "Formação").
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function UserEnrollments({ userId }: UserEnrollmentsProps) {
  const navigate = useNavigate();

  const {
    enrollments,
    isLoadingEnrollments,
    enrollmentsError,
    fetchUserEnrollments,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUserEnrollments(userId).catch(() => {
      // O erro já é tratado pelo contexto.
    });
  }, [userId, fetchUserEnrollments]);

  const handleRetry = () => {
    fetchUserEnrollments(userId).catch(() => {});
  };

  // Busca e paginação no navegador: a rota devolve a lista completa.
  const filtered = useMemo(() => {
    const term = normalize(search.trim());

    if (!term) return enrollments;

    return enrollments.filter(
      ({ trainingTrack }) =>
        normalize(trainingTrack.name).includes(term) ||
        normalize(trainingTrack.description).includes(term),
    );
  }, [enrollments, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasError = !isLoadingEnrollments && enrollmentsError;
  const isEmpty =
    !isLoadingEnrollments && !enrollmentsError && filtered.length === 0;

  return (
    <div className="space-y-5">
      {/* Busca e contagem */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DataSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar formações do usuário..."
        />

        <p className="text-sm text-muted-foreground">
          {enrollments.length}{" "}
          {enrollments.length === 1 ? "formação cursada" : "formações cursadas"}
        </p>
      </div>

      {/* Loading */}
      {isLoadingEnrollments && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Erro */}
      {hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{enrollmentsError}</p>

          <Button variant="outline" className="mt-3" onClick={handleRetry}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Vazio */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
            <GraduationCap className="size-8 text-[#514949]" />
          </div>

          <h3 className="font-semibold text-[#514949]">
            {search.trim()
              ? "Nenhuma formação encontrada"
              : "Nenhuma formação cursada"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search.trim()
              ? "Tente pesquisar utilizando outro termo."
              : "Este usuário ainda não está matriculado em nenhuma formação."}
          </p>
        </div>
      )}

      {/* Cards */}
      {!isLoadingEnrollments && !enrollmentsError && visible.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((enrollment) => {
            const { trainingTrack, certificate } = enrollment;

            return (
              <div
                key={enrollment.id}
                className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-[#514949]/10 p-2.5">
                    <GraduationCap className="size-6 text-[#514949]" />
                  </div>

                  {certificate ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      <AwardIcon className="size-3" />
                      Certificado emitido
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      Sem certificado
                    </span>
                  )}
                </div>

                <h3 className="line-clamp-2 font-semibold text-[#514949]">
                  {trainingTrack.name}
                </h3>

                <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-relaxed text-muted-foreground">
                  {trainingTrack.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{trainingTrack.workloadHours} horas</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="size-4" />
                    <span>
                      Matrícula em{" "}
                      {new Date(enrollment.createdAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-end gap-1 border-t pt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Visualizar formação"
                    onClick={() =>
                      navigate(`/dashboard/training-tracks/${trainingTrack.id}`)
                    }
                  >
                    <Eye className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {!isLoadingEnrollments && !enrollmentsError && totalPages > 1 && (
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          showSummary
        />
      )}
    </div>
  );
}
