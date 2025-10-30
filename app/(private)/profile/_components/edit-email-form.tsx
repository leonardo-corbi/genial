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
import { updateEmail } from "../actions";
import { tryCatch } from "@/hooks/try-catch";

const emailSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EditEmailFormProps {
  currentEmail: string;
}

export function EditEmailForm({ currentEmail }: EditEmailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  function handleCancel() {
    setIsEditing(false);
    form.reset({ email: currentEmail });
  }

  function onSubmit(data: EmailFormData) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateEmail(data));

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
        <p className="text-lg font-semibold">{currentEmail}</p>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Digite seu e-mail"
                />
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
