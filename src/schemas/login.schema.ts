import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Por favor, insira um endereço de e-mail válido.").trim(),
  password: z.string().min(1, "A senha é obrigatória."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
