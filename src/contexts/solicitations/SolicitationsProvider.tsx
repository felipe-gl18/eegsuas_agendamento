import { useCallback, useRef, useState, type ReactNode } from "react";

import { SolicitationsContext } from "./SolicitationsContext";

import type {
  Decision,
  PaginationMeta,
  SolicitationDetails,
  SolicitationListItem,
  SolicitationsParams,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

interface RequestOptions {
  method?: "GET" | "PATCH";
  body?: unknown;
}

/** Formato que o backend devolve na listagem (GET /admin/upload-requests). */
interface ListResponse {
  items: SolicitationListItem[];
  total: number;
  page: number;
  pageSize: number;
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

function buildQueryParams(params?: SolicitationsParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  // o backend chama este parâmetro de pageSize
  if (params.limit !== undefined) {
    searchParams.set("pageSize", String(params.limit));
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.validationStatus) {
    searchParams.set("validationStatus", params.validationStatus);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------

interface SolicitationsProviderProps {
  children: ReactNode;
}

export function SolicitationsProvider({
  children,
}: SolicitationsProviderProps) {
  // State
  const [solicitations, setSolicitations] = useState<SolicitationListItem[]>(
    [],
  );
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [currentSolicitation, setCurrentSolicitation] =
    useState<SolicitationDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastListRequest = useRef(0);
  const lastDetailsRequest = useRef(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ------------------------------------------------------------------------
  // Solicitations
  // ------------------------------------------------------------------------

  // GET /admin/upload-requests?page=&pageSize=&status=&validationStatus=
  const fetchSolicitations = useCallback(
    async (params?: SolicitationsParams): Promise<void> => {
      const requestId = ++lastListRequest.current;

      setIsLoading(true);
      setError(null);

      try {
        const data = await request<ListResponse>(
          `/admin/upload-requests${buildQueryParams(params)}`,
        );

        // Ignora respostas de uma consulta que já foi substituída por outra.
        if (requestId !== lastListRequest.current) return;

        setSolicitations(data.items);
        setMeta({
          total: data.total,
          page: data.page,
          limit: data.pageSize,
          totalPages: Math.max(1, Math.ceil(data.total / data.pageSize)),
        });
      } catch (err) {
        if (requestId !== lastListRequest.current) return;

        setError(
          getErrorMessage(err, "Não foi possível carregar as solicitações."),
        );
        throw err;
      } finally {
        if (requestId === lastListRequest.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // GET /admin/upload-requests/:id
  const fetchSolicitationById = useCallback(
    async (id: string): Promise<SolicitationDetails> => {
      const requestId = ++lastDetailsRequest.current;

      setIsLoadingDetails(true);
      setError(null);

      try {
        const data = await request<SolicitationDetails>(
          `/admin/upload-requests/${encodeURIComponent(id)}`,
        );

        if (requestId === lastDetailsRequest.current) {
          setCurrentSolicitation(data);
        }

        return data;
      } catch (err) {
        if (requestId === lastDetailsRequest.current) {
          setError(
            getErrorMessage(err, "Não foi possível carregar a solicitação."),
          );
        }
        throw err;
      } finally {
        if (requestId === lastDetailsRequest.current) {
          setIsLoadingDetails(false);
        }
      }
    },
    [],
  );

  // PATCH /admin/upload-requests/:id/decision
  const decideSolicitation = useCallback(
    async (
      id: string,
      decision: Decision,
      note?: string,
    ): Promise<SolicitationDetails> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const updated = await request<SolicitationDetails>(
          `/admin/upload-requests/${encodeURIComponent(id)}/decision`,
          { method: "PATCH", body: { decision, note } },
        );

        setCurrentSolicitation((prev) => (prev?.id === id ? updated : prev));

        // Atualiza a linha na listagem sem precisar recarregar.
        setSolicitations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: updated.status,
                  reviewedAt: updated.reviewedAt,
                }
              : item,
          ),
        );

        return updated;
      } catch (err) {
        setError(getErrorMessage(err, "Não foi possível registrar a decisão."));
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
    <SolicitationsContext.Provider
      value={{
        // State
        solicitations,
        meta,
        currentSolicitation,

        isLoading,
        isLoadingDetails,
        isSubmitting,
        error,

        // Solicitations
        fetchSolicitations,
        fetchSolicitationById,
        decideSolicitation,

        // Utilities
        setCurrentSolicitation,
        clearError,
      }}
    >
      {children}
    </SolicitationsContext.Provider>
  );
}
