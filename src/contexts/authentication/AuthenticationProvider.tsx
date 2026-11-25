import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthenticationContext } from "./AuthenticationContext";

import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  Unity,
  Occupation,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
}

// Small fetch wrapper. `credentials: "include"` makes the browser send and
// receive the HttpOnly session cookie. Tokens are never read or stored here.
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
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    // NestJS validation errors come as an array of messages.
    const message = Array.isArray(data?.message)
      ? data.message.join(" ")
      : data?.message;

    throw new Error(message ?? "Something went wrong. Please try again.");
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Checks the current authentication session.
  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await request<AuthUser>("/auth/me");
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // The backend sets the HttpOnly cookie and returns the user.
      // Never persist the password or returned tokens.
      const loggedUser = await request<AuthUser>("/auth/login", {
        method: "POST",
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      setUser(loggedUser);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to authenticate.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // The backend hashes the password and checks email/CPF uniqueness.
      // It does not start a session: the user must log in afterwards.
      await request("/auth/register", {
        method: "POST",
        body: {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          password: data.password,
          unityId: data.unityId,
          occupationId: data.occupationId,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create your account.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // The backend clears the HttpOnly cookie.
      await request("/auth/logout", { method: "POST" });

      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to logout.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Always a generic success response: it never reveals whether an email exists.
      await request("/auth/forgot-password", {
        method: "POST",
        body: { email: data.email },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to request password recovery.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      // The backend validates the one-time token.
      await request("/auth/reset-password", {
        method: "POST",
        body: { token: data.token, password: data.password },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reset password.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      // The backend verifies the current password.
      await request("/auth/change-password", {
        method: "PATCH",
        body: data,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to change password.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);

    try {
      await request("/users/me", {
        method: "PATCH",
        body: data,
      });

      setUser((currentUser) => {
        if (!currentUser) {
          throw new Error("User is not authenticated.");
        }

        return {
          ...currentUser,
          ...data,
        };
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Loads the options for the registration selects (public endpoints).
  const fetchRegistrationOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    setError(null);

    try {
      const [unitiesData, occupationsData] = await Promise.all([
        request<Unity[]>("/unities"),
        request<Occupation[]>("/occupations"),
      ]);

      setUnities(unitiesData);
      setOccupations(occupationsData);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load the registration options.";

      setError(message);
      throw err;
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial session check
  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      unities,
      occupations,
      isAuthenticated,
      isLoading,
      isInitializing,
      error,
      isLoadingOptions,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      updateProfile,
      refreshSession,
      fetchRegistrationOptions,
      clearError,
    }),
    [
      user,
      unities,
      occupations,
      isAuthenticated,
      isLoading,
      isInitializing,
      error,
      isLoadingOptions,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      updateProfile,
      refreshSession,
      fetchRegistrationOptions,
      clearError,
    ],
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}
