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

export const MONO_LANG_PAGES = { apontador: "pt", eightyfive: "en" };

const ORIGIN = "https://mirandafaria.com.br";

export const APONTADOR = {
  pageTitle: "Apontador: ponto e absenteísmo sem planilha",
  label: "Apontador · para indústrias",
  lead: "Ponto, faltas e horas extras da fábrica, sem planilha.",
  body:
    "O Apontador lê o arquivo que o seu relógio de ponto já gera e mostra o absenteísmo por dia, setor e mês, as horas extras e quanto elas custam. Não precisa trocar o relógio nem instalar nada.",
  primary: "Pedir o diagnóstico grátis do AFD",
  secondary: "Ver a demonstração",
  whatsappNote: "WhatsApp",
  featuresTitle: "O que ele faz",
  features: [
    "Lê o AFD da Portaria 671 (e o leiaute da antiga Portaria 1510) e os relatórios que o sistema de ponto exporta em CSV, Excel, HTML ou PDF.",
    "Mostra o absenteísmo por dia, setor e mês, separando atestado e abono de falta sem justificativa.",
    "Calcula horas extras e faltantes por dia e por mês, o custo das extras pagas e o que vai para o banco de horas.",
    "Deixa pronta a folha de ausentes do dia e o relatório do mês para o Excel.",
    "Não conta férias e afastamentos como falta, e separa batida repetida ou ímpar para conferência.",
    "Aponta pontos de atenção da CLT, como sete dias seguidos sem folga.",
  ],
  diagTitle: "Diagnóstico grátis do AFD",
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
      q: "Preciso trocar o relógio de ponto?",
      a: "Não. O Apontador lê o arquivo que o relógio já gera, o AFD da Portaria 671, ou os relatórios que o sistema de ponto exporta em CSV, Excel, HTML ou PDF.",
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
      q: "Onde ficam os dados dos funcionários?",
      a: "Na demonstração, os dados ficam no navegador do seu computador, e CPF, PIS e CTPS não são guardados. Na versão contratada, onde os dados ficam e quem acessa é explicado antes da implantação.",
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

export const APONTADOR_URL = `${ORIGIN}/pt/apontador`;
export const EIGHTYFIVE_URL = `${ORIGIN}/en/eightyfive`;
export const APONTADOR_FAQ_LD = faqLd(APONTADOR.faq, APONTADOR_URL, "pt-BR");
export const EIGHTYFIVE_FAQ_LD = faqLd(EIGHTYFIVE.faq, EIGHTYFIVE_URL, "en");
