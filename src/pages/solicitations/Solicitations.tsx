import { useCallback, useEffect, useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  FileText,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { SolicitationsProvider } from "../../contexts/solicitations/SolicitationsProvider";
import { useSolicitations } from "../../contexts/solicitations/useSolicitations";

import type {
  RequestStatus,
  ValidationStatus,
  SolicitationListItem,
  SolicitationDetails,
  DocumentType,
  Decision,
} from "../../contexts/solicitations/types";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Reprovada",
};

const VALIDATION_LABEL: Record<ValidationStatus, string> = {
  APPROVED: "Aprovada",
  REVIEW: "Requer conferência",
  REJECTED: "Reprovada",
  NOT_VALIDATED: "Não validada",
};

const STATUS_VARIANT: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
};

const VALIDATION_VARIANT: Record<ValidationStatus, string> = {
  APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
  REVIEW: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  NOT_VALIDATED: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

const DOCUMENT_LABEL: Record<DocumentType, string> = {
  PRESENTATION_LETTER: "Carta de apresentação",
  COMMITMENT_TERM: "Termo de compromisso",
  STUDENT_LIST: "Relação de alunos",
  WORK_PLAN: "Plano de trabalho",
};

const REQUEST_TYPE_LABEL: Record<string, string> = {
  estagio: "Estágio",
  pesquisa: "Pesquisa",
  extensao: "Extensão",
  "visita-tecnica": "Visita técnica",
};

const FORM_FIELDS = [
  { key: "requestType", label: "Tipo de solicitação" },
  { key: "institution", label: "Instituição" },
  { key: "locations", label: "Locais" },
  { key: "participants", label: "Participantes" },
  { key: "area", label: "Área" },
  { key: "startDate", label: "Início" },
  { key: "endDate", label: "Término" },
  { key: "protocol", label: "Protocolo" },
  { key: "activityDescription", label: "Descrição das atividades" },
  { key: "observation", label: "Observação" },
];

function formatCpf(cpf: string | null): string {
  if (!cpf) return "—";

  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";

  return new Date(value).toLocaleString("pt-BR");
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return value;

  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  if (key === "requestType") {
    return REQUEST_TYPE_LABEL[String(value)] ?? String(value);
  }

  if (key === "startDate" || key === "endDate") {
    return formatDate(String(value));
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getPhones(formData: Record<string, unknown>): string[] {
  return [1, 2, 3]
    .map((n) => {
      const phone = formData[`phone${n}`];

      if (typeof phone !== "string" || !phone.trim()) {
        return null;
      }

      return formData[`phone${n}Whatsapp`] === true
        ? `${phone} (WhatsApp)`
        : phone;
    })
    .filter((phone): phone is string => phone !== null);
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge className={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
  );
}

function ValidationBadge({ status }: { status: ValidationStatus }) {
  return (
    <Badge className={VALIDATION_VARIANT[status]}>
      {VALIDATION_LABEL[status]}
    </Badge>
  );
}

interface DetailsPanelProps {
  solicitationId: string;
  onClose: () => void;
  onDecisionSuccess: () => void;
}

function DetailsPanel({
  solicitationId,
  onClose,
  onDecisionSuccess,
}: DetailsPanelProps) {
  const {
    currentSolicitation,
    isLoadingDetails,
    isSubmitting,
    fetchSolicitationById,
    decideSolicitation,
    setCurrentSolicitation,
    getDocumentUrl,
  } = useSolicitations();

  const [note, setNote] = useState("");
  const [openingDocumentId, setOpeningDocumentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setNote("");
    setCurrentSolicitation(null);

    fetchSolicitationById(solicitationId).catch((error: unknown) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao carregar solicitação.",
      );
    });

    return () => {
      setCurrentSolicitation(null);
    };
  }, [solicitationId, fetchSolicitationById, setCurrentSolicitation]);

  const solicitation: SolicitationDetails | null =
    currentSolicitation?.id === solicitationId ? currentSolicitation : null;

  const handleOpenDocument = async (documentId: string) => {
    // open the tab synchronously (inside the click) so the browser doesn't block it
    const newTab = window.open("", "_blank");

    if (!newTab) {
      toast.error("Permita pop-ups neste site para visualizar o documento.");
      return;
    }

    newTab.opener = null;
    newTab.document.title = "Carregando documento...";

    setOpeningDocumentId(documentId);

    try {
      const { url } = await getDocumentUrl(solicitationId, documentId);
      newTab.location.href = url;
    } catch (error) {
      newTab.close();
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir o documento.",
      );
    } finally {
      setOpeningDocumentId(null);
    }
  };

  const handleDecision = async (decision: Decision) => {
    if (decision === "REJECTED" && !note.trim()) {
      toast.error("Informe o motivo da reprovação.");
      return;
    }

    try {
      await decideSolicitation(solicitationId, decision, note.trim());

      toast.success(
        decision === "APPROVED"
          ? "Solicitação aprovada com sucesso!"
          : "Solicitação reprovada com sucesso!",
      );

      onDecisionSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a decisão.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        className="flex h-full w-full max-w-2xl flex-col bg-background shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 id="details-title" className="text-lg font-semibold">
              Detalhes da solicitação
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Panel content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {isLoadingDetails && !solicitation && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin" />
              Carregando solicitação...
            </div>
          )}

          {!isLoadingDetails && !solicitation && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Não foi possível carregar os detalhes.
            </p>
          )}

          {solicitation && (
            <>
              {/* Status */}
              <section className="flex flex-wrap items-center gap-2">
                <StatusBadge status={solicitation.status} />

                <ValidationBadge status={solicitation.validationStatus} />

                <span className="text-xs text-muted-foreground">
                  Enviada em {formatDateTime(solicitation.createdAt)}
                </span>
              </section>

              {/* Applicant */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Solicitante
                </h3>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Nome</dt>
                    <dd className="font-medium">
                      {solicitation.applicantName ?? "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">E-mail</dt>
                    <dd className="break-all">
                      {solicitation.applicantEmail ?? "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">CPF</dt>
                    <dd>{formatCpf(solicitation.cpf)}</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Telefones</dt>
                    <dd>
                      {getPhones(solicitation.formData).join(", ") || "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Form fields */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Dados da solicitação
                </h3>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  {FORM_FIELDS.map(({ key, label }) => (
                    <div
                      key={key}
                      className={
                        key === "activityDescription" || key === "observation"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <dt className="text-muted-foreground">{label}</dt>

                      <dd className="whitespace-pre-wrap">
                        {formatFieldValue(key, solicitation.formData[key])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Documents */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Documentos ({solicitation.documents.length})
                </h3>

                {solicitation.documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum documento enviado.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {solicitation.documents.map((document) => (
                      <div key={document.id} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {DOCUMENT_LABEL[document.type]}
                            </span>
                          </div>

                          <ValidationBadge status={document.validationStatus} />
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="break-all text-xs text-muted-foreground">
                            {document.fileName}
                          </p>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            disabled={openingDocumentId === document.id}
                            onClick={() => handleOpenDocument(document.id)}
                          >
                            {openingDocumentId === document.id ? (
                              <RefreshCw className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Eye className="mr-2 size-4" />
                            )}
                            Visualizar
                          </Button>
                        </div>

                        {document.reasons.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                            {document.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Decision */}
              <section className="space-y-3 border-t pt-5">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Decisão administrativa
                </h3>

                {solicitation.status === "PENDING" ? (
                  <>
                    <Textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Observação ou motivo da decisão..."
                      rows={4}
                    />

                    <p className="text-xs text-muted-foreground">
                      O motivo é obrigatório para reprovar a solicitação.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        disabled={isSubmitting}
                        onClick={() => handleDecision("APPROVED")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Aprovar
                      </Button>

                      <Button
                        variant="destructive"
                        disabled={isSubmitting}
                        onClick={() => handleDecision("REJECTED")}
                      >
                        Reprovar
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
                    <p>
                      Decisão:{" "}
                      <strong>{STATUS_LABEL[solicitation.status]}</strong>
                    </p>

                    <p>
                      Responsável:{" "}
                      <strong>{solicitation.reviewedBy?.name ?? "—"}</strong>
                    </p>

                    <p>Data: {formatDateTime(solicitation.reviewedAt)}</p>

                    {solicitation.reviewNote && (
                      <div className="border-t pt-2">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          Observação
                        </p>

                        <p className="whitespace-pre-wrap">
                          {solicitation.reviewNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function getColumns(
  onAnalyze: (id: string) => void,
): ColumnDef<SolicitationListItem>[] {
  return [
    {
      id: "applicant",
      accessorFn: (row) =>
        [row.applicantName, row.applicantEmail, row.cpf]
          .filter(Boolean)
          .join(" "),
      header: "Solicitante",

      cell: ({ row }) => (
        <div className="min-w-[180px] space-y-1">
          <p className="font-medium">{row.original.applicantName ?? "—"}</p>

          <p className="text-xs text-muted-foreground">
            {row.original.applicantEmail ?? "—"}
          </p>
        </div>
      ),
    },

    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatCpf(row.original.cpf)}</span>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Enviada em",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },

    {
      accessorKey: "validationStatus",
      header: "Validação",
      cell: ({ row }) => (
        <ValidationBadge status={row.original.validationStatus} />
      ),
    },

    {
      accessorKey: "status",
      header: "Decisão",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      accessorKey: "_count.documents",
      header: "Documentos",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original._count.documents}
        </span>
      ),
    },

    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      enableHiding: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAnalyze(row.original.id)}
            className="h-11 w-full bg-[#3B82F6] font-semibold text-white shadow-sm hover:bg-[#2563EB] hover:text-white"
          >
            <Eye className="mr-2 size-4" />
            Analisar
          </Button>
        </div>
      ),
    },
  ];
}

function SolicitationsContent() {
  const { solicitations, meta, isLoading, error, fetchSolicitations } =
    useSolicitations();

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState<RequestStatus | "">("");

  const [validationStatus, setValidationStatus] = useState<
    ValidationStatus | ""
  >("");

  const [globalFilter, setGlobalFilter] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(() => {
    return fetchSolicitations({
      page,
      limit: PAGE_SIZE,
      status: status || undefined,
      validationStatus: validationStatus || undefined,
    });
  }, [fetchSolicitations, page, status, validationStatus]);

  useEffect(() => {
    load().catch(() => {
      // O contexto controla o estado de erro.
    });
  }, [load]);

  const columns = useMemo(() => getColumns(setSelectedId), []);

  const table = useReactTable({
    data: solicitations,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    manualPagination: true,

    pageCount: meta?.totalPages ?? 0,

    state: {
      globalFilter,
      pagination: {
        pageIndex: page - 1,
        pageSize: PAGE_SIZE,
      },
    },

    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: (row, columnId, filterValue) => {
      const search = normalizeSearch(String(filterValue ?? ""));

      if (!search) return true;

      const searchableValue = normalizeSearch(
        String(row.getValue(columnId) ?? ""),
      );

      const cpf = normalizeSearch(formatCpf(row.original.cpf));

      const rawCpf = normalizeSearch(row.original.cpf ?? "");

      return (
        searchableValue.includes(search) ||
        cpf.includes(search) ||
        rawCpf.includes(search)
      );
    },
  });

  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;

  const firstItem = total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;

  const lastItem = Math.min(page * PAGE_SIZE, total);

  const filteredRows = table.getFilteredRowModel().rows;

  const handleFilterChange = (
    filter: "status" | "validation",
    value: string,
  ) => {
    if (filter === "status") {
      setStatus(value === "ALL" ? "" : (value as RequestStatus));
    } else {
      setValidationStatus(value === "ALL" ? "" : (value as ValidationStatus));
    }

    setPage(1);
  };

  const handleDecisionSuccess = () => {
    load().catch(() => {
      // O contexto controla o erro.
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Solicitações
          </h1>

          <p className="text-sm text-muted-foreground">
            Analise os documentos enviados e registre a decisão final.
          </p>
        </div>

        <Button variant="outline" onClick={() => load()} disabled={isLoading}>
          <RefreshCw className="mr-2 size-4" />
          Atualizar
        </Button>
      </header>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span>{error}</span>

          <Button
            variant="link"
            onClick={() => load()}
            className="shrink-0 text-red-700"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF..."
              className="pl-9"
              aria-label="Buscar solicitações"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={status || "ALL"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Decisão" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Todas as decisões</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="APPROVED">Aprovadas</SelectItem>
                <SelectItem value="REJECTED">Reprovadas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={validationStatus || "ALL"}
              onValueChange={(value) => handleFilterChange("validation", value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Validação" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Todas as validações</SelectItem>
                <SelectItem value="APPROVED">Validação aprovada</SelectItem>
                <SelectItem value="REVIEW">Requer conferência</SelectItem>
                <SelectItem value="REJECTED">Reprovada</SelectItem>
                <SelectItem value="NOT_VALIDATED">Não validada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading && solicitations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Carregando solicitações...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma solicitação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {total > 0
              ? `${firstItem}–${lastItem} de ${total} solicitações`
              : "0 solicitações"}
            {isLoading && solicitations.length > 0 && " · Atualizando..."}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {page} de {Math.max(totalPages, 1)}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Página anterior"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Próxima página"
              disabled={page >= totalPages || isLoading || totalPages === 0}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedId && (
        <DetailsPanel
          solicitationId={selectedId}
          onClose={() => setSelectedId(null)}
          onDecisionSuccess={handleDecisionSuccess}
        />
      )}
    </div>
  );
}

export default function Solicitations() {
  return (
    <SolicitationsProvider>
      <SolicitationsContent />
    </SolicitationsProvider>
  );
}
