import { z } from "zod";

export const trainingModuleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(150, "O nome deve ter no máximo 150 caracteres."),

  // Opcional: pode ficar vazia.
  description: z
    .string()
    .trim()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres."),
});

export type TrainingModuleFormData = z.infer<typeof trainingModuleSchema>;
