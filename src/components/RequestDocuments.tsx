import {
  CheckCircle2,
  FileText,
  FileUp,
  Files,
  Trash2,
  Upload,
} from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import type { PartnershipFormValues } from "../schemas/partnership.schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const documents = [
  {
    id: "work-plan",
    title: "Plano de trabalho/estudo",
    fileField: "file_work-plan",
    pagesField: "pages_work-plan",
  },
  {
    id: "student-list",
    title: "Relação de alunos",
    fileField: "file_student-list",
    pagesField: "pages_student-list",
  },
  {
    id: "presentation-letter",
    title: "Carta de apresentação",
    fileField: "file_presentation-letter",
    pagesField: "pages_presentation-letter",
  },
  {
    id: "commitment-term",
    title:
      "Termo de compromisso do estágio / Declaração de compromisso da universidade",
    fileField: "file_commitment-term",
    pagesField: "pages_commitment-term",
  },
] as const;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RequestDocuments() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PartnershipFormValues>();

  return (
    <Card className="mx-auto w-full max-w-4xl gap-0 border-border/70 py-0 shadow-sm">
      <CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
            <Files className="size-5" />
          </div>

          <div>
            <CardTitle className="text-xl text-[#241344]">
              Documentos da solicitação
            </CardTitle>
            <CardDescription className="mt-1">
              Anexe os documentos necessários para formalizar a parceria.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 sm:p-6 sm:pt-3">
        <div className="space-y-3">
          {documents.map((document, index) => {
            const fileError = errors[document.fileField];
            const pagesError = errors[document.pagesField];
            const fileInputId = `file-${document.id}`;
            const pagesInputId = `pages-${document.id}`;

            return (
              <section
                key={document.id}
                aria-labelledby={`title-${document.id}`}
                className="space-y-4 rounded-xl"
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_130px] sm:items-start">
                  {/* Upload do arquivo */}
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name={document.fileField}
                      render={({ field: { value, onChange, onBlur, ref } }) => {
                        const file = value instanceof File ? value : undefined;

                        return (
                          <>
                            <div className="flex items-stretch gap-2">
                              <label
                                htmlFor={fileInputId}
                                className={`flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                  file
                                    ? "border-solid border-[#6c3eb8]/40 bg-[#f3edfc]/50"
                                    : "border-dashed border-border hover:border-[#6c3eb8] hover:bg-[#f3edfc]/50"
                                }`}
                              >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
                                  {file ? (
                                    <CheckCircle2 className="size-4" />
                                  ) : (
                                    <Upload className="size-4" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  {file ? (
                                    <>
                                      <p className="truncate text-sm font-medium">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)} · Clique
                                        para trocar o arquivo
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm font-medium">
                                        Selecionar arquivo
                                      </p>
                                      <p className="truncate text-xs text-muted-foreground">
                                        para: {document.title}
                                      </p>
                                    </>
                                  )}
                                </div>

                                <FileUp className="size-4 shrink-0 text-muted-foreground" />
                              </label>

                              {file && (
                                <button
                                  type="button"
                                  onClick={() => onChange(undefined)}
                                  aria-label={`Remover arquivo de ${document.title}`}
                                  className="flex shrink-0 items-center justify-center rounded-lg border border-border px-3 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>

                            <Input
                              id={fileInputId}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="sr-only"
                              ref={ref}
                              onBlur={onBlur}
                              aria-label={`Arquivo: ${document.title}`}
                              aria-invalid={!!fileError}
                              onChange={(event) => {
                                const selected = event.target.files?.[0];
                                onChange(selected); // guarda o File direto no form
                                // limpa o input para permitir escolher o mesmo arquivo de novo
                                event.target.value = "";
                              }}
                            />
                          </>
                        );
                      }}
                    />

                    {fileError && (
                      <p className="text-sm text-destructive">
                        {fileError.message?.toString()}
                      </p>
                    )}
                  </div>

                  {/* Quantidade de folhas */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={pagesInputId}
                      className="text-xs text-muted-foreground"
                    >
                      Quantidade de folhas *
                    </Label>

                    <Input
                      id={pagesInputId}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ex.: 5"
                      aria-label={`Quantidade de folhas de ${document.title}`}
                      aria-invalid={!!pagesError}
                      {...register(document.pagesField, {
                        setValueAs: (value) =>
                          value === "" ? "" : String(value),
                      })}
                    />

                    {pagesError && (
                      <p className="text-xs text-destructive">
                        {pagesError.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Os campos marcados com * são obrigatórios. Confira se os documentos
          estão legíveis antes de enviá-los.
        </p>
      </CardContent>
    </Card>
  );
}
