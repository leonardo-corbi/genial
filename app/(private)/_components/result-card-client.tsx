"use client";

import { OrdemSchemaType } from "@/lib/zodSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Shield,
  Lightbulb,
  Activity,
} from "lucide-react";
import {
  riscoParaNumero,
  perfilParaTexto,
  calcularRiscoCarteira,
  analisarAdequacao,
} from "@/lib/result-card.logic";
import { AtivosType } from "@/app/data/user/get-ativos";
import { PerfilType } from "@/app/data/user/get-perfil";

interface ResultCardClientProps {
  ordem: OrdemSchemaType;
  ativos: AtivosType;
  perfil: PerfilType;
}

export function ResultCardClient({
  ordem,
  ativos,
  perfil,
}: ResultCardClientProps) {
  const riscoAtivoNum = riscoParaNumero(ordem.risco);
  const valorOrdemNum = Number(ordem.valorOrdem);

  const valorCarteiraAtual = ativos.reduce(
    (sum, ativo) => sum + Number(ativo.valorInvestido),
    0
  );

  const riscoCarteiraAtual = calcularRiscoCarteira(ativos);
  const riscoCarteiraComNovo = calcularRiscoCarteira([
    ...ativos,
    { risco: ordem.risco, valorInvestido: ordem.valorOrdem },
  ]);

  const analise = analisarAdequacao(
    riscoAtivoNum,
    perfil,
    riscoCarteiraAtual,
    riscoCarteiraComNovo,
    valorOrdemNum,
    valorCarteiraAtual
  );

  const StatusIcon =
    analise.status === "Adequado"
      ? CheckCircle2
      : analise.status === "Parcialmente adequado"
      ? AlertCircle
      : XCircle;

  const statusColor =
    analise.status === "Adequado"
      ? "text-green-600 dark:text-green-500"
      : analise.status === "Parcialmente adequado"
      ? "text-yellow-600 dark:text-yellow-500"
      : "text-red-600 dark:text-red-500";

  const recomendacaoColor =
    analise.recomendacao === "Compra recomendada"
      ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800"
      : analise.recomendacao === "Compre com cautela"
      ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800"
      : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Análise de Adequação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status de Adequação */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${statusColor}`} />
            <h3 className="font-semibold text-lg">
              Status: <span className={statusColor}>{analise.status}</span>
            </h3>
          </div>
        </div>

        {/* Recomendação */}
        <div
          className={`p-4 rounded-lg border-2 ${recomendacaoColor} font-semibold text-center`}
        >
          {analise.recomendacao}
        </div>

        {/* Informações do Ativo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ativo</p>
            <p className="font-semibold">{ordem.ativo}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Valor da Ordem</p>
            <p className="font-semibold">
              R${" "}
              {valorOrdemNum.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Risco */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Análise de Risco</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risco do Ativo</p>
              <p
                className={`font-semibold ${
                  ordem.risco === "Baixo"
                    ? "text-green-600 dark:text-green-500"
                    : ordem.risco === "Médio"
                    ? "text-yellow-600 dark:text-yellow-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {ordem.risco}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seu Perfil</p>
              <p className="font-semibold">{perfilParaTexto(perfil)}</p>
            </div>
          </div>

          {/* Impacto na Carteira */}
          <div className="p-3 rounded-md bg-secondary/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Impacto no Risco da Carteira
              </span>
              {analise.impactoRisco > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : analise.impactoRisco < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <Activity className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {valorCarteiraAtual === 0
                ? "Primeiro ativo da carteira"
                : analise.impactoRisco > 5
                ? `Aumenta o risco em ${analise.impactoRisco.toFixed(1)}%`
                : analise.impactoRisco < -5
                ? `Reduz o risco em ${Math.abs(analise.impactoRisco).toFixed(
                    1
                  )}%`
                : "Impacto mínimo no risco geral"}
            </p>
          </div>
        </div>

        {/* Expectativas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Expectativas</h4>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-md bg-secondary/30">
              <p className="text-sm font-medium mb-1">
                Rentabilidade Potencial
              </p>
              <p className="text-sm text-muted-foreground">
                {analise.rentabilidadePotencial}
              </p>
            </div>

            <div className="p-3 rounded-md bg-secondary/30">
              <p className="text-sm font-medium mb-1">Volatilidade</p>
              <p className="text-sm text-muted-foreground">
                {analise.volatilidade}
              </p>
            </div>

            <div className="p-3 rounded-md bg-secondary/30">
              <p className="text-sm font-medium mb-1">Diversificação</p>
              <p className="text-sm text-muted-foreground">
                {analise.impactoDiversificacao}
              </p>
            </div>
          </div>
        </div>

        {/* Explicação */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Por que essa recomendação?</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analise.explicacao}
          </p>
        </div>

        {/* Alertas */}
        {analise.alertas.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold">Pontos de Atenção</h4>
            </div>
            <ul className="space-y-2">
              {analise.alertas.map((alerta, index) => (
                <li
                  key={index}
                  className="text-sm p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                >
                  {alerta}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
