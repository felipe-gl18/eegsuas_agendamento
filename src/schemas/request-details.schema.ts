
import { z } from "zod";

export const requestDetailsSchema = z
  .object({
    requestType: z.enum(
      ["estagio", "pesquisa", "extensao", "visita-tecnica"],
      {
        error: "Selecione o tipo de solicitação de parceria",
      },
    ),

    institution: z
      .string()
      .trim()
      .min(1, "O nome da instituição é obrigatório"),

    locations: z
      .string()
      .trim()
      .min(1, "Informe os locais previstos para execução"),

    participants: z
      .string()
      .min(1, "Informe a quantidade de participantes")
      .regex(/^[1-9]\d*$/, "Informe um número inteiro maior que zero"),

    startDate: z
      .string()
      .min(1, "A data de início é obrigatória")
      .refine(
        (value) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

          const date = new Date(`${value}T00:00:00`);
          return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
          );
        },
        "Informe uma data de início válida",
      ),

    endDate: z
      .string()
      .min(1, "A data de término é obrigatória")
      .refine(
        (value) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

          const date = new Date(`${value}T00:00:00`);
          return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
          );
        },
        "Informe uma data de término válida",
      ),

    activityDescription: z
      .string()
      .trim()
      .min(1, "A descrição da atividade é obrigatória"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;

      return data.endDate >= data.startDate;
    },
    {
      message: "A data de término não pode ser anterior à data de início",
      path: ["endDate"],
    },
  );

export type RequestDetailsFormValues = z.infer<
  typeof requestDetailsSchema
>;
