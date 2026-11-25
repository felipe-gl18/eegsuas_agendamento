/* -------------------------------------------------------------------------- */
/*  Paginação                                                                  */
/* -------------------------------------------------------------------------- */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

/* -------------------------------------------------------------------------- */
/*  Enums                                                                      */
/* -------------------------------------------------------------------------- */

export type UserRole = "ADMIN" | "TRAINER" | "PARTICIPANT" | "CONSULTANT";

export type UniversityStatus = "PENDING" | "VERIFIED" | "REJECTED";

/* -------------------------------------------------------------------------- */
/*  Entidades                                                                  */
/* -------------------------------------------------------------------------- */

export interface UserUniversity {
  id: string;
  name: string;
  acronym: string;
  status: UniversityStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  universityId: string | null;
  university: UserUniversity | null;
  createdAt: string;
}

/** Item da listagem de usuários. */
export type UserListItem = User;

/** Detalhes de um usuário específico. */
export type UserDetails = User;

export interface UserEnrollmentTrack {
  id: string;
  name: string;
  description: string;
  workloadHours: number;
}

export interface UserEnrollmentCertificate {
  id: string;
  issuedAt: string;
  fileUrl: string | null;
}

export interface UserEnrollment {
  id: string;
  createdAt: string;
  trainingTrack: UserEnrollmentTrack;
  certificate: UserEnrollmentCertificate | null;
}

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                   */
/* -------------------------------------------------------------------------- */

export interface UsersContextData {
  // Estado
  users: UserListItem[];
  meta: PaginationMeta | null;
  currentUser: UserDetails | null;

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  enrollments: UserEnrollment[];
  isLoadingEnrollments: boolean;
  enrollmentsError: string | null;
  fetchUserEnrollments: (userId: string) => Promise<void>;

  // Usuários
  fetchUsers: (params?: PaginationParams) => Promise<void>;

  fetchUserById: (id: string) => Promise<UserDetails>;

  deleteUser: (id: string) => Promise<void>;

  // Utilitários
  setCurrentUser: (user: UserDetails | null) => void;

  clearError: () => void;
}
