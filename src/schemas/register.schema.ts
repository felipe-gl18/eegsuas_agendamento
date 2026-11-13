import { z } from "zod";

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "O nome deve conter pelo menos 3 caracteres.")
      .max(100, "O nome deve conter no máximo 100 caracteres."),

    email: z
      .string()
      .trim()
      .email("Por favor, insira um endereço de e-mail válido."),

    cpf: z
      .string()
      .trim()
      .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 dígitos."),

    password: z
      .string()
      .min(8, "A senha deve conter pelo menos 8 caracteres.")
      .max(128, "A senha deve conter no máximo 128 caracteres."),

    confirmPassword: z.string().min(1, "Por favor, confirme sua senha."),

    universityId: z.uuid().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
