import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  format,
  isToday,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  CalendarDays,
} from "lucide-react";

import { useSchedule } from "../../contexts/schedule/useSchedule";
import { Button } from "../../components/ui/button";

import { useFormations } from "../../contexts/formations/useFormations";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { TrainingModule } from "../../contexts/formations/types";
import DeleteTrainingSession from "./DeleteTrainingSession";

const START_HOUR = 7;
const END_HOUR = 21;
const SLOT_HEIGHT = 56;

const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2;
const GRID_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT;

type ModalState =
  | {
      type: "create";
      startDate: Date;
      endDate: Date;
    }
  | {
      type: "details";
      sessionId: string;
    }
  | null;

function formatLocalISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

function getSessionPosition(start: Date, end: Date) {
  const startMinutes = (getHours(start) - START_HOUR) * 60 + getMinutes(start);

  const endMinutes = (getHours(end) - START_HOUR) * 60 + getMinutes(end);

  const top = (startMinutes / 30) * SLOT_HEIGHT;
  const height = ((endMinutes - startMinutes) / 30) * SLOT_HEIGHT;

  return {
    top: Math.max(0, top),
    height: Math.max(28, Math.min(height, GRID_HEIGHT - top)),
  };
}

export default function Schedule() {
  const { sessions, isSubmitting, fetchAllSessions, createSession } =
    useSchedule();

  const { formations, fetchFormations, fetchFormationById } = useFormations();

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [modal, setModal] = useState<ModalState>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [availableModules, setAvailableModules] = useState<TrainingModule[]>(
    [],
  );
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  const weekStart = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: 1 }),
    [currentWeek],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const hours = useMemo(
    () =>
      Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i),
    [],
  );

  // Formações (uma vez)
  useEffect(() => {
    fetchFormations({ page: 1, limit: 100 }).catch(() => {});
  }, [fetchFormations]);

  // Sessões da semana visível: roda no 1º render e a cada troca de semana
  useEffect(() => {
    fetchAllSessions({
      from: formatLocalISO(weekStart),
      to: formatLocalISO(addDays(weekStart, 5)), // sábado 00:00 = fim da sexta
    }).catch((err) => {
      console.error("Erro ao carregar agendamentos:", err);
    });
  }, [weekStart, fetchAllSessions]);

  // Navegação entre semanas
  const previousWeek = () => setCurrentWeek((prev) => subWeeks(prev, 1));
  const nextWeek = () => setCurrentWeek((prev) => addWeeks(prev, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const handleFormationChange = async (formationId: string) => {
    setSelectedFormationId(formationId);
    setSelectedModuleId("");
    setAvailableModules([]);
    setActionError(null);

    if (!formationId) return;

    setIsLoadingModules(true);

    try {
      const formation = await fetchFormationById(formationId);
      setAvailableModules(formation.modules);
    } catch {
      setActionError("Não foi possível carregar os módulos.");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleSlotClick = (day: Date, hour: number, minute: number) => {
    const startDate = setMinutes(setHours(day, hour), minute);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    setSelectedFormationId("");
    setSelectedModuleId("");
    setAvailableModules([]);
    setActionError(null);

    setModal({ type: "create", startDate, endDate });
  };

  const handleCreateSession = async () => {
    if (!selectedModuleId || !modal || modal.type !== "create") return;

    setActionError(null);

    try {
      await createSession(selectedModuleId, {
        startDate: formatLocalISO(modal.startDate),
        endDate: formatLocalISO(modal.endDate),
      });

      setModal(null);
      setSelectedFormationId("");
      setSelectedModuleId("");
      setAvailableModules([]);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar o agendamento.",
      );
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Agenda
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus horários e sessões de treinamento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousWeek}
              className="h-9 w-9 rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="h-5 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              onClick={nextWeek}
              className="h-9 w-9 rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />

        <span className="text-sm font-medium capitalize text-foreground">
          {format(weekStart, "MMMM yyyy", { locale: ptBR })}
        </span>

        <span className="text-xs text-muted-foreground">
          {format(weekStart, "dd")} –{" "}
          {format(addDays(weekStart, 4), "dd 'de' MMMM", {
            locale: ptBR,
          })}
        </span>
      </div>

      {/* Calendário */}
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Cabeçalho dos dias */}
            <div className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))] border-b border-border">
              <div className="border-r border-border" />

              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="flex h-[76px] flex-col items-center justify-center gap-1 border-r border-border last:border-r-0"
                >
                  {" "}
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {format(day, "EEE", { locale: ptBR }).replace(".", "")}
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday(day)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {format(day, "dd")}
                  </span>
                </div>
              ))}
            </div>
            {/* Grade de horários */}
            <div className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))]">
              {/* Coluna das horas */}
              <div className="relative border-r border-border">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="relative"
                    style={{ height: SLOT_HEIGHT * 2 }}
                  >
                    <span className="absolute -top-[9px] right-3 text-[11px] font-medium tabular-nums text-muted-foreground">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Colunas dos dias */}
              {weekDays.map((day) => {
                const daySessions = sessions.filter((session) => {
                  const start = new Date(session.startDate);
                  const end = new Date(session.endDate);

                  const dayStart = new Date(day);
                  dayStart.setHours(0, 0, 0, 0);

                  const dayEnd = new Date(day);
                  dayEnd.setHours(23, 59, 59, 999);

                  return start <= dayEnd && end > dayStart;
                });

                return (
                  <div
                    key={day.toISOString()}
                    className="relative border-r border-border last:border-r-0"
                    style={{ height: GRID_HEIGHT }}
                  >
                    {/* Intervalos de 30 minutos */}
                    {Array.from({ length: TOTAL_SLOTS }, (_, index) => {
                      const hour = START_HOUR + Math.floor(index / 2);

                      const minute = index % 2 === 0 ? 0 : 30;

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSlotClick(day, hour, minute)}
                          className={`group relative block w-full border-b border-border/50 transition-colors hover:bg-muted/60 ${
                            minute === 30
                              ? "border-dashed border-border/60"
                              : ""
                          }`}
                          style={{ height: SLOT_HEIGHT }}
                        >
                          {minute === 0 && (
                            <Plus className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
                          )}
                        </button>
                      );
                    })}
                    {/* Sessões agendadas */}
                    {daySessions.map((session) => {
                      const start = new Date(session.startDate);
                      const end = new Date(session.endDate);

                      const dayStart = new Date(day);
                      dayStart.setHours(0, 0, 0, 0);

                      const visibleStart = start < dayStart ? dayStart : start;
                      const dayEnd = new Date(day);
                      dayEnd.setHours(24, 0, 0, 0);

                      const visibleEnd = end > dayEnd ? dayEnd : end;

                      const position = getSessionPosition(
                        visibleStart,
                        visibleEnd,
                      );

                      const isShort = position.height < 50;

                      const moduleName =
                        session.trainingModule?.name ?? "Sessão";

                      return (
                        <div
                          key={session.id}
                          className="group absolute left-1 right-1 z-10"
                          style={{ top: position.top, height: position.height }}
                        >
                          {/* Botão que abre os detalhes */}
                          <button
                            type="button"
                            onClick={() => handleSessionClick(session.id)}
                            className="h-full w-full overflow-hidden rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-left transition-all hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm dark:border-blue-900 dark:bg-blue-950/60 dark:hover:bg-blue-900/60"
                          >
                            <div className="flex h-full flex-col overflow-hidden pr-6">
                              <span className="truncate text-[11px] font-semibold text-blue-800 dark:text-blue-200">
                                {moduleName}
                              </span>
                              {!isShort && (
                                <span className="mt-0.5 text-[10px] tabular-nums text-blue-700/80 dark:text-blue-300/80">
                                  {formatTime(start)} – {formatTime(end)}
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Excluir: irmão do botão acima, só aparece no hover/foco */}
                          <div className="absolute right-1 top-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                            <DeleteTrainingSession
                              id={session.id}
                              name={moduleName}
                              period={`${formatTime(start)} às ${formatTime(end)}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de criação de agendamento */}
      <Dialog
        open={modal?.type === "create"}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo agendamento</DialogTitle>
            <DialogDescription>
              Selecione a formação e o módulo para criar uma sessão.
            </DialogDescription>
          </DialogHeader>

          {modal?.type === "create" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCreateSession();
              }}
              className="space-y-5"
            >
              {/* Formação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Formação</label>

                <Select
                  value={selectedFormationId}
                  onValueChange={handleFormationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma formação" />
                  </SelectTrigger>

                  <SelectContent>
                    {formations.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id}>
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Módulo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Módulo</label>

                <Select
                  value={selectedModuleId}
                  onValueChange={setSelectedModuleId}
                  disabled={!selectedFormationId || isLoadingModules}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingModules
                          ? "Carregando módulos..."
                          : "Selecione um módulo"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {availableModules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Horário */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Horário selecionado</span>
                </div>

                <p className="mt-2 text-sm capitalize text-muted-foreground">
                  {format(modal.startDate, "EEEE, dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </p>

                <p className="text-sm font-semibold">
                  {formatTime(modal.startDate)} – {formatTime(modal.endDate)}
                </p>
              </div>

              {/* Erro */}
              {actionError && (
                <p className="text-sm text-destructive">{actionError}</p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModal(null)}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={!selectedModuleId || isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Criar agendamento"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
