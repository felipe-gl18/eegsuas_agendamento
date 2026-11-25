/* -------------------------------------------------------------------------- */
/*  Entidades                                                                  */
/* -------------------------------------------------------------------------- */

export interface TrainingModuleSummary {
  id: string;
  name: string;
}

export interface TrainingTrackSummary {
  id: string;
  name: string;
}

export interface TrainingSession {
  id: string;
  trainingModuleId: string;

  startDate: string;
  endDate: string;

  createdAt: string;
  updatedAt: string;

  trainingModule?: TrainingModuleSummary;
  trainingTrackId?: string | null;
  trainingTrack?: TrainingTrackSummary | null;
}

export type ScheduleSession = TrainingSession;

export type ScheduleSessionDetails = TrainingSession;

/* -------------------------------------------------------------------------- */
/*  DTOs                                                                       */
/* -------------------------------------------------------------------------- */

export interface CreateTrainingSessionDto {
  startDate: string;
  endDate: string;
}

export interface UpdateTrainingSessionDto {
  startDate?: string;
  endDate?: string;
}

/* -------------------------------------------------------------------------- */
/*  Parâmetros                                                                 */
/* -------------------------------------------------------------------------- */

export interface ScheduleDateRange {
  startDate: string;
  endDate: string;
}

// sessions
export interface SessionsRange {
  from: string; // mesmo formato de formatLocalISO
  to: string;
}

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                   */
/* -------------------------------------------------------------------------- */

export interface ScheduleContextData {
  // Estado
  sessions: ScheduleSession[];
  currentSession: ScheduleSessionDetails | null;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Sessões
  fetchSessions: (moduleId: string) => Promise<void>;
  fetchAllSessions: (range: SessionsRange) => Promise<void>;

  fetchSessionById: (id: string) => Promise<ScheduleSessionDetails>;

  createSession: (
    moduleId: string,
    dto: CreateTrainingSessionDto,
  ) => Promise<ScheduleSession>;

  updateSession: (
    id: string,
    dto: UpdateTrainingSessionDto,
  ) => Promise<ScheduleSession>;

  deleteSession: (id: string) => Promise<void>;

  // Utilitários
  setCurrentSession: (session: ScheduleSessionDetails | null) => void;

  clearError: () => void;
  clearSessions: () => void;
}
