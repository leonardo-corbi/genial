"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { OrdemSchemaType, ordemSchema } from "@/lib/zodSchema";

export function OrdemForm() {
  const form = useForm<OrdemSchemaType>({
    resolver: zodResolver(ordemSchema),
    defaultValues: {
      ativo: "",
      risco: undefined, 
      valorOrdem: "",
    },
  });

  function onSubmit() {
    console.log("oi");
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do ativo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Petrobras, Bitcoin, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="risco"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center gap-2">
                  <FormLabel>Risco</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        <strong>Baixo:</strong> Menor volatilidade, retornos
                        mais estáveis
                        <br />
                        <strong>Médio:</strong> Equilíbrio entre risco e retorno
                        <br />
                        <strong>Alto:</strong> Maior volatilidade, potencial de
                        retornos elevados
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <DropdownMenu>
                  <FormControl>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-between bg-transparent"
                      >
                        {field.value || "Selecione o risco"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </FormControl>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] space-y-1 p-2"
                  >
                    <DropdownMenuItem
                      onClick={() => field.onChange("Baixo")}
                      className="bg-card hover:bg-accent cursor-pointer"
                    >
                      Baixo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => field.onChange("Médio")}
                      className="bg-card hover:bg-accent cursor-pointer"
                    >
                      Médio
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => field.onChange("Alto")}
                      className="bg-card hover:bg-accent cursor-pointer"
                    >
                      Alto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorOrdem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da ordem</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 5000.00"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Button
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        className="w-full h-10 mt-6"
      >
        Validar
      </Button>
    </>
  );
}
