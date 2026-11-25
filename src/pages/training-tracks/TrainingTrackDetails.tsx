import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, GraduationCap } from "lucide-react";

import { useFormations } from "../../contexts/formations/useFormations";

import AddTrainingModule from "./AddTrainingModule";

import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import UpdateTrainingModule from "./UpdateTrainingModule";
import DeleteTrainingModule from "./DeleteTrainingModule";
import EnrolledStudents from "./EnrolledStudents";

export default function TrainingTrackDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentFormation, fetchFormationById, isLoading, error } =
    useFormations();

  useEffect(() => {
    if (!id) return;

    fetchFormationById(id).catch(() => {
      // O erro já é tratado pelo contexto.
    });
  }, [id, fetchFormationById]);

  // Carregamento
  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  // Erro ou formação inexistente
  if (error || !currentFormation || currentFormation.id !== id) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
        <GraduationCap className="mb-4 size-10 text-muted-foreground" />

        <h2 className="font-semibold text-[#514949]">
          Formação não encontrada
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error ?? "Não foi possível encontrar esta formação."}
        </p>

        <Button
          variant="outline"
          className="mt-5"
          onClick={() => navigate("/formations")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar para formações
        </Button>
      </div>
    );
  }

  const modules = [...(currentFormation.modules ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const nextOrder =
    modules.reduce((max, module) => Math.max(max, module.order), 0) + 1;

  return (
    <div className="space-y-7">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/training-tracks")}
          title="Voltar para formações"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-[#514949]">
            {currentFormation.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as informações e os módulos desta formação.
          </p>
        </div>
      </div>

      {/* Informações da formação */}
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#514949]/10 p-3">
            <GraduationCap className="size-7 text-[#514949]" />
          </div>

          <div>
            <h2 className="font-semibold text-[#514949]">Informações gerais</h2>

            <p className="text-sm text-muted-foreground">
              Dados principais da formação.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-medium text-[#514949]">Descrição</h3>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {currentFormation.description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{currentFormation.workloadHours} horas</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="size-4" />
            <span>
              {modules.length} {modules.length === 1 ? "módulo" : "módulos"}
            </span>
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#514949]">
              Módulos da formação
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Organize os conteúdos e a sequência de aprendizagem.
            </p>
          </div>

          <AddTrainingModule
            formationId={currentFormation.id}
            nextOrder={nextOrder}
          />
        </div>

        {modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center">
            <div className="mb-4 rounded-full bg-[#514949]/10 p-4">
              <BookOpen className="size-8 text-[#514949]" />
            </div>

            <h3 className="font-semibold text-[#514949]">
              Nenhum módulo cadastrado
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Esta formação ainda não possui módulos. Comece adicionando o
              primeiro módulo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#514949]/10 font-bold text-[#514949]">
                  {module.order}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#514949]">
                    {module.name}
                  </h3>

                  {module.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      Sem descrição.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UpdateTrainingModule
                    formationId={currentFormation.id}
                    module={module}
                  />
                  <DeleteTrainingModule
                    formationId={currentFormation.id}
                    module={module}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#514949]">Participantes</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Todos os participantes da formação
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <EnrolledStudents trackId={id} />
        </div>
      </section>
    </div>
  );
}
