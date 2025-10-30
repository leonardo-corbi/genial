"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Loader2, Check, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updatePerfilInvestidor } from "../actions";
import { tryCatch } from "@/hooks/try-catch";

const perfilSchema = z.object({
  perfilInvestidor: z.enum(["Conservador", "Moderado", "Arrojado"], {
    message: "Selecione um perfil válido",
  }),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

interface EditPerfilFormProps {
  currentPerfil: "Conservador" | "Moderado" | "Arrojado";
}

export function EditPerfilForm({ currentPerfil }: EditPerfilFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      perfilInvestidor: currentPerfil,
    },
  });

  function handleCancel() {
    setIsEditing(false);
    form.reset({ perfilInvestidor: currentPerfil });
  }

  function onSubmit(data: PerfilFormData) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updatePerfilInvestidor(data)
      );

      if (error) {
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  const perfilColors = {
    Conservador: "text-green-600 dark:text-green-500",
    Moderado: "text-yellow-600 dark:text-yellow-500",
    Arrojado: "text-red-600 dark:text-red-500",
  };

  const perfilBorderColors = {
    Conservador: "border-green-300 dark:border-green-800",
    Moderado: "border-yellow-300 dark:border-yellow-800",
    Arrojado: "border-red-300 dark:border-red-800",
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <div
          className={`inline-block px-4 py-2 rounded-lg bg-secondary/50 border-2 ${perfilBorderColors[currentPerfil]}`}
        >
          <p className={`text-2xl font-bold ${perfilColors[currentPerfil]}`}>
            {currentPerfil}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="perfilInvestidor"
          render={({ field }) => (
            <FormItem>
              <DropdownMenu>
                <FormControl>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full justify-between"
                    >
                      <span className={perfilColors[field.value]}>
                        {field.value || "Selecione o perfil"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </FormControl>
                <DropdownMenuContent
                  align="start"
                  className="w-[var(--radix-dropdown-menu-trigger-width)] space-y-1 p-2"
                >
                  <DropdownMenuItem
                    onClick={() => field.onChange("Conservador")}
                    className="bg-card hover:bg-accent cursor-pointer"
                  >
                    <span className={perfilColors.Conservador}>
                      Conservador
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => field.onChange("Moderado")}
                    className="bg-card hover:bg-accent cursor-pointer"
                  >
                    <span className={perfilColors.Moderado}>Moderado</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => field.onChange("Arrojado")}
                    className="bg-card hover:bg-accent cursor-pointer"
                  >
                    <span className={perfilColors.Arrojado}>Arrojado</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending} className="flex-1">
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Salvar
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={pending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
