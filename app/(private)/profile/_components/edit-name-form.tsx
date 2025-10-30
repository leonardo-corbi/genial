"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateName } from "../actions";
import { tryCatch } from "@/hooks/try-catch";

const nameSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
});

type NameFormData = z.infer<typeof nameSchema>;

interface EditNameFormProps {
  currentName: string;
}

export function EditNameForm({ currentName }: EditNameFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: currentName,
    },
  });

  function handleCancel() {
    setIsEditing(false);
    form.reset({ name: currentName });
  }

  function onSubmit(data: NameFormData) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateName(data));

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

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{currentName}</p>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Digite seu nome" />
              </FormControl>
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
