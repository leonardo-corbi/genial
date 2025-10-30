"use client";

import { Package, Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { AtivosType } from "@/app/data/user/get-ativos";
import { deleteAtivo } from "../actions";
import { tryCatch } from "@/hooks/try-catch";

interface AtivosListProps {
  ativos: AtivosType;
}

export function AtivosList({ ativos }: AtivosListProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete(ativoId: string) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteAtivo(ativoId));

      if (error) {
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Meus Ativos</h3>

      {ativos.length === 0 ? (
        <Empty className="border-0 p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyDescription>Nenhum ativo cadastrado</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {ativos.map((ativo) => (
            <div
              key={ativo.id}
              className="rounded-md border bg-secondary/30 p-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{ativo.nome}</h4>
                <span className="text-xs text-muted-foreground">
                  Risco:{" "}
                  <span
                    className={`font-medium ${
                      ativo.risco === "Baixo"
                        ? "text-green-600"
                        : ativo.risco === "Médio"
                        ? "text-yellow-600"
                        : ativo.risco === "Alto"
                        ? "text-red-600"
                        : "text-white"
                    }`}
                  >
                    {ativo.risco}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    R${" "}
                    {Number(ativo.valorInvestido).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(ativo.id)}
                  disabled={pending}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
