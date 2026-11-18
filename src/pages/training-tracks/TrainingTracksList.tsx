import { useEffect, useState } from "react";
import { GraduationCap, Clock, BookOpen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFormations } from "../../contexts/formations/useFormations";

import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { DataPagination } from "../../components/shared/DataPagination";

import UpdateTrainingTrack from "./UpdateTrainingTrack";
import DeleteTrainingTrack from "./DeleteTrainingTrack";
import { DataSearch } from "../../components/shared/DataSearch.tsx";

const PAGE_SIZE = 9;

export default function TrainingTracksList() {
  const navigate = useNavigate();

  const { formations, meta, isLoading, error, fetchFormations } =
    useFormations();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch formations whenever pagination or search changes.
  useEffect(() => {
    fetchFormations({
      page,
      limit: PAGE_SIZE,
      search,
    }).catch(() => {
      // Error is already handled by the context.
    });
  }, [fetchFormations, page, search]);

  const handleRetry = () => {
    fetchFormations({
      page,
      limit: PAGE_SIZE,
      search,
    }).catch(() => {});
  };

  return (
    <div className="space-y-5">
      {/* Search and results count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DataSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Pesquisar formações..."
        />

        <p className="text-sm text-muted-foreground">
          {meta?.total ?? 0}{" "}
          {(meta?.total ?? 0) === 1
            ? "formação cadastrada"
            : "formações cadastradas"}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
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
      {!isLoading && !error && formations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
            <GraduationCap className="size-8 text-[#514949]" />
          </div>

          <h3 className="font-semibold text-[#514949]">
            {search.trim()
              ? "Nenhuma formação encontrada"
              : "Nenhuma formação cadastrada"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search.trim()
              ? "Tente pesquisar utilizando outro termo."
              : "Comece cadastrando uma formação para organizar os conteúdos e as atividades."}
          </p>
        </div>
      )}

      {/* Formation cards */}
      {!isLoading && !error && formations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {formations.map((formation) => (
            <div
              key={formation.id}
              className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-[#514949]/10 p-2.5">
                  <GraduationCap className="size-6 text-[#514949]" />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Formação
                </span>
              </div>

              <h3 className="line-clamp-2 font-semibold text-[#514949]">
                {formation.name}
              </h3>

              <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-relaxed text-muted-foreground">
                {formation.description}
              </p>

              <div className="mt-4 flex items-center gap-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{formation.workloadHours} horas</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="size-4" />
                  <span>{formation._count.modules} módulos</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-end gap-1 border-t pt-3">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Visualizar formação"
                  onClick={() =>
                    navigate(`/dashboard/training-tracks/${formation.id}`)
                  }
                >
                  <Eye className="size-4" />
                </Button>

                <UpdateTrainingTrack
                  formation={{
                    id: formation.id,
                    name: formation.name,
                    description: formation.description,
                    workloadHours: formation.workloadHours,
                  }}
                />

                <DeleteTrainingTrack id={formation.id} name={formation.name} />
              </div>
            </div>
          ))}
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
