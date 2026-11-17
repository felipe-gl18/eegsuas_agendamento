import { useCallback, useState, type ReactNode } from "react";

import { FormationsContext } from "./FormationsContext";

import type {
  TrainingTrack,
  TrainingModule,
  CreateTrainingTrackDTO,
  UpdateTrainingTrackDTO,
  CreateTrainingModuleDTO,
  UpdateTrainingModuleDTO,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

// Wrapper para comunicação com a API.
async function request<T = void>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
    );
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    const message = Array.isArray(data?.message)
      ? data.message.join(" ")
      : data?.message;

    throw new Error(message ?? "Ocorreu um erro. Tente novamente.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

interface FormationsProviderProps {
  children: ReactNode;
}

export function FormationsProvider({ children }: FormationsProviderProps) {
  const [formations, setFormations] = useState<TrainingTrack[]>([]);
  const [currentFormation, setCurrentFormation] =
    useState<TrainingTrack | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar todas as formações
  const fetchFormations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await request<TrainingTrack[]>("/training-tracks");

      setFormations(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as formações.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar formação por ID
  const fetchFormationById = useCallback(
    async (id: string): Promise<TrainingTrack> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await request<TrainingTrack>(`/training-tracks/${id}`);

        setCurrentFormation(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível carregar a formação.";

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Criar formação
  const createFormation = useCallback(
    async (data: CreateTrainingTrackDTO): Promise<TrainingTrack> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const newFormation = await request<TrainingTrack>("/training-tracks", {
          method: "POST",
          body: data,
        });

        setFormations((prev) => [...prev, newFormation]);

        return newFormation;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível criar a formação.";

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // Atualizar formação
  const updateFormation = useCallback(
    async (
      id: string,
      data: UpdateTrainingTrackDTO,
    ): Promise<TrainingTrack> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const updatedFormation = await request<TrainingTrack>(
          `/training-tracks/${id}`,
          {
            method: "PATCH",
            body: data,
          },
        );

        setFormations((prev) =>
          prev.map((formation) =>
            formation.id === id ? updatedFormation : formation,
          ),
        );

        setCurrentFormation((prev) =>
          prev?.id === id ? updatedFormation : prev,
        );

        return updatedFormation;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível atualizar a formação.";

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // Excluir formação
  const deleteFormation = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await request(`/training-tracks/${id}`, {
        method: "DELETE",
      });

      setFormations((prev) => prev.filter((formation) => formation.id !== id));

      setCurrentFormation((prev) => (prev?.id === id ? null : prev));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a formação.";

      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const createModule = useCallback(
  async (
    formationId: string,
    data: CreateTrainingModuleDTO,
  ): Promise<TrainingModule> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newModule = await request<TrainingModule>(
        `/training-tracks/${formationId}/modules`,
        {
          method: "POST",
          body: data,
        },
      );

      setFormations((prev) =>
        prev.map((formation) =>
          formation.id === formationId
            ? {
                ...formation,
                modules: [...(formation.modules ?? []), newModule],
              }
            : formation,
        ),
      );

      setCurrentFormation((prev) =>
        prev?.id === formationId
          ? {
              ...prev,
              modules: [...(prev.modules ?? []), newModule],
            }
          : prev,
      );

      return newModule;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível criar o módulo.";

      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  },
    [],
  );

  const updateModule = useCallback(
    async (
      formationId: string,
      moduleId: string,
      data: UpdateTrainingModuleDTO,
    ): Promise<TrainingModule> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const updatedModule = await request<TrainingModule>(
          `/training-modules/${moduleId}`,
          {
            method: "PATCH",
            body: data,
          },
        );

        setFormations((prev) =>
          prev.map((formation) =>
            formation.id === formationId
              ? {
                  ...formation,
                  modules: formation.modules?.map((module) =>
                    module.id === moduleId ? updatedModule : module,
                  ),
                }
              : formation,
          ),
        );

        setCurrentFormation((prev) =>
          prev?.id === formationId
            ? {
                ...prev,
                modules: prev.modules?.map((module) =>
                  module.id === moduleId ? updatedModule : module,
                ),
              }
            : prev,
        );

        return updatedModule;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível atualizar o módulo.";

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteModule = useCallback(
    async (
      formationId: string,
      moduleId: string,
    ): Promise<void> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await request(`/training-modules/${moduleId}`, {
          method: "DELETE",
        });

        setFormations((prev) =>
          prev.map((formation) =>
            formation.id === formationId
              ? {
                  ...formation,
                  modules: formation.modules?.filter(
                    (module) => module.id !== moduleId,
                  ),
                }
              : formation,
          ),
        );

        setCurrentFormation((prev) =>
          prev?.id === formationId
            ? {
                ...prev,
                modules: prev.modules?.filter(
                  (module) => module.id !== moduleId,
                ),
              }
            : prev,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível excluir o módulo.";

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return (
    <FormationsContext.Provider
  value={{
    formations,
    currentFormation,
    isLoading,
    isSubmitting,
    error,

    fetchFormations,
    fetchFormationById,

    createFormation,
    updateFormation,
    deleteFormation,

    createModule,
    updateModule,
    deleteModule,

    setCurrentFormation,
    clearError,
  }}
>
  {children}
</FormationsContext.Provider>
  );
}
