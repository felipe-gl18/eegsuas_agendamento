import { cn } from "../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  siblingCount?: number;
  className?: string;

  showSummary?: boolean;
  totalItems?: number;
  pageSize?: number;
}

type PageItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  const totalNumbers = siblingCount * 2 + 5;

  // Display every page when there aren't many pages.
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(1, currentPage - siblingCount);
  const rightSibling = Math.min(totalPages, currentPage + siblingCount);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  // Only right ellipsis.
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;

    return [
      ...Array.from({ length: leftCount }, (_, i) => i + 1),
      "ellipsis",
      totalPages,
    ];
  }

  // Only left ellipsis.
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const start = totalPages - rightCount + 1;

    return [
      1,
      "ellipsis",
      ...Array.from({ length: rightCount }, (_, i) => start + i),
    ];
  }

  // Both ellipses.
  return [
    1,
    "ellipsis",
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i,
    ),
    "ellipsis",
    totalPages,
  ];
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showSummary = false,
  totalItems = 0,
  pageSize = 10,
}: DataPaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const pages = getPaginationItems(
    safePage,
    totalPages,
    Math.max(0, siblingCount),
  );

  const startItem = (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safePage) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 sm:flex-row",
        className,
      )}
    >
      {showSummary && (
        <p className="text-sm text-muted-foreground">
          Exibindo{" "}
          <span className="font-medium text-foreground">
            {totalItems === 0 ? 0 : startItem}-{endItem}
          </span>{" "}
          de <span className="font-medium text-foreground">{totalItems}</span>{" "}
          resultados
        </p>
      )}

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="default"
              href="#"
              aria-disabled={safePage === 1}
              className={cn(safePage === 1 && "pointer-events-none opacity-50")}
              onClick={(event) => {
                event.preventDefault();
                handlePageChange(safePage - 1);
              }}
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  size="default"
                  href="#"
                  isActive={page === safePage}
                  aria-label={`Ir para página ${page}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              size="default"
              href="#"
              aria-disabled={safePage === totalPages}
              className={cn(
                safePage === totalPages && "pointer-events-none opacity-50",
              )}
              onClick={(event) => {
                event.preventDefault();
                handlePageChange(safePage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
