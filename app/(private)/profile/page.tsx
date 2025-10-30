import { User, Mail, TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { EditNameForm } from "./_components/edit-name-form";
import { EditEmailForm } from "./_components/edit-email-form";
import { EditPerfilForm } from "./_components/edit-perfil-form";

export default async function ProfilePage() {
  const user = await getUserInfo();

  const perfilDescriptions = {
    Conservador:
      "Você prefere investimentos de baixo risco, priorizando a segurança e estabilidade do seu capital.",
    Moderado:
      "Você busca um equilíbrio entre segurança e rentabilidade, aceitando riscos moderados.",
    Arrojado:
      "Você está disposto a assumir riscos maiores em busca de retornos mais elevados.",
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="container mx-auto mt-8 space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Visualize e edite suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Clique no ícone de lápis para editar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Nome completo</span>
              </div>
              <EditNameForm currentName={user.name} />
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>E-mail</span>
              </div>
              <EditEmailForm currentEmail={user.email} />
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membro desde</span>
              </div>
              <p className="text-lg font-semibold">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card de Perfil de Investidor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Perfil de Investidor
            </CardTitle>
            <CardDescription>
              Altere seu perfil clicando no ícone de lápis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Perfil atual</span>
              </div>
              <EditPerfilForm currentPerfil={user.perfilInvestidor} />
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <p className="text-sm font-medium">O que isso significa?</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {perfilDescriptions[user.perfilInvestidor]}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <span className="font-semibold">💡 Dica:</span> Alterar seu
                perfil afetará as análises de suitability futuras. As ordens já
                validadas não serão alteradas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Resumo dos Perfis */}
      <Card>
        <CardHeader>
          <CardTitle>Entenda os Perfis de Investidor</CardTitle>
          <CardDescription>
            Escolha o perfil que melhor se adequa ao seu objetivo e tolerância a
            risco
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200">
                Conservador
              </h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                Foca em preservação de capital com investimentos de baixo risco
                como renda fixa e títulos públicos.
              </p>
              <ul className="text-xs text-green-700 dark:text-green-400 space-y-1 mt-2">
                <li>• Menor volatilidade</li>
                <li>• Retornos estáveis</li>
                <li>• Prioriza segurança</li>
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-200">
                Moderado
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Equilibra segurança e retorno com uma carteira diversificada
                entre renda fixa e variável.
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1 mt-2">
                <li>• Volatilidade moderada</li>
                <li>• Diversificação balanceada</li>
                <li>• Risco controlado</li>
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-200">
                Arrojado
              </h4>
              <p className="text-sm text-red-800 dark:text-red-300">
                Busca maximizar retornos com maior tolerância a volatilidade e
                foco em renda variável.
              </p>
              <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 mt-2">
                <li>• Alta volatilidade</li>
                <li>• Potencial de retornos elevados</li>
                <li>• Maior exposição a risco</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
