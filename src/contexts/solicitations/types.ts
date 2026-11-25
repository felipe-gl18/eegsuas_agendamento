/* -------------------------------------------------------------------------- */
/*  Paginação                                                                  */
/* -------------------------------------------------------------------------- */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SolicitationsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  validationStatus?: ValidationStatus;
}

/* -------------------------------------------------------------------------- */
/*  Enums                                                                      */
/* -------------------------------------------------------------------------- */

/** Decisão final, tomada somente pelo administrador. */
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Resultado da validação automática. */
export type ValidationStatus =
  | "APPROVED"
  | "REVIEW"
  | "REJECTED"
  | "NOT_VALIDATED";

export type DocumentType =
  | "PRESENTATION_LETTER"
  | "COMMITMENT_TERM"
  | "STUDENT_LIST"
  | "WORK_PLAN";

export type Decision = "APPROVED" | "REJECTED";

/* -------------------------------------------------------------------------- */
/*  Entidades                                                                  */
/* -------------------------------------------------------------------------- */

export interface SolicitationDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  filePath: string;
  mimeType: string;
  validationStatus: ValidationStatus;
  reasons: string[];
  createdAt: string;
}

export interface SolicitationReviewer {
  id: string;
  name: string;
}

/** Item da listagem de solicitações. */
export interface SolicitationListItem {
  id: string;
  applicantName: string | null;
  applicantEmail: string | null;
  cpf: string | null;
  validationStatus: ValidationStatus;
  status: RequestStatus;
  reviewedAt: string | null;
  createdAt: string;
  _count: { documents: number };
}

/** Detalhes de uma solicitação específica. */
export interface SolicitationDetails extends Omit<
  SolicitationListItem,
  "_count"
> {
  formData: Record<string, unknown>;
  reviewNote: string | null;
  reviewedBy: SolicitationReviewer | null;
  documents: SolicitationDocument[];
}

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                   */
/* -------------------------------------------------------------------------- */

export interface SolicitationsContextData {
  // Estado
  solicitations: SolicitationListItem[];
  meta: PaginationMeta | null;
  currentSolicitation: SolicitationDetails | null;

  isLoading: boolean;
  isLoadingDetails: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Solicitações
  fetchSolicitations: (params?: SolicitationsParams) => Promise<void>;

  fetchSolicitationById: (id: string) => Promise<SolicitationDetails>;

  decideSolicitation: (
    id: string,
    decision: Decision,
    note?: string,
  ) => Promise<SolicitationDetails>;

  // Utilitários
  setCurrentSolicitation: (solicitation: SolicitationDetails | null) => void;

  clearError: () => void;
}
