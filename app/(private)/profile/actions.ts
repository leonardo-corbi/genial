"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

// Schema para atualizar nome
const updateNameSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
});

// Schema para atualizar email
const updateEmailSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

// Schema para atualizar perfil
const updatePerfilSchema = z.object({
  perfilInvestidor: z.enum(["Conservador", "Moderado", "Arrojado"], {
    message: "Selecione um perfil válido",
  }),
});

export async function updateName(data: { name: string }) {
  try {
    const user = await requireUser();

    // Validação
    const validated = updateNameSchema.parse(data);

    // Atualizar no banco
    await prisma.user.update({
      where: { id: user.id },
      data: { name: validated.name },
    });

    revalidatePath("/profile");

    return {
      status: "success" as const,
      message: "Nome atualizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error" as const,
        message: error.issues[0].message,
      };
    }

    return {
      status: "error" as const,
      message: "Erro ao atualizar nome. Tente novamente.",
    };
  }
}

export async function updateEmail(data: { email: string }) {
  try {
    const user = await requireUser();

    // Validação
    const validated = updateEmailSchema.parse(data);

    // Verificar se email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser && existingUser.id !== user.id) {
      return {
        status: "error" as const,
        message: "Este email já está em uso.",
      };
    }

    // Atualizar no banco
    await prisma.user.update({
      where: { id: user.id },
      data: { email: validated.email },
    });

    revalidatePath("/profile");

    return {
      status: "success" as const,
      message: "E-mail atualizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error" as const,
        message: error.issues[0].message,
      };
    }

    return {
      status: "error" as const,
      message: "Erro ao atualizar email. Tente novamente.",
    };
  }
}

export async function updatePerfilInvestidor(data: {
  perfilInvestidor: "Conservador" | "Moderado" | "Arrojado";
}) {
  try {
    const user = await requireUser();

    // Validação
    const validated = updatePerfilSchema.parse(data);

    // Atualizar no banco
    await prisma.user.update({
      where: { id: user.id },
      data: { perfilInvestidor: validated.perfilInvestidor },
    });

    revalidatePath("/profile");
    revalidatePath("/"); // Revalidar página principal pois usa o perfil

    return {
      status: "success" as const,
      message: "Perfil de investidor atualizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error" as const,
        message: error.issues[0].message,
      };
    }

    return {
      status: "error" as const,
      message: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}
