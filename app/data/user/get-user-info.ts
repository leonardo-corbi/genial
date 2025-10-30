import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getUserInfo() {
  const user = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      perfilInvestidor: true,
      createdAt: true,
    },
  });

  if (!userData) {
    throw new Error("Usuário não encontrado");
  }

  return userData;
}

export type UserInfoType = Awaited<ReturnType<typeof getUserInfo>>;
