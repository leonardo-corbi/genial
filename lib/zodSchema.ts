import { z } from "zod";

export const ativoRisco = ["Baixo", "Médio", "Alto"] as const;
export const ordemRisco = ["Baixo", "Médio", "Alto"] as const;
export const perfilInvestidor = [
  "Conservador",
  "Moderado",
  "Arrojado",
] as const;

export const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "E-mail inválido" }),
    perfilInvestidor: z.enum(perfilInvestidor, {
      message: "Selecione um perfil de investidor",
    }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const ativoSchema = z.object({
  ativo: z
    .string()
    .min(2, { message: "O nome do ativo deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome do ativo deve ter no máximo 50 caracteres" }),
  risco: z.enum(ativoRisco, {
    message: "Selecione um nível de risco",
  }),
  valorInvestido: z
    .string()
    .min(1, { message: "Informe o valor investido" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O valor deve ser um número positivo",
    }),
});

export const ordemSchema = z.object({
  ativo: z
    .string()
    .min(2, { message: "O nome do ativo deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome do ativo deve ter no máximo 50 caracteres" }),
  risco: z.enum(ordemRisco, {
    message: "Selecione um nível de risco",
  }),
  valorOrdem: z
    .string()
    .min(1, { message: "Informe o valor da ordem" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O valor deve ser um número positivo",
    }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type AtivoSchemaType = z.infer<typeof ativoSchema>;
export type OrdemSchemaType = z.infer<typeof ordemSchema>;
