
import { z } from "zod";

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const requiredFile = z
  .instanceof(File, { error: "Selecione um arquivo" })
  .refine((file) => file.size > 0, "O arquivo não pode estar vazio")
  .refine(
    (file) => allowedMimeTypes.includes(file.type),
    "O arquivo deve ser PDF, DOC ou DOCX",
  );

const requiredPages = z
  .string()
  .min(1, "Informe a quantidade de folhas")
  .regex(/^[1-9]\d*$/, "Informe um número inteiro maior que zero");

export const requestDocumentsSchema = z.object({
  "file_work-plan": requiredFile,
  "pages_work-plan": requiredPages,

  "file_student-list": requiredFile,
  "pages_student-list": requiredPages,

  "file_presentation-letter": requiredFile,
  "pages_presentation-letter": requiredPages,

  "file_commitment-term": requiredFile,
  "pages_commitment-term": requiredPages,
});

export type RequestDocumentsFormValues = z.infer<
  typeof requestDocumentsSchema
>;
