import { useCallback, useRef, useState, type ReactNode } from "react";

import { UsersContext } from "./UsersContext";

import type {
  User,
  UserListItem,
  UserDetails,
  Paginated,
  PaginationMeta,
  PaginationParams,
  UserEnrollment,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

interface RequestOptions {
  method?: "GET" | "DELETE";
}

// --------------------------------------------------------------------------
// API Request
// --------------------------------------------------------------------------

async function request<T = void>(
  path: string,
  { method = "GET" }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
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

  if (params.role) {
    searchParams.set("role", params.role);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------

interface UsersProviderProps {
  children: ReactNode;
}

export function UsersProvider({ children }: UsersProviderProps) {
  // State
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);
  const lastEnrollmentsRequest = useRef(0);

  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ------------------------------------------------------------------------
  // Users
  // ------------------------------------------------------------------------

  // GET /users?page=&limit=&search=&role=
  const fetchUsers = useCallback(
    async (params?: PaginationParams): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await request<Paginated<UserListItem>>(
          `/users${buildQueryParams(params)}`,
        );

        setUsers(data.data);
        setMeta(data.meta);
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar os usuários.",
        );

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // GET /users/:id/enrollments
  const fetchUserEnrollments = useCallback(
    async (userId: string): Promise<void> => {
      const requestId = ++lastEnrollmentsRequest.current;

      setIsLoadingEnrollments(true);
      setEnrollmentsError(null);
      setEnrollments([]);

      try {
        const data = await request<UserEnrollment[]>(
          `/users/${encodeURIComponent(userId)}/enrollments`,
        );

        // Ignora respostas de um usuário que já não está na tela.
        if (requestId !== lastEnrollmentsRequest.current) return;

        setEnrollments(data);
      } catch (err) {
        if (requestId !== lastEnrollmentsRequest.current) return;

        setEnrollmentsError(
          getErrorMessage(err, "Não foi possível carregar as formações."),
        );
        throw err;
      } finally {
        if (requestId === lastEnrollmentsRequest.current) {
          setIsLoadingEnrollments(false);
        }
      }
    },
    [],
  );

  // GET /users/:id
  const fetchUserById = useCallback(
    async (id: string): Promise<UserDetails> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await request<UserDetails>(`/users/${id}`);

        setCurrentUser(data);

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível carregar o usuário.",
        );

        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // DELETE /users/:id
  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await request(`/users/${id}`, {
          method: "DELETE",
        });

        const currentPage = meta?.page ?? 1;
        const limit = meta?.limit ?? 10;
        const newTotal = Math.max(0, (meta?.total ?? 1) - 1);
        const newTotalPages = Math.ceil(newTotal / limit);

        // If the current page no longer exists, go to the previous page.
        const targetPage = Math.min(currentPage, Math.max(1, newTotalPages));

        setCurrentUser((prev) => (prev?.id === id ? null : prev));

        await fetchUsers({
          page: targetPage,
          limit,
        });
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Não foi possível excluir o usuário.",
        );

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, meta?.page, meta?.limit, meta?.total],
  );

  // ------------------------------------------------------------------------
  // Context
  // ------------------------------------------------------------------------

  return (
    <UsersContext.Provider
      value={{
        // State
        users,
        meta,
        currentUser,

        isLoading,
        isSubmitting,
        error,
        enrollments,
        isLoadingEnrollments,
        enrollmentsError,
        fetchUserEnrollments,

        // Users
        fetchUsers,
        fetchUserById,
        deleteUser,

        // Utilities
        setCurrentUser,
        clearError,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
