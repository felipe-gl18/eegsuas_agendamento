import { toast } from "sonner";

export interface DocumentReturn {
  field: string;
  name?: string;
  file?: string;
  status?: string;
  reasons?: string[];
}

export function DocumentsList({ documents }: { documents: DocumentReturn[] }) {
  console.log(documents);

  return (
    <ul className="mt-2 max-h-72 space-y-3 overflow-y-auto pr-1 text-left">
      {documents.map((doc) => (
        <li key={doc.field}>
          <p className="font-medium">
            {doc.name ?? doc.field}
            {doc.file && (
              <span className="ml-1 font-normal opacity-70">({doc.file})</span>
            )}
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 opacity-90">
            {(doc.reasons ?? []).map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function showError(message: string, documents: DocumentReturn[] = []) {
  console.log(message, documents);
  toast.error(message, {
    duration: 15000,
    description:
      documents.length > 0 ? (
        <DocumentsList documents={documents} />
      ) : undefined,
  });
}
