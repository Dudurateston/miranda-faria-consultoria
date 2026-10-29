/**
 * Conteudo das paginas de produto (15/10/2026, agente site-seo).
 *
 * Paginas de UM idioma so, de proposito:
 * - Apontador: PT, para industrias no Brasil;
 * - Eightyfive: EN, para escolas de ingles na Irlanda.
 * A outra lingua redireciona e o hreflang aponta so para a versao real
 * (SiteLayout le MONO_LANG_PAGES). O sitemap tambem le daqui, por isso
 * este arquivo e JS puro, sem import com "@/".
 *
 * Regras de texto: nada de numero inventado, nada de promessa absoluta,
 * nenhum nome de cliente. Fontes dos fatos no relatorio do cerebro:
 * resultados/2026-10-15-site-correcoes.md.
 */

export const MONO_LANG_PAGES = { "pulso-rh": "pt", eightyfive: "en", apontador: "pt" };

/* Produtos proprios nas listas de portfolio (Work, Home e menu — revisao
   Codex 21/10): UMA lista compartilhada por idioma, com lead fiel em cada
   lingua (as rotas continuam monolinguas: Apontador fala PT, Eightyfive
   fala EN). Nada de numero inventado nem screenshot de dados reais. */
export const getPortfolioProducts = (lang) => {
  const pt = lang === "pt";
  return [
    {
      slug: "pulso-rh",
      name: "Pulso RH",
      to: "/pt/pulso-rh",
      lead: pt
        ? "Ponto, jornada e indicadores de RH da fábrica, sem planilha."
        : "Clock-ins, working hours and factory HR indicators, no spreadsheets.",
      tag: pt ? "Produto próprio · Miranda Faria" : "In-house product · Miranda Faria",
      media: { img: "/art/m-logo-320.webp" },
    },
    {
      slug: "eightyfive",
      name: "Eightyfive",
      to: "/en/eightyfive",
      lead: pt
        ? "Um diário de presença construído em torno da regra dos 85%."
        : "An attendance register built around the 85% rule.",
      tag: pt ? "Produto próprio · Miranda Faria" : "In-house product · Miranda Faria",
      media: { img: "/art/m-logo-320.webp" },
    },
  ];
};

const ORIGIN = "https://mirandafaria.com.br";

export const PULSO_RH = {
  pageTitle: "Pulso RH: ponto, jornada e indicadores de RH da fábrica",
  label: "Pulso RH · produto próprio para indústrias",
  lead: "O ponto da fábrica vira indicador de RH no mesmo dia.",
  body:
    "O Pulso RH lê o arquivo que o relógio de ponto já gera e a relação de empregados da folha. Em poucos minutos a folha do dia está montada, o absenteísmo aparece por setor e as horas extras ficam com o custo ao lado. Sem trocar relógio e sem digitar planilha.",
  primary: "Pedir o diagnóstico grátis do ponto",
  secondary: "Ver a demonstração",
  whatsappNote: "WhatsApp",
  featuresTitle: "O que ele faz",
  features: [
    "Importa o AFD da Portaria 671 e os relatórios do relógio em CSV, Excel, HTML ou PDF, além da Relação de Empregados da folha em PDF.",
    "Monta a folha do dia com presentes, atrasos, faltas, folgas e batidas a tratar, e deixa a justificativa a um clique.",
    "Mostra o absenteísmo por dia, setor e mês, separando atestado e abono de falta sem justificativa.",
    "Soma as horas extras e as faltantes do mês, com o custo das extras ao lado do que vai para o banco de horas.",
    "Abre alertas de RH: fim de experiência, férias vencendo, faltas seguidas e pontos de atenção da CLT.",
    "Mantém o cadastro único, com jornada por vigência, revisão de cadastros repetidos e histórico de importações.",
    "Leva os números para painéis por setor e por empresa, com evolução diária e os setores em atenção.",
    "Guarda cultura e compliance no mesmo lugar: canal de manifestações, PDI e acesso por perfil de usuário.",
  ],
  screensTitle: "Telas do produto",
  screensNote:
    "Telas da versão em uso, com os nomes das pessoas preservados fora das imagens.",
  screens: [],
  diagTitle: "Diagnóstico grátis do ponto",
  diagLead: "Antes de falar de preço, veja o que o seu próprio ponto mostra.",
  diagSteps: [
    "Exporte o AFD do último mês no relógio ou no sistema de ponto.",
    "Mande o arquivo pelo WhatsApp.",
    "Receba um PDF com faltas, horas extras e pontos de atenção. No diagnóstico grátis, o arquivo é apagado depois do envio do PDF.",
  ],
  diagAlt:
    "Prefere não mandar dados? Importe o arquivo na demonstração. Na demonstração, o arquivo é lido no seu navegador e não sai do seu computador.",
  diagNote:
    "O diagnóstico é uma leitura dos números do ponto. Não substitui a análise do seu contador ou do advogado trabalhista.",
  faqTitle: "Perguntas frequentes",
  faq: [
    {
      q: "O que mudou do Apontador para o Pulso RH?",
      a: "O Pulso RH é a mesma base do Apontador, agora com folha do dia com justificativa a um clique, banco de horas, alertas de RH, jornada por vigência, painéis por setor e as áreas de cultura e compliance. O ponto de partida continua o mesmo: o arquivo que o relógio já gera.",
    },
    {
      q: "Preciso trocar o relógio de ponto?",
      a: "Não. O Pulso RH lê o arquivo que o relógio já gera, o AFD da Portaria 671, ou os relatórios que o sistema de ponto exporta em CSV, Excel, HTML ou PDF.",
    },
    {
      q: "O que é o AFD?",
      a: "AFD é o Arquivo Fonte de Dados: o registro de todas as marcações do relógio de ponto, no formato definido pela Portaria MTP nº 671/2021. É o arquivo que a fiscalização do trabalho pode pedir.",
    },
    {
      q: "Como funciona o diagnóstico grátis?",
      a: "Você manda o AFD do último mês pelo WhatsApp e recebe um PDF com faltas, horas extras e pontos de atenção da CLT. No diagnóstico grátis, o arquivo serve só para isso e é apagado depois do envio do PDF.",
    },
    {
      q: "Onde ficam os dados dos funcionários e quem acessa?",
      a: "Na demonstração, os dados ficam no navegador do seu computador, e CPF, PIS e CTPS não são guardados. Na versão contratada, o acesso é por perfil, com administração, RH e leitura definidos antes da implantação.",
    },
    {
      q: "Quanto custa?",
      a: "Depende do tamanho da equipe: há uma implantação única e uma mensalidade por faixa de funcionários. O Eduardo passa o valor exato depois de ver o seu caso.",
    },
  ],
  closing: "Fale direto com quem faz o sistema.",
};

export const EIGHTYFIVE = {
  pageTitle: "Eightyfive: attendance records for language schools",
  label: "Eightyfive · for English language schools in Ireland",
  lead: "An attendance register built around the 85% rule.",
  body:
    "Schools listed on ILEP, and schools authorised to use the TrustEd Ireland mark, must record attendance in every class, apply the 15-minute rule and act when a student falls behind. Inspections can be unannounced. Eightyfive keeps that record in one place, class by class.",
  primary: "Ask for a demo",
  secondary: "See the sample demo",
  replyNote: "Got our email? Just reply “demo”.",
  featuresTitle: "What it does",
  features: [
    "Applies the 15-minute rule: arriving more than 15 minutes late, or leaving before the class ends, is marked absent for that class or segment.",
    "Records the class teacher’s student count next to the register.",
    "Flags students with 25% or more uncertified absence in the first six weeks.",
    "Forecasts each student’s attendance against 85%, so you know early who can no longer reach it.",
    "Exports the full attendance record, ready to show at an inspection or when ISD asks.",
  ],
  sourcesTitle: "Where the rules come from",
  sources: [
    "“TrustEd Ireland Scheme and Immigration Requirements: Information for Education Providers”, section “Recording of attendance for English Language Programmes”.",
    "ILEP criteria for English language programmes (March 2025), section “Monitoring, Inspections and Investigations”, which allows unannounced inspections at any time.",
  ],
  sourcesNote:
    "This page summarises published requirements to help you prepare. It is not legal advice. Always read the current official text.",
  faqTitle: "Questions schools ask",
  faq: [
    {
      q: "Who is Eightyfive for?",
      a: "English language schools in Ireland that are listed on ILEP or authorised to use the TrustEd Ireland mark, and must record attendance against the published rules.",
    },
    {
      q: "What does it check?",
      a: "The 15-minute rule, the class teacher’s student count, students at 25% or more uncertified absence in the first six weeks, and each student’s forecast against 85%.",
    },
    {
      q: "Will it get us through an inspection?",
      a: "No tool can promise that. Eightyfive is built to keep the attendance record complete and easy to show, but compliance stays with the school.",
    },
    {
      q: "Can we try it now?",
      a: "Yes. The demo runs on sample data. Setting it up for your school is agreed with you after the demo.",
    },
    {
      q: "Where is student data kept?",
      a: "The demo uses sample data only. Where real data is stored, and who can access it, is agreed in writing before any student record goes in.",
    },
  ],
  closing: "Talk to the person who builds it.",
};

/* Dados estruturados das duas paginas: FAQPage espelha o FAQ visivel. */
const faqLd = (faq, url, lang) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  inLanguage: lang,
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const PULSO_RH_URL = `${ORIGIN}/pt/pulso-rh`;
export const EIGHTYFIVE_URL = `${ORIGIN}/en/eightyfive`;
export const PULSO_RH_FAQ_LD = faqLd(PULSO_RH.faq, PULSO_RH_URL, "pt-BR");
export const EIGHTYFIVE_FAQ_LD = faqLd(EIGHTYFIVE.faq, EIGHTYFIVE_URL, "en");
