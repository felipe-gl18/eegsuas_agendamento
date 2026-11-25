import { useCallback, useRef, useState, type ReactNode } from "react";

import { ScheduleContext } from "./ScheduleContext";

import type {
  CreateTrainingSessionDto,
  ScheduleSession,
  ScheduleSessionDetails,
  SessionsRange,
  UpdateTrainingSessionDto,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

/* -------------------------------------------------------------------------- */
/*  API Request                                                                */
/* -------------------------------------------------------------------------- */

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

async function request<T = void>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: body
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
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

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                   */
/* -------------------------------------------------------------------------- */

interface ScheduleProviderProps {
  children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  // State
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);

  const [currentSession, setCurrentSession] =
    useState<ScheduleSessionDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET /training-modules/:moduleId/sessions
  const fetchSessions = useCallback(async (moduleId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await request<ScheduleSession[]>(
        `/training-modules/${encodeURIComponent(moduleId)}/sessions`,
      );

      setSessions(data);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível carregar os agendamentos.",
      );

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    setCurrentSession(null);
    setError(null);
  }, []);

  // ------------------------------------------------------------------------
  // Sessions
  // ------------------------------------------------------------------------

  const lastRequestId = useRef(0);

  // GET /training-sessions?from=...&to=...
  const fetchAllSessions = useCallback(
    async ({ from, to }: SessionsRange): Promise<void> => {
      const requestId = ++lastRequestId.current;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ from, to });
        const data = await request<ScheduleSession[]>(
          `/training-sessions?${params.toString()}`,
        );

        // ignora resposta de uma semana que já não está na tela
        if (requestId !== lastRequestId.current) return;

        setSessions(data);
      } catch (err) {
        if (requestId !== lastRequestId.current) return;

        setError(
          getErrorMessage(err, "Não foi possível carregar os agendamentos."),
        );
        throw err;
      } finally {
        if (requestId === lastRequestId.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // GET /training-sessions/:id
  const fetchSessionById = useCallback(
    async (id: string): Promise<ScheduleSessionDetails> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await request<ScheduleSessionDetails>(
          `/training-sessions/${encodeURIComponent(id)}`,
        );

        setCurrentSession(data);

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar o agendamento.",
        );

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // POST /training-modules/:moduleId/sessions
  const createSession = useCallback(
    async (
      moduleId: string,
      dto: CreateTrainingSessionDto,
    ): Promise<ScheduleSession> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const data = await request<ScheduleSession>(
          `/training-modules/${encodeURIComponent(moduleId)}/sessions`,
          {
            method: "POST",
            body: dto,
          },
        );

        setSessions((prev) =>
          [...prev, data].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          ),
        );

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível criar o agendamento.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // PATCH /training-sessions/:id
  const updateSession = useCallback(
    async (
      id: string,
      dto: UpdateTrainingSessionDto,
    ): Promise<ScheduleSession> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const data = await request<ScheduleSession>(
          `/training-sessions/${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            body: dto,
          },
        );

        setSessions((prev) =>
          prev
            .map((session) => (session.id === id ? data : session))
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            ),
        );

        setCurrentSession((prev) =>
          prev?.id === id ? { ...prev, ...data } : prev,
        );

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível atualizar o agendamento.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // DELETE /training-sessions/:id
  const deleteSession = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await request(`/training-sessions/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setSessions((prev) => prev.filter((session) => session.id !== id));

      setCurrentSession((prev) => (prev?.id === id ? null : prev));
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Não foi possível excluir o agendamento.",
      );

      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ------------------------------------------------------------------------
  // Context
  // ------------------------------------------------------------------------

  return (
    <ScheduleContext.Provider
      value={{
        // State
        sessions,
        currentSession,

        isLoading,
        isSubmitting,
        error,

        // Sessions
        fetchSessions,
        fetchAllSessions,
        fetchSessionById,
        createSession,
        updateSession,
        deleteSession,

        // Utilities
        setCurrentSession,
        clearError,
        clearSessions,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}
