import { useCallback, useState, type ReactNode } from "react";

import { FormationsContext } from "./FormationsContext";

import type {
  TrainingTrack,
  TrainingTrackListItem,
  TrainingTrackDetails,
  TrainingModule,
  Paginated,
  PaginationMeta,
  PaginationParams,
  FetchFormationOptions,
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

// --------------------------------------------------------------------------
// API Request
// --------------------------------------------------------------------------

async function request<T = void>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers:
        body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function buildQueryParams(params?: PaginationParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

function sortModules(modules: TrainingModule[]): TrainingModule[] {
  return [...modules].sort((a, b) => a.order - b.order);
}

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------

interface FormationsProviderProps {
  children: ReactNode;
}

export function FormationsProvider({ children }: FormationsProviderProps) {
  // State
  const [formations, setFormations] = useState<TrainingTrackListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [currentFormation, setCurrentFormation] =
    useState<TrainingTrackDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ------------------------------------------------------------------------
  // Formations
  // ------------------------------------------------------------------------

  // GET /training-tracks?page=&limit=&search=
  const fetchFormations = useCallback(
    async (params?: PaginationParams): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await request<Paginated<TrainingTrackListItem>>(
          `/training-tracks${buildQueryParams(params)}`,
        );

        setFormations(data.data);
        setMeta(data.meta);
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar as formações.",
        );

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // GET /training-tracks/:id
  const fetchFormationById = useCallback(
    async (
      id: string,
      options?: FetchFormationOptions,
    ): Promise<TrainingTrackDetails> => {
      if (!options?.silent) {
        setIsLoading(true);
      }

      setError(null);

      try {
        const data = await request<TrainingTrackDetails>(
          `/training-tracks/${id}`,
        );

        const sortedData: TrainingTrackDetails = {
          ...data,
          modules: sortModules(data.modules),
        };

        setCurrentFormation(sortedData);

        return sortedData;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar a formação.",
        );

        setError(message);
        throw err;
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // POST /training-tracks
  const createFormation = useCallback(
    async (data: CreateTrainingTrackDTO): Promise<TrainingTrack> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const newFormation = await request<TrainingTrack>("/training-tracks", {
          method: "POST",
          body: data,
        });

        // Refetch the current paginated list.
        await fetchFormations({
          page: meta?.page ?? 1,
          limit: meta?.limit ?? 9,
        });

        return newFormation;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível criar a formação.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchFormations, meta?.page, meta?.limit],
  );

  // PATCH /training-tracks/:id
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
            formation.id === id
              ? { ...formation, ...updatedFormation }
              : formation,
          ),
        );

        setCurrentFormation((prev) =>
          prev?.id === id ? { ...prev, ...updatedFormation } : prev,
        );

        return updatedFormation;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível atualizar a formação.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // DELETE /training-tracks/:id
  const deleteFormation = useCallback(
    async (id: string): Promise<void> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await request(`/training-tracks/${id}`, {
          method: "DELETE",
        });

        const currentPage = meta?.page ?? 1;
        const limit = meta?.limit ?? 9;
        const newTotal = Math.max(0, (meta?.total ?? 1) - 1);
        const newTotalPages = Math.ceil(newTotal / limit);

        // If the current page no longer exists, go to the previous page.
        const targetPage = Math.min(currentPage, Math.max(1, newTotalPages));

        setCurrentFormation((prev) => (prev?.id === id ? null : prev));

        await fetchFormations({
          page: targetPage,
          limit,
        });
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível excluir a formação.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchFormations, meta?.page, meta?.limit, meta?.total],
  );

  // ------------------------------------------------------------------------
  // Modules
  // ------------------------------------------------------------------------

  // POST /training-tracks/:formationId/modules
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

        await fetchFormationById(formationId, { silent: true });

        return newModule;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível criar o módulo.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // PATCH /training-tracks/:formationId/modules/:moduleId
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
          `/training-tracks/${formationId}/modules/${moduleId}`,
          {
            method: "PATCH",
            body: data,
          },
        );

        await fetchFormationById(formationId, { silent: true });

        return updatedModule;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível atualizar o módulo.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // DELETE /training-tracks/:formationId/modules/:moduleId
  const deleteModule = useCallback(
    async (formationId: string, moduleId: string): Promise<void> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await request(`/training-tracks/${formationId}/modules/${moduleId}`, {
          method: "DELETE",
        });

        await fetchFormationById(formationId, { silent: true });
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível excluir o módulo.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // ------------------------------------------------------------------------
  // Context
  // ------------------------------------------------------------------------

  return (
    <FormationsContext.Provider
      value={{
        // State
        formations,
        meta,
        currentFormation,

        isLoading,
        isSubmitting,
        error,

        // Formations
        fetchFormations,
        fetchFormationById,
        createFormation,
        updateFormation,
        deleteFormation,

        // Modules
        createModule,
        updateModule,
        deleteModule,

        // Utilities
        setCurrentFormation,
        clearError,
      }}
    >
      {children}
    </FormationsContext.Provider>
  );
}
