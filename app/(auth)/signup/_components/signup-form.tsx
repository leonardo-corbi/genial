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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getTranslatedAuthError } from "@/lib/auth-translations";
import { SignupSchemaType, signupSchema } from "@/lib/zodSchema";
import { signUp } from "@/server/users";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      perfilInvestidor: undefined,
      password: "",
      confirmPassword: "",
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

  async function onSubmit(values: SignupSchemaType) {
    startTransition(async () => {
      try {
        const { success, message } = await signUp(
          values.name,
          values.email,
          values.password,
          values.perfilInvestidor
        );
        if (success) {
          toast.success(message as string);
          window.location.href = "/";
        } else {
          toast.error(message as string);
        }
      } catch {
        toast.error("Erro ao criar conta");
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
                Já tem uma conta? <Link href="/login">Login</Link>
              </FieldDescription>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="perfilInvestidor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil de investidor</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um perfil de investidor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservador">Conservador</SelectItem>
                        <SelectItem value="Moderado">Moderado</SelectItem>
                        <SelectItem value="Arrojado">Arrojado</SelectItem>
                      </SelectContent>
                    </Select>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Criando conta..." : "Criar conta"}
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
