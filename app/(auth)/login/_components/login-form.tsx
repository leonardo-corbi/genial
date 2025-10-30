"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { GalleryVerticalEnd } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getTranslatedAuthError } from "@/lib/auth-translations";
import { LoginSchemaType, loginSchema } from "@/lib/zodSchema";
import { signIn } from "@/server/users";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logado com Google, você será redirecionado...");
            },
            onError: (error) => {
              const translatedError = getTranslatedAuthError(
                error,
                "Erro ao fazer login"
              );
              toast.error(translatedError);
            },
          },
        });
      } catch {
        toast.error("Erro ao fazer login com Google");
      }
    });
  }

  async function onSubmit(values: LoginSchemaType) {
    startTransition(async () => {
      try {
        const { success, message } = await signIn(
          values.email,
          values.password
        );
        if (success) {
          toast.success(message as string);
          window.location.href = "/";
        } else {
          toast.error(message as string);
        }
      } catch {
        toast.error("Erro ao fazer login");
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="sr-only">General Suitability</span>
              <h1 className="text-xl font-bold">
                Bem-vindo ao General Suitability
              </h1>
              <FieldDescription>
                Não tem uma conta? <Link href="/signup">Cadastre-se</Link>
              </FieldDescription>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Entrando..." : "Login"}
              </Button>
            </Field>
            <FieldSeparator>Ou</FieldSeparator>
            <Field className="flex">
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={signInWithGoogle}
                disabled={isGooglePending}
              >
                <FcGoogle size={4} />
                {isGooglePending ? "Conectando..." : "Continuar com Google"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </Form>
    </div>
  );
}
