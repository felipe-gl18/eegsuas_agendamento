
import { z } from "zod";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const isValidCPF = (cpf: string) => {
  cpf = onlyDigits(cpf);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (base: string, factor: number) => {
    let total = 0;

    for (const digit of base) {
      total += Number(digit) * factor--;
      if (factor < 2) factor = 9;
    }

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  const secondDigit = calculateDigit(cpf.slice(0, 9) + firstDigit, 11);

  return cpf === cpf.slice(0, 9) + firstDigit + secondDigit;
};

const isValidCNPJ = (cnpj: string) => {
  cnpj = onlyDigits(cnpj);

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const calculateDigit = (base: string) => {
    const weights =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const total = [...base].reduce(
      (sum, digit, index) => sum + Number(digit) * weights[index],
      0,
    );

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cnpj.slice(0, 12));
  const secondDigit = calculateDigit(cnpj.slice(0, 12) + firstDigit);

  return cnpj === cnpj.slice(0, 12) + firstDigit + secondDigit;
};

const isValidDocument = (value: string) => {
  const digits = onlyDigits(value);

  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);

  return false;
};

const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Informe um e-mail válido",
  );

export const applicantSchema = z.object({
  document: z
    .string()
    .trim()
    .refine(isValidDocument, "Informe um CPF ou CNPJ válido"),

  name: z.string().trim().min(1, "Nome / Razão Social é obrigatório"),

  email: optionalEmail,

  area: z.union([
    z.literal(""),
    z.coerce.number().min(0, "A área não pode ser negativa"),
  ]).optional(),

  phone1: z
    .string()
    .trim()
    .min(1, "O telefone principal é obrigatório"),

  phone2: z.string().optional().default(""),
  phone3: z.string().optional().default(""),

  phone1Whatsapp: z.boolean().default(false),
  phone2Whatsapp: z.boolean().default(false),
  phone3Whatsapp: z.boolean().default(false),

  protocol: z.string().optional().default(""),
  observation: z.string().optional().default(""),
});

export type ApplicantFormValues = z.infer<typeof applicantSchema>;
