import { Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AtivosForm } from "./_components/ativos-form";
import { AtivosList } from "./_components/ativos-list";
import { OrdemSection } from "./_components/ordem-section";
import { getAtivos } from "../data/user/get-ativos";
import { getPerfil } from "../data/user/get-perfil";

export default async function Home() {
  const ativos = await getAtivos();
  const perfil = await getPerfil();

  return (
    <div className="container mx-auto mt-8 space-y-8 pb-8">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Carteira atual</CardTitle>
          <CardDescription>
            Gerencie seus ativos e investimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AtivosForm />
            <AtivosList ativos={ativos} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Nova ordem de compra
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="font-semibold mb-2">O que é Suitability?</p>
                <p className="text-sm ">
                  A análise de suitability verifica se a nova ordem de compra é
                  adequada ao seu perfil de investimento. O sistema analisa os
                  ativos já presentes na sua carteira, compara o nível de risco
                  da nova compra e avalia se essa operação está alinhada com sua
                  estratégia de investimentos e tolerância ao risco.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            Crie uma nova ordem de compra para um dos seus ativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdemSection ativos={ativos} perfil={perfil} />
        </CardContent>
      </Card>
    </div>
  );
}
