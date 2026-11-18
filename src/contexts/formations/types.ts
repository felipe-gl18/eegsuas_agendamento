/* -------------------------------------------------------------------------- */
/*  Paginação                                                                  */
/* -------------------------------------------------------------------------- */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Formato das listas paginadas devolvidas pela API: { data, meta }. */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Parâmetros aceitos pelas listas paginadas (?page=&limit=&search=). */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* -------------------------------------------------------------------------- */
/*  Entidades                                                                  */
/* -------------------------------------------------------------------------- */

export interface TrainingSession {
  id: string;
  trainingModuleId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  trainingTrackId: string;
  name: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  sessions?: TrainingSession[];
}

/** Campos básicos da formação (o que create e update devolvem). */
export interface TrainingTrack {
  id: string;
  name: string;
  description: string;
  workloadHours: number;
  createdAt: string;
  updatedAt: string;
}

/** Item da lista (GET /training-tracks): traz só a contagem de módulos. */
export interface TrainingTrackListItem extends TrainingTrack {
  _count: { modules: number };
}

/** Detalhe (GET /training-tracks/:id): traz os módulos, já em ordem. */
export interface TrainingTrackDetails extends TrainingTrack {
  modules: TrainingModule[];
}

/* -------------------------------------------------------------------------- */
/*  DTOs                                                                       */
/* -------------------------------------------------------------------------- */

export interface CreateTrainingTrackDTO {
  name: string;
  description: string;
  workloadHours: number;
}

export type UpdateTrainingTrackDTO = Partial<CreateTrainingTrackDTO>;

export interface CreateTrainingModuleDTO {
  name: string;
  description?: string | null;
  /** Opcional: sem ela, o módulo vai para o final. Com ela, entra nessa posição. */
  order?: number;
}

export type UpdateTrainingModuleDTO = Partial<CreateTrainingModuleDTO>;

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                   */
/* -------------------------------------------------------------------------- */

export interface FetchFormationOptions {
  /**
   * Recarrega os dados sem ligar o `isLoading` (a tela não pisca).
   * Útil depois de criar, editar ou excluir um módulo.
   */
  silent?: boolean;
}

export interface FormationsContextData {
  // Estado
  formations: TrainingTrackListItem[];
  meta: PaginationMeta | null;
  currentFormation: TrainingTrackDetails | null;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Formações
  fetchFormations: (params?: PaginationParams) => Promise<void>;

  fetchFormationById: (
    id: string,
    options?: FetchFormationOptions,
  ) => Promise<TrainingTrackDetails>;

  createFormation: (data: CreateTrainingTrackDTO) => Promise<TrainingTrack>;

  updateFormation: (
    id: string,
    data: UpdateTrainingTrackDTO,
  ) => Promise<TrainingTrack>;

  deleteFormation: (id: string) => Promise<void>;

  // Módulos (as rotas da API ficam abaixo da formação, por isso precisam do formationId)
  createModule: (
    formationId: string,
    data: CreateTrainingModuleDTO,
  ) => Promise<TrainingModule>;

  updateModule: (
    formationId: string,
    moduleId: string,
    data: UpdateTrainingModuleDTO,
  ) => Promise<TrainingModule>;

  deleteModule: (formationId: string, moduleId: string) => Promise<void>;

  // Utilitários
  setCurrentFormation: (formation: TrainingTrackDetails | null) => void;

  clearError: () => void;
}
