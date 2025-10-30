import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getAtivos() {
  const user = await requireUser();

  const data = await prisma.ativo.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      nome: true,
      risco: true,
      valorInvestido: true,
    },
  });

  return data.map((ativo) => ({
    ...ativo,
    valorInvestido: ativo.valorInvestido.toString(),
  }));
}

export type AtivosType = Awaited<ReturnType<typeof getAtivos>>;
