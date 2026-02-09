export interface SubjectDay {
  topic: string;
  videoId: string;
  type: string;
}

export interface DaySchedule {
  port: SubjectDay;
  math: SubjectDay;
}

// Lista oficial baseada no pedido do usuário
export const SCHEDULE_POOL: DaySchedule[] = [
  { // Dia 1
    port: { topic: "Leitura, Compreensão e Tipologia Textual", videoId: "ibwf_X3498c", type: "interpretation" },
    math: { topic: "Números Naturais, Operações e Expressões", videoId: "Rz2tC2-lmps", type: "expressions" }
  },
  { // Dia 2
    port: { topic: "Fonologia: Ortografia, Hífen e Encontros", videoId: "texjKRIwdkg", type: "phonology" },
    math: { topic: "Conjuntos, MMC e MDC", videoId: "F6Rf8xcYeEM", type: "sets_mmc" }
  },
  { // Dia 3
    port: { topic: "Acentuação Gráfica e Pontuação", videoId: "iantslTXQuc", type: "accentuation" },
    math: { topic: "Razão, Proporção e Regra de Três", videoId: "nk3VE7ChRNg", type: "proportions" }
  },
  { // Dia 4
    port: { topic: "Estrutura e Formação de Palavras", videoId: "U_nRXQh5L40", type: "morphology_structure" }, 
    math: { topic: "Porcentagem e Juros Simples/Compostos", videoId: "ZxhZpTcNgX8", type: "percentage_interest" }
  },
  { // Dia 5
    port: { topic: "Classes de Palavras (Variáveis - Verbos/Subst)", videoId: "rLDssOIZyMQ", type: "morphology_classes" },
    math: { topic: "Equações de 1º e 2º Graus", videoId: "ss2VqSeqRQI", type: "equations" }
  },
  { // Dia 6
    port: { topic: "Classes de Palavras (Invariáveis - Prep/Conj)", videoId: "tnaqnnRkUrs", type: "morphology_invariable" },
    math: { topic: "Progressões (PA e PG)", videoId: "XeIohrmZtbA", type: "progressions" }
  },
  { // Dia 7
    port: { topic: "Sintaxe: Termos da Oração", videoId: "pnS0hL063do", type: "syntax_terms" },
    math: { topic: "Estatística Básica (Média, Moda, Mediana)", videoId: "hhzLCauJwJg", type: "statistics" }
  },
  { // Dia 8
    port: { topic: "Período Composto (Coordenação e Subordinação)", videoId: "tKr8FuXChbo", type: "syntax_period" },
    math: { topic: "Análise Combinatória", videoId: "4zMFrPhCkbE", type: "combinatorics" }
  },
  { // Dia 9
    port: { topic: "Concordância Nominal e Verbal", videoId: "AnZEqlTnsUo", type: "concordance" },
    math: { topic: "Probabilidade", videoId: "FwQ-fjrQXac", type: "probability" }
  },
  { // Dia 10
    port: { topic: "Regência e Colocação Pronominal", videoId: "Tc2bIE-euuw", type: "regencia_placement" },
    math: { topic: "Medidas (Comprimento, Volume, Massa)", videoId: "1NO5XvAJXaw", type: "measures" }
  },
  { // Dia 11
    port: { topic: "Vícios de Linguagem e Crase", videoId: "yUpRa62vcSI", type: "crase_vices" },
    math: { topic: "Noções de Lógica (Tabela Verdade)", videoId: "KsdFf1QGA0M", type: "logic" }
  }
];