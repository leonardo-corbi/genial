"use server";

import { auth } from "@/lib/auth";
import { getTranslatedAuthError } from "@/lib/auth-translations";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      message: "Login realizado com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: getTranslatedAuthError(error as Error, "Erro ao realizar login"),
    };
  }
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  perfilInvestidor: "Conservador" | "Moderado" | "Arrojado"
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        perfilInvestidor,
      },
    });

    return {
      success: true,
      message: "Registro realizado com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: getTranslatedAuthError(error as Error, "Erro ao criar conta"),
    };
  }
};
