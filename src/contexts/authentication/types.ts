export type UserRole = "PARTICIPANT" | "ADMIN" | "UNIVERSITY";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  unityId: string;
  occupationId: string;
  universityId?: string | null;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  university?: string | null;
}

export interface Unity {
  id: string;
  name: string;
  acronym: string | null;
}

export interface Occupation {
  id: string;
  name: string;
}

export interface AuthenticationContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  unities: Unity[];
  occupations: Occupation[];
  isLoadingOptions: boolean;
  fetchRegistrationOptions: () => Promise<void>;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;

  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;

  updateProfile: (data: UpdateProfileData) => Promise<void>;

  refreshSession: () => Promise<void>;
  clearError: () => void;
}
