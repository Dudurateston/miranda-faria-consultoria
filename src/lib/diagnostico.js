/**
 * diagnostico.js — Motor puro do instrumento Diagnóstico Miranda Faria
 *
 * Implementação rigorosa do modelo da Seção 4 da especificação:
 *  1. Cinco dores, cada cálculo devolve estritamente [piso, teto] (conservador por construção).
 *  2. Marketplace: volume do canal × faixa de comissão 12%-27% (iFood/ML).
 *  3. Planilha: lançamentos/mês × taxa de erro (0.3% estruturado a 6.6% manual PubMed PMID 38196643) × custo/erro.
 *  4. Curiosos: horas de interrupção (conversas × min/conversa × custoHora) × fator retomada (CHI 2005 57% interrupções).
 *  5. Pessoa: NÃO usa receita. Usa salário × multiplicador por impacto × (0.5 a 2.0)/12 (reposição SHRM/NAIC).
 *  6. Cego: MARGEM mensal (não receita) × fator frequência × 3%-8% (McKinsey Power of Pricing).
 *
 * Exporta também FONTES por dor (nível A/B/C) e a função que gera a "linha da conta" auditável.
 */

/**
 * Padrões de margem por setor quando o usuário não souber informar.
 */
export const SECTOR_MARGIN_DEFAULTS = {
  comercio: 0.15,
  servicos: 0.25,
  industria: 0.18,
  alimentacao: 0.12,
  padrao: 0.20,
};

/**
 * Modelo numérico puro. Cada função retorna [piso, teto].
 */
export const MODELO = {
  /**
   * Dor 1 · Marketplace (Nível A)
   * @param {number} receita - Receita mensal total (R$ / $)
   * @param {number} fatiaCanal - Proporção que passa por marketplace (0.20 | 0.35 | 0.60)
   * @returns {[number, number]} [piso, teto] do vazamento mensal
   */
  marketplace: (receita, fatiaCanal = 0.35, lang = 'pt') => {
    const volume = Math.max(0, receita) * Math.max(0, Math.min(1, fatiaCanal));
    const [lo, hi] = lang === 'pt' ? [0.12, 0.27] : [0.08, 0.20]; // PT: iFood/Mercado Livre; EN: Amazon/eBay/Etsy
    return [volume * lo, volume * hi];
  },

  /**
   * Dor 2 · Planilha e digitação (Nível B)
   * @param {number} lancamentosMes - Nº de lançamentos/pedidos operados manualmente por mês
   * @param {number} custoErro - Custo estimado por erro (declarado como estimativa no UI)
   * @returns {[number, number]} [piso, teto] do vazamento mensal
   */
  planilha: (lancamentosMes, custoErro = 50) => {
    const l = Math.max(0, lancamentosMes);
    const c = Math.max(0, custoErro);
    // 0.3% (0.003) = campo estruturado / digitação simples
    // 6.6% (0.066) = transcrição manual (PubMed PMID 38196643)
    return [l * 0.003 * c, l * 0.066 * c];
  },

  /**
   * Dor 3 · Muita conversa, pouca venda / Curiosos (Nível B/C)
   * Completa a função com base na literatura de interrupção:
   * Mark, González & Harris (CHI 2005) - 57% das esferas de trabalho são interrompidas,
   * exigindo >2 atividades intervenientes antes de retomar o foco.
   * @param {number} conversasMes - Nº de conversas/leads não qualificados por mês
   * @param {number} minutosPorConversa - Tempo médio por conversa em minutos
   * @param {number} custoHora - Custo por hora da pessoa/equipe envolvida
   * @returns {[number, number]} [piso, teto] do vazamento mensal
   */
  curiosos: (conversasMes, minutosPorConversa = 15, custoHora = 40) => {
    const conv = Math.max(0, conversasMes);
    const min = Math.max(0, minutosPorConversa);
    const custo = Math.max(0, custoHora);
    const horas = (conv * min) / 60;
    const fatorRetomada = 1.5; // CHI 2005: o custo do tempo perdido + atrito de recontextualização
    return [
      horas * custo * 0.5,           // piso: 50% de perda direta de foco
      horas * custo * fatorRetomada, // teto: horas acumuladas com fator de retomada
    ];
  },

  /**
   * Dor 4 · Dependência de pessoa-chave (Nível C / SHRM)
   * IMPORTANTE: Não usa receita (meta-análise Hancock et al. 2013 provou r = -0.03 entre turnover e desempenho).
   * Usa custo de reposição + rampa de contratação (SHRM: 50% a 200% do salário anual).
   * @param {number} salario - Salário mensal da pessoa-chave
   * @param {'atendimento' | 'processo' | 'documentado'} oQuePara - Nível de impacto se a pessoa sair
   * @returns {[number, number]} [piso, teto] do vazamento mensal diluído em 12 meses
   */
  pessoa: (salario, oQuePara = 'processo') => {
    const sal = Math.max(0, salario);
    const mult = { atendimento: 0.5, processo: 1.0, documentado: 0.0 }[oQuePara] ?? 1.0;
    // Custo anual SHRM (0.5 a 2.0 × salário anual) diluído em 12 meses
    const pisoAnual = sal * 12 * 0.50 * mult;
    const tetoAnual = sal * 12 * 2.00 * mult;
    return [pisoAnual / 12, tetoAnual / 12];
  },

  /**
   * Dor 5 · Decisão no escuro / Cego (Nível B/C)
   * IMPORTANTE: Usa MARGEM MENSAL (não receita).
   * @param {number} margemMes - Margem de lucro operacional mensal em moeda
   * @param {'sempre' | 'asvezes' | 'quase_nunca'} frequencia - Frequência de decisões no chute
   * @returns {[number, number]} [piso, teto] da margem deixada na mesa
   */
  cego: (margemMes, frequencia = 'sempre') => {
    const m = Math.max(0, margemMes);
    const f = { sempre: 1.0, asvezes: 0.5, quase_nunca: 0.15 }[frequencia] ?? 1.0;
    // McKinsey: otimização granular de preços e compras gera 3% a 8% de margem operacional
    return [m * 0.03 * f, m * 0.08 * f];
  },
};

/**
 * Metadados de fontes por dor com classificação rigorosa de evidência (A/B/C).
 */
export const FONTES = {
  marketplace: {
    nivel: 'A',
    origem: {
      pt: 'Tabelas oficiais de comissão do iFood (12–23% + taxas) e Mercado Livre (10–19%)',
      en: 'Public fee structures from Amazon (8–15%), Mercado Livre (10–19%) & delivery platforms (15–30%)',
    },
    referencia: 'Mercado Livre Vendedores (2024); iFood para Parceiros (2024); Amazon Seller Central Fee Schedule',
  },
  planilha: {
    nivel: 'B',
    origem: {
      pt: 'Meta-análise de 93 estudos de erro de digitação (PubMed PMID 38196643) e Panko (13 estudos)',
      en: 'PubMed meta-analysis of 93 data entry studies (PMID 38196643) & Panko spreadsheet error research',
    },
    referencia: 'PubMed PMID 38196643 (2024); Panko, R. R. (2008), What We Know About Spreadsheet Errors',
  },
  curiosos: {
    nivel: 'B/C',
    origem: {
      pt: 'Estudo de custo de interrupção CHI 2005 (Mark et al.) & pesquisa de resposta MIT/InsideSales',
      en: 'Work interruption study CHI 2005 (Mark et al.) & MIT/InsideSales Lead Response research',
    },
    referencia: 'Mark, González & Harris (2005) ACM CHI; Oldroyd / MIT-InsideSales Lead Response Audit (2007)',
  },
  pessoa: {
    nivel: 'C',
    origem: {
      pt: 'Benchmarks de substituição de pessoal SHRM (50–200% do salário) & pesquisa NAIC de risco operacional',
      en: 'SHRM replacement cost benchmarks (50–200% annual salary) & NAIC key person risk study',
    },
    referencia: 'Society for Human Resource Management (SHRM Turnover Report); NAIC Small Business Key Person Study',
  },
  cego: {
    nivel: 'B/C',
    origem: {
      pt: 'McKinsey (The Power of Pricing) & meta-análise de decisão estatística Grove et al. (2000)',
      en: 'McKinsey (The Power of Pricing) & Grove et al. (2000) statistical decision meta-analysis',
    },
    referencia: 'McKinsey & Co. The Power of Pricing; Grove et al. (2000) Psychological Assessment 12(1):19–30',
  },
};

/**
 * Recuperação de valor específica por dor (substitui a faixa genérica 35-60%).
 */
export const RECUPERACAO_ESPECIFICA = {
  marketplace: {
    pt: {
      titulo: 'Recuperação de margem por canal próprio',
      descricao: 'Economia direta da comissão sobre a fatia de clientes recorrentes migrada para pedido direto.',
    },
    en: {
      titulo: 'Margin recovery via direct channel',
      descricao: 'Direct commission savings on the portion of repeat customers migrated to direct ordering.',
    },
  },
  planilha: {
    pt: {
      titulo: 'Eliminação da taxa de erro operacional',
      descricao: 'Redução do erro de 6,6% (manual) para 0,3% (campo estruturado) em todos os processos automatizados.',
    },
    en: {
      titulo: 'Operational error rate elimination',
      descricao: 'Reduction of error rate from 6.6% (manual) down to 0.3% (structured input) across automated workflows.',
    },
  },
  curiosos: {
    pt: {
      titulo: 'Triagem automática e qualificação prévia',
      descricao: 'Filtro automático de dúvidas frequentes e orçamentos; o lead chega qualificado e a equipe foca em fechar.',
    },
    en: {
      titulo: 'Automated triage & pre-qualification',
      descricao: 'Automated filtering of FAQs and price requests; leads arrive qualified so your team focuses on closing.',
    },
  },
  pessoa: {
    pt: {
      titulo: 'Ativos no nome da empresa e processo documentado',
      descricao: 'A rotina e o histórico do cliente passam a viver no sistema da empresa, eliminando o risco de paralisação e rampa.',
    },
    en: {
      titulo: 'Company-owned assets & documented workflows',
      descricao: 'Routines and client histories live inside company systems, eliminating shutdown risks and hiring ramp friction.',
    },
  },
  cego: {
    pt: {
      titulo: 'Captura de margem com painel em tempo real',
      descricao: 'Habilitação da captura de 3% a 8% de margem adicional via precificação granular e controle de estoque em tempo real.',
    },
    en: {
      titulo: 'Margin capture via real-time dashboard',
      descricao: 'Unlocking 3% to 8% in additional margin through granular pricing and real-time inventory visibility.',
    },
  },
};

/**
 * Formata valor monetário simples de forma consistente.
 */
function fmtMoeda(val, lang = 'pt') {
  const round100 = Math.round(val / 100) * 100;
  if (lang === 'pt') {
    return 'R$ ' + round100.toLocaleString('pt-BR');
  }
  return '$' + round100.toLocaleString('en-US');
}

/**
 * Monta a "linha da conta" auditável que aparece visível na tela abaixo da manchete.
 * @param {'marketplace' | 'planilha' | 'curiosos' | 'pessoa' | 'cego'} dor
 * @param {object} inputs - Parâmetros usados no cálculo
 * @param {number} piso - Valor calculado do piso
 * @param {number} teto - Valor calculado do teto
 * @param {'pt' | 'en'} lang - Idioma da interface
 * @returns {string} Texto formatado da linha da conta
 */
export function montaLinhaConta(dor, inputs, piso, teto, lang = 'pt') {
  const isPt = lang === 'pt';
  const cur = isPt ? 'R$ ' : '$';

  switch (dor) {
    case 'marketplace': {
      const rec = inputs.receita || 0;
      const fatia = inputs.fatiaCanal || 0.35;
      const volumeCanal = rec * fatia;
      const pctStr = Math.round(fatia * 100) + '%';
      if (isPt) {
        return `${fmtMoeda(volumeCanal, 'pt')}/mês em marketplace (${pctStr} das vendas) × 12% a 27% = ${fmtMoeda(piso, 'pt')} a ${fmtMoeda(teto, 'pt')}/mês`;
      }
      return `${fmtMoeda(volumeCanal, 'en')}/mo in marketplaces (${pctStr} of sales) × 8% to 20% = ${fmtMoeda(piso, 'en')} to ${fmtMoeda(teto, 'en')}/mo`;
    }

    case 'planilha': {
      const lanc = inputs.lancamentosMes || 0;
      const custo = inputs.custoErro || 50;
      if (isPt) {
        return `${lanc.toLocaleString('pt-BR')} lançamentos/mês × 0,3% a 6,6% de erro × R$ ${custo}/erro = ${fmtMoeda(piso, 'pt')} a ${fmtMoeda(teto, 'pt')}/mês`;
      }
      return `${lanc.toLocaleString('en-US')} entries/mo × 0.3% to 6.6% error rate × $${custo}/error = ${fmtMoeda(piso, 'en')} to ${fmtMoeda(teto, 'en')}/mo`;
    }

    case 'curiosos': {
      const conv = inputs.conversasMes || 0;
      const min = inputs.minutosPorConversa || 15;
      const custoH = inputs.custoHora || 40;
      if (isPt) {
        return `${conv.toLocaleString('pt-BR')} conversas/mês × ${min} min × R$ ${custoH}/h × fator retomada (0,5 a 1,5) = ${fmtMoeda(piso, 'pt')} a ${fmtMoeda(teto, 'pt')}/mês`;
      }
      return `${conv.toLocaleString('en-US')} inquiries/mo × ${min} min × $${custoH}/hr × resumption factor (0.5 to 1.5) = ${fmtMoeda(piso, 'en')} to ${fmtMoeda(teto, 'en')}/mo`;
    }

    case 'pessoa': {
      const sal = inputs.salario || 0;
      const oQuePara = inputs.oQuePara || 'processo';
      const labelImpacto = {
        atendimento: isPt ? 'atendimento' : 'customer service',
        processo: isPt ? 'processo inteiro' : 'full process',
        documentado: isPt ? 'documentado (zero)' : 'documented (zero)',
      }[oQuePara] || oQuePara;

      if (isPt) {
        return `Salário R$ ${sal.toLocaleString('pt-BR')}/mês × custo reposição (50% a 200% / 12 meses) × impacto (${labelImpacto}) = ${fmtMoeda(piso, 'pt')} a ${fmtMoeda(teto, 'pt')}/mês`;
      }
      return `Salary $${sal.toLocaleString('en-US')}/mo × replacement cost (50% to 200% / 12 mos) × impact (${labelImpacto}) = ${fmtMoeda(piso, 'en')} to ${fmtMoeda(teto, 'en')}/mo`;
    }

    case 'cego': {
      const margem = inputs.margemMes || 0;
      const freq = inputs.frequencia || 'sempre';
      const isAvg = !!inputs.isAverageMargin;
      const labelFreq = {
        sempre: isPt ? 'sempre (100%)' : 'always (100%)',
        asvezes: isPt ? 'às vezes (50%)' : 'sometimes (50%)',
        quase_nunca: isPt ? 'quase nunca (15%)' : 'rarely (15%)',
      }[freq] || freq;

      const avgNote = isAvg ? (isPt ? ' (média setorial ~20%)' : ' (sector avg ~20%)') : '';

      if (isPt) {
        return `Margem R$ ${margem.toLocaleString('pt-BR')}/mês${avgNote} × 3% a 8% (McKinsey) × freq. (${labelFreq}) = ${fmtMoeda(piso, 'pt')} a ${fmtMoeda(teto, 'pt')}/mês`;
      }
      return `Margin $${margem.toLocaleString('en-US')}/mo${avgNote} × 3% to 8% (McKinsey) × freq. (${labelFreq}) = ${fmtMoeda(piso, 'en')} to ${fmtMoeda(teto, 'en')}/mo`;
    }

    default:
      return `${cur}${fmtMoeda(piso, lang)} - ${fmtMoeda(teto, lang)}`;
  }
}

/**
 * Função utilitária central para calcular o diagnóstico completo
 */
export function calcularDiagnostico({ dor, inputs, lang = 'pt' }) {
  if (!dor || !MODELO[dor]) {
    return { piso: 0, teto: 0, linhaConta: '', fonte: null, recuperacao: null };
  }

  let piso = 0;
  let teto = 0;

  switch (dor) {
    case 'marketplace':
      [piso, teto] = MODELO.marketplace(inputs.receita || 0, inputs.fatiaCanal || 0.35, lang);
      break;
    case 'planilha':
      [piso, teto] = MODELO.planilha(inputs.lancamentosMes || 0, inputs.custoErro || 50);
      break;
    case 'curiosos':
      [piso, teto] = MODELO.curiosos(inputs.conversasMes || 0, inputs.minutosPorConversa || 15, inputs.custoHora || 40);
      break;
    case 'pessoa':
      [piso, teto] = MODELO.pessoa(inputs.salario || 0, inputs.oQuePara || 'processo');
      break;
    case 'cego':
      [piso, teto] = MODELO.cego(inputs.margemMes || 0, inputs.frequencia || 'sempre');
      break;
  }

  const linhaConta = montaLinhaConta(dor, inputs, piso, teto, lang);

  return {
    piso,
    teto,
    linhaConta,
    fonte: FONTES[dor] || null,
    recuperacao: RECUPERACAO_ESPECIFICA[dor] || null,
  };
}
