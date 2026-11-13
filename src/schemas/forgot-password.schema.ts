import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Por favor, insira um email válido.").trim(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
