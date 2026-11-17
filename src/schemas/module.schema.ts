import { z } from "zod";

export const moduleSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do módulo é obrigatório.")
    .max(150, "O nome deve ter no máximo 150 caracteres."),

  description: z
    .string()
    .max(2000, "A descrição deve ter no máximo 2000 caracteres.")
    .optional()
    .or(z.literal("")),

  order: z
    .number()
    .int("A ordem deve ser um número inteiro.")
    .min(1, "A ordem deve ser maior que zero."),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;