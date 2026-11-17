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

export interface TrainingTrack {
  id: string;
  name: string;
  description: string;
  workloadHours: number;
  createdAt: string;
  updatedAt: string;
  modules?: TrainingModule[];
}

export interface CreateTrainingTrackDTO {
  name: string;
  description: string;
  workloadHours: number;
}

export type UpdateTrainingTrackDTO = Partial<CreateTrainingTrackDTO>;

export interface CreateTrainingModuleDTO {
  name: string;
  description?: string;
  order: number;
}

export type UpdateTrainingModuleDTO =
  Partial<CreateTrainingModuleDTO>;

export interface FormationsContextData {
  formations: TrainingTrack[];
  currentFormation: TrainingTrack | null;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchFormations: () => Promise<void>;

  fetchFormationById: (id: string) => Promise<TrainingTrack>;

  createFormation: (data: CreateTrainingTrackDTO) => Promise<TrainingTrack>;

  updateFormation: (
    id: string,
    data: UpdateTrainingTrackDTO,
  ) => Promise<TrainingTrack>;

  deleteFormation: (id: string) => Promise<void>;

  // Módulos
  createModule: (
    formationId: string,
    data: CreateTrainingModuleDTO,
  ) => Promise<TrainingModule>;

  updateModule: (
    moduleId: string,
    data: UpdateTrainingModuleDTO,
  ) => Promise<TrainingModule>;

  deleteModule: (
    moduleId: string,
  ) => Promise<void>;

  setCurrentFormation: (formation: TrainingTrack | null) => void;

  clearError: () => void;
}
