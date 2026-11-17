import { z } from "zod";

export const formationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(150, "O nome deve conter no máximo 150 caracteres."),

  description: z
    .string()
    .trim()
    .min(10, "A descrição deve conter pelo menos 10 caracteres.")
    .max(2000, "A descrição deve conter no máximo 2000 caracteres."),

  workloadHours: z
    .number()
    .int("Informe um número inteiro.")
    .min(1, "A carga horária mínima é de 1 hora.")
    .max(5000, "A carga horária máxima é de 5000 horas."),
});

export type FormationFormData = z.infer<typeof formationSchema>;
