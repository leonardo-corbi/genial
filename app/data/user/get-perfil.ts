import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getPerfil() {
  const user = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      perfilInvestidor: true,
    },
  });

  if (!userData) {
    throw new Error("Usuário não encontrado");
  }

  const perfilNumerico =
    userData.perfilInvestidor === "Conservador"
      ? 0
      : userData.perfilInvestidor === "Moderado"
      ? 1
      : 2;

  return perfilNumerico;
}

export type PerfilType = Awaited<ReturnType<typeof getPerfil>>;
