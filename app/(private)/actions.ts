"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { ativoSchema, AtivoSchemaType } from "@/lib/zodSchema";
import { requireUser } from "@/app/data/user/require-user";

export async function createAtivo(
  values: AtivoSchemaType
): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const validation = ativoSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Dados do formulário inválidos",
      };
    }

    await prisma.ativo.create({
      data: {
        nome: validation.data.ativo,
        risco: validation.data.risco,
        valorInvestido: validation.data.valorInvestido,
        userId: session.id,
      },
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Ativo criado com sucesso",
    };
  } catch {
    return {
      status: "error",
      message: "Falha ao criar ativo",
    };
  }
}

export async function deleteAtivo(ativoId: string): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const ativo = await prisma.ativo.findUnique({
      where: { id: ativoId },
    });

    if (!ativo) {
      return {
        status: "error",
        message: "Ativo não encontrado",
      };
    }

    if (ativo.userId !== session.id) {
      return {
        status: "error",
        message: "Você não tem permissão para deletar este ativo",
      };
    }

    await prisma.ativo.delete({
      where: { id: ativoId },
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Ativo deletado com sucesso",
    };
  } catch {
    return {
      status: "error",
      message: "Falha ao deletar ativo",
    };
  }
}
