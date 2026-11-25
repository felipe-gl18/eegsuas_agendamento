import { useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  type FilterFn,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  AwardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  Loader2Icon,
  SearchIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";
const PAGE_SIZE = 10;
const MINIMUM_ATTENDANCE = 75;

interface EnrolledStudent {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  attendancePercentage: number;
  totalSessions: number;
  attendedSessions: number;
  absentSessions: number;
}

interface EnrolledStudentsProps {
  trackId: string;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const searchFilter: FilterFn<EnrolledStudent> = (row, _columnId, value) => {
  const term = normalize(String(value ?? "").trim());

  if (!term) return true;

  return (
    normalize(row.original.user.name).includes(term) ||
    normalize(row.original.user.email).includes(term)
  );
};

interface SortableHeaderProps {
  label: string;
  sorted: false | "asc" | "desc";
  onToggle: () => void;
}

function SortableHeader({ label, sorted, onToggle }: SortableHeaderProps) {
  const Icon =
    sorted === "asc"
      ? ArrowUpIcon
      : sorted === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={onToggle}
    >
      {label}
      <Icon className="size-3.5" />
    </Button>
  );
}

function AttendanceBadge({
  percentage,
  totalSessions,
}: {
  percentage: number;
  totalSessions: number;
}) {
  if (totalSessions === 0) {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Sem sessões
      </span>
    );
  }

  const approved = percentage >= MINIMUM_ATTENDANCE;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        approved
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {percentage.toFixed(2)}%
    </span>
  );
}

export default function EnrolledStudents({ trackId }: EnrolledStudentsProps) {
  const [enrollments, setEnrollments] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [certificates, setCertificates] = useState<Record<string, boolean>>({});
  const [processingCertificate, setProcessingCertificate] = useState<
    string | null
  >(null);
  const [certificateErrors, setCertificateErrors] = useState<
    Record<string, string>
  >({});

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  async function issueCertificate(student: EnrolledStudent) {
    if (student.attendancePercentage < MINIMUM_ATTENDANCE) return;

    setProcessingCertificate(student.id);
    setCertificateErrors((prev) => ({ ...prev, [student.id]: "" }));

    try {
      const response = await fetch(
        `${API_URL}/enrollments/${student.id}/certificate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileUrl: null,
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          response.status === 409
            ? "Este aluno já possui certificado."
            : message || "Não foi possível emitir o certificado.",
        );
      }

      setCertificates((prev) => ({ ...prev, [student.id]: true }));
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("já possui certificado")
      ) {
        setCertificates((prev) => ({ ...prev, [student.id]: true }));
      } else {
        setCertificateErrors((prev) => ({
          ...prev,
          [student.id]:
            error instanceof Error
              ? error.message
              : "Erro ao emitir certificado.",
        }));
      }
    } finally {
      setProcessingCertificate(null);
    }
  }

  async function downloadCertificate(student: EnrolledStudent) {
    setProcessingCertificate(student.id);

    try {
      const response = await fetch(
        `${API_URL}/enrollments/${student.id}/certificate/pdf`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Não foi possível baixar o certificado.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `certificado-${student.user.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-]/g, "-")}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      setCertificateErrors((prev) => ({
        ...prev,
        [student.id]:
          error instanceof Error
            ? error.message
            : "Erro ao baixar certificado.",
      }));
    } finally {
      setProcessingCertificate(null);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/training-tracks/${encodeURIComponent(trackId)}/enrollments`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar os alunos matriculados.");
        }

        setEnrollments((await response.json()) as EnrolledStudent[]);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os alunos matriculados.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [trackId]);

  const columns = useMemo<ColumnDef<EnrolledStudent>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.user.name,
        header: ({ column }) => (
          <SortableHeader
            label="Nome"
            sorted={column.getIsSorted()}
            onToggle={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.user.name}</span>
        ),
        sortingFn: (a, b) =>
          a.original.user.name.localeCompare(b.original.user.name, "pt-BR"),
      },
      {
        id: "email",
        accessorFn: (row) => row.user.email,
        header: ({ column }) => (
          <SortableHeader
            label="E-mail"
            sorted={column.getIsSorted()}
            onToggle={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          />
        ),
        cell: ({ row }) => row.original.user.email,
      },
      {
        id: "createdAt",
        accessorFn: (row) => new Date(row.createdAt),
        header: ({ column }) => (
          <SortableHeader
            label="Matrícula em"
            sorted={column.getIsSorted()}
            onToggle={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">
            {new Date(row.original.createdAt).toLocaleDateString("pt-BR")}
          </span>
        ),
        sortingFn: "datetime",
      },
      {
        id: "attendance",
        accessorFn: (row) => row.attendancePercentage ?? 0,
        header: ({ column }) => (
          <SortableHeader
            label="Frequência"
            sorted={column.getIsSorted()}
            onToggle={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          />
        ),
        cell: ({ row }) => {
          const student = row.original;

          return (
            <div className="flex flex-col gap-1.5">
              <AttendanceBadge
                percentage={student.attendancePercentage ?? 0}
                totalSessions={student.totalSessions ?? 0}
              />
              <span className="text-xs text-muted-foreground">
                {student.attendedSessions ?? 0} de {student.totalSessions ?? 0}{" "}
                sessões
              </span>
            </div>
          );
        },
      },
      {
        id: "certificate",
        header: "Certificado",
        enableSorting: false,
        cell: ({ row }) => {
          const student = row.original;
          const isEligible =
            student.totalSessions > 0 &&
            student.attendancePercentage >= MINIMUM_ATTENDANCE;

          const isProcessing = processingCertificate === student.id;
          const hasCertificate = certificates[student.id];

          return (
            <div className="flex flex-col gap-1">
              {hasCertificate ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isProcessing}
                  onClick={() => void downloadCertificate(student)}
                >
                  {isProcessing ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : (
                    <DownloadIcon className="mr-2 size-4" />
                  )}
                  Baixar PDF
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isEligible || isProcessing}
                  onClick={() => void issueCertificate(student)}
                >
                  {isProcessing ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : (
                    <AwardIcon className="mr-2 size-4" />
                  )}
                  Emitir certificado
                </Button>
              )}

              {certificateErrors[student.id] && (
                <span className="text-xs text-destructive">
                  {certificateErrors[student.id]}
                </span>
              )}

              {!isEligible && !hasCertificate && (
                <span className="text-xs text-muted-foreground">
                  Frequência insuficiente
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [processingCertificate, certificates, certificateErrors],
  );

  const table = useReactTable({
    data: enrollments,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: searchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: PAGE_SIZE },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Carregando alunos...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircleIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (enrollments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum aluno matriculado nesta formação.
      </p>
    );
  }

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  const firstItem = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;

  const lastItem = Math.min((pageIndex + 1) * pageSize, filteredCount);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          aria-label="Buscar alunos"
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-md border border-border">
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
            {table.getRowModel().rows.length > 0 ? (
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
                  Nenhum aluno encontrado para "{globalFilter}".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {firstItem}–{lastItem} de {filteredCount}{" "}
          {filteredCount === 1 ? "aluno" : "alunos"}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Página {pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Página anterior"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Próxima página"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
