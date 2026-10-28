import { FileUp, Files, FileText, Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";

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
import { useEffect } from "react";

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

export function RequestDocuments() {
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PartnershipFormValues>();

  const fileFields = documents.map((document) => watch(document.fileField));

  useEffect(() => {
    const documentArray = documents.map((document) => document.fileField);
    documentArray.map((document) => console.log(getValues(document)));
  }, [getValues]);

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
          {documents.map((document) => {
            const fileError = errors[document.fileField];
            const pagesError = errors[document.pagesField];

            return (
              <div
                key={document.id}
                className="grid gap-4 rounded-xl border border-border/70 p-4 sm:grid-cols-[minmax(0,1fr)_130px] sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3edfc] text-[#6c3eb8]">
                    <FileText className="size-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <Label
                      htmlFor={`file-${document.id}`}
                      className="text-sm font-medium leading-relaxed"
                    >
                      {document.title}
                      <span className="text-destructive"> *</span>
                    </Label>

                    <p className="text-xs text-muted-foreground">
                      PDF ou documento digitalizado
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`pages-${document.id}`}
                    className="text-xs text-muted-foreground"
                  >
                    Quantidade de folhas *
                  </Label>

                  <Input
                    id={`pages-${document.id}`}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex.: 5"
                    {...register(document.pagesField, {
                      setValueAs: (value) =>
                        value === "" ? "" : String(value),
                    })}
                  />

                  {pagesError && (
                    <p className="text-sm text-destructive">
                      {pagesError.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor={`file-${document.id}`}
                    className="text-xs text-muted-foreground"
                  >
                    Arquivo *
                  </Label>

                  <label
                    htmlFor={`file-${document.id}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-3 transition-colors hover:border-[#6c3eb8] hover:bg-[#f3edfc]/50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ede5fa] text-[#6c3eb8]">
                      <Upload className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {getValues(document.fileField)?.name ??
                          "Selecionar arquivo"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Clique para procurar no dispositivo
                      </p>
                    </div>

                    <FileUp className="size-4 shrink-0 text-muted-foreground" />
                  </label>

                  <Input
                    id={`file-${document.id}`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    {...register(document.fileField, {
                      onChange: (event) => {
                        const file = event.target.files?.[0];
                        console.log(file, typeof file);
                        setValue(document.fileField, file as never, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    })}
                  />

                  {fileError && (
                    <p className="text-sm text-destructive">
                      {fileError.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
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
