import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve conter pelo menos 8 caracteres.")
      .max(128, "A senha deve conter no máximo 128 caracteres."),

    confirmPassword: z.string().min(1, "Por favor, confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
