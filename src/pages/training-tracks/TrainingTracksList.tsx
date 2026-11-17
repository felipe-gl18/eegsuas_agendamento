import { useEffect, useMemo, useState } from "react";
import {
  Search,
  GraduationCap,
  Clock,
  BookOpen,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { useFormations } from "../../contexts/formations/useFormations";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";

import { useNavigate } from "react-router-dom";

export default function TrainingTracksList() {
  const navigate = useNavigate();
  const { formations, isLoading, error, fetchFormations } = useFormations();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFormations().catch(() => {
      // O erro já é tratado pelo contexto.
    });
  }, [fetchFormations]);

  const filteredFormations = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return formations;

    return formations.filter(
      (formation) =>
        formation.name.toLowerCase().includes(term) ||
        formation.description.toLowerCase().includes(term),
    );
  }, [formations, search]);

  return (
    <div className="space-y-5">
      {/* Barra de pesquisa e quantidade */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Pesquisar formação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {formations.length}{" "}
          {formations.length === 1
            ? "formação cadastrada"
            : "formações cadastradas"}
        </p>
      </div>

      {/* Carregamento */}
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

      {/* Erro */}
      {!isLoading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>

          <Button
            variant="outline"
            className="mt-3"
            onClick={() => fetchFormations().catch(() => {})}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Lista vazia */}
      {!isLoading && !error && formations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
            <GraduationCap className="size-8 text-[#514949]" />
          </div>

          <h3 className="font-semibold text-[#514949]">
            Nenhuma formação cadastrada
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Comece cadastrando uma formação para organizar os conteúdos e as
            atividades.
          </p>
        </div>
      )}

      {/* Nenhum resultado */}
      {!isLoading &&
        !error &&
        formations.length > 0 &&
        filteredFormations.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground" />

            <p className="font-medium text-[#514949]">
              Nenhuma formação encontrada
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tente pesquisar utilizando outro termo.
            </p>
          </div>
        )}

      {/* Cards */}
      {!isLoading && !error && filteredFormations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredFormations.map((formation) => (
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
                  <span>{formation.modules?.length ?? 0} módulos</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-end gap-1 border-t pt-3">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Visualizar formação"
                  onClick={() => navigate(`/dashboard/training-tracks/${formation.id}`)}
                >
                  <Eye className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="Editar formação"
                  disabled
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="Excluir formação"
                  disabled
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
