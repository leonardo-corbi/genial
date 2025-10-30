export type RiscoNumerico = 0 | 1 | 2;
export type StatusAdequacao =
  | "Adequado"
  | "Parcialmente adequado"
  | "Inadequado";
export type Recomendacao =
  | "Compra recomendada"
  | "Compre com cautela"
  | "Não recomendado para seu perfil";

export interface AnaliseAdequacao {
  status: StatusAdequacao;
  recomendacao: Recomendacao;
  explicacao: string;
  alertas: string[];
  impactoRisco: number;
  impactoDiversificacao: string;
  rentabilidadePotencial: string;
  volatilidade: string;
}

export function riscoParaNumero(risco: string): RiscoNumerico {
  return risco === "Baixo" ? 0 : risco === "Médio" ? 1 : 2;
}

export function perfilParaTexto(perfil: number): string {
  return perfil === 0 ? "Conservador" : perfil === 1 ? "Moderado" : "Arrojado";
}

export function calcularRiscoCarteira(
  ativos: { risco: string; valorInvestido: string }[]
): number {
  if (ativos.length === 0) return 0;

  const valorTotal = ativos.reduce(
    (sum, ativo) => sum + Number(ativo.valorInvestido),
    0
  );
  if (valorTotal === 0) return 0;

  const riscoMedio = ativos.reduce((sum, ativo) => {
    const peso = Number(ativo.valorInvestido) / valorTotal;
    return sum + riscoParaNumero(ativo.risco) * peso;
  }, 0);

  return riscoMedio;
}

export function analisarAdequacao(
  riscoAtivo: RiscoNumerico,
  perfilInvestidor: number,
  riscoCarteiraAtual: number,
  riscoCarteiraComNovo: number,
  valorOrdem: number,
  valorCarteiraAtual: number
): AnaliseAdequacao {
  const diferencaRisco = Math.abs(riscoAtivo - perfilInvestidor);
  const alertas: string[] = [];
  const proporcaoNovo = valorOrdem / (valorCarteiraAtual + valorOrdem);

  // Alertas baseados no risco
  if (riscoAtivo === 2) {
    alertas.push("⚠️ Alta volatilidade esperada");
  }

  if (proporcaoNovo > 0.3) {
    alertas.push("⚠️ Ordem representa mais de 30% da carteira");
  }

  if (valorOrdem < 100) {
    alertas.push("ℹ️ Valor baixo - custos operacionais podem impactar retorno");
  }

  if (riscoAtivo === 2 && perfilInvestidor === 0) {
    alertas.push("⚠️ Risco muito acima do seu perfil conservador");
  }

  // Análise de diversificação
  let impactoDiversificacao: string;
  const variacaoRisco = Math.abs(riscoCarteiraComNovo - riscoCarteiraAtual);

  if (valorCarteiraAtual === 0) {
    impactoDiversificacao = "Será seu primeiro ativo na carteira";
  } else if (variacaoRisco < 0.3) {
    impactoDiversificacao = "Mantém o equilíbrio da carteira ✓";
  } else if (riscoCarteiraComNovo > riscoCarteiraAtual) {
    impactoDiversificacao = "Aumenta o risco geral da carteira ↑";
  } else {
    impactoDiversificacao = "Reduz o risco geral da carteira ↓";
  }

  // Rentabilidade potencial e volatilidade
  const rentabilidadeMap: Record<RiscoNumerico, string> = {
    0: "5-8% ao ano (mais estável)",
    1: "8-15% ao ano (moderada)",
    2: "15-30% ao ano (alta variação)",
  };

  const volatilidade =
    riscoAtivo === 0
      ? "Baixa - variações pequenas esperadas"
      : riscoAtivo === 1
      ? "Média - variações moderadas esperadas"
      : "Alta - grandes variações possíveis";

  const rentabilidadePotencial = rentabilidadeMap[riscoAtivo];

  // Determinar status e recomendação
  let status: StatusAdequacao;
  let recomendacao: Recomendacao;
  let explicacao: string;

  const impactoRisco =
    ((riscoCarteiraComNovo - riscoCarteiraAtual) / (riscoCarteiraAtual || 1)) *
    100;

  if (diferencaRisco === 0) {
    // Risco do ativo é exatamente o perfil do investidor
    status = "Adequado";
    recomendacao = "Compra recomendada";
    explicacao = `Este ativo está perfeitamente alinhado com seu perfil ${perfilParaTexto(
      perfilInvestidor
    ).toLowerCase()}. O risco é adequado para seu objetivo de investimento.`;
  } else if (diferencaRisco === 1) {
    // Risco do ativo difere em 1 nível do perfil
    if (riscoAtivo < perfilInvestidor) {
      status = "Adequado";
      recomendacao = "Compra recomendada";
      explicacao = `Este ativo tem risco um pouco abaixo do seu perfil ${perfilParaTexto(
        perfilInvestidor
      ).toLowerCase()}, o que pode ser interessante para equilibrar a carteira com opções mais conservadoras.`;
    } else {
      status = "Parcialmente adequado";
      recomendacao = "Compre com cautela";
      explicacao = `Este ativo tem risco ligeiramente acima do seu perfil ${perfilParaTexto(
        perfilInvestidor
      ).toLowerCase()}. Considere o valor investido e certifique-se de estar confortável com a volatilidade adicional.`;
      alertas.unshift("⚠️ Risco acima do seu perfil - avalie cuidadosamente");
    }
  } else {
    // Risco do ativo difere em 2 níveis do perfil (máximo)
    status = "Inadequado";
    recomendacao = "Não recomendado para seu perfil";
    if (riscoAtivo > perfilInvestidor) {
      explicacao = `Este ativo possui nível de risco muito superior ao seu perfil ${perfilParaTexto(
        perfilInvestidor
      ).toLowerCase()}. A volatilidade pode causar perdas significativas e gerar desconforto emocional. Recomendamos buscar alternativas mais adequadas ao seu perfil.`;
      alertas.unshift("🚫 Risco incompatível com seu perfil");
    } else {
      explicacao = `Este ativo é muito conservador para seu perfil ${perfilParaTexto(
        perfilInvestidor
      ).toLowerCase()}. Você pode estar deixando de lado oportunidades de maior retorno compatíveis com sua tolerância a risco.`;
      alertas.unshift("ℹ️ Ativo muito conservador para seu perfil");
    }
  }

  return {
    status,
    recomendacao,
    explicacao,
    alertas,
    impactoRisco,
    impactoDiversificacao,
    rentabilidadePotencial,
    volatilidade,
  };
}
