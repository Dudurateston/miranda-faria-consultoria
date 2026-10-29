/**
 * Conteudo das paginas de produto (15/10/2026, agente site-seo).
 *
 * Paginas de UM idioma so, de proposito:
 * - Pulso RH: PT, para industrias no Brasil;
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
   lingua (as rotas continuam monolinguas: Pulso RH fala PT, Eightyfive
   fala EN). Nada de numero inventado nem screenshot de dados reais. */
export const getPortfolioProducts = (lang) => {
  const pt = lang === "pt";
  return [
    {
      slug: "pulso-rh",
      name: "Pulso RH",
      to: "/pt/pulso-rh",
      lead: pt
        ? "O ponto da fábrica vira decisão no mesmo dia."
        : "Factory clock-ins turned into decisions the same day.",
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
  pageTitle: "Pulso RH: o ponto da fábrica vira decisão no mesmo dia",
  label: "Pulso RH · produto próprio para indústrias",
  lead: "O ponto da fábrica vira decisão no mesmo dia.",
  body:
    "O Pulso RH lê o arquivo que o relógio já gera e devolve a semana inteira em painel: quem faltou, o que foi atestado, quanto a hora extra custou e onde a jornada saiu da regra. O RH para de montar planilha e passa a decidir com o número na frente.",
  primary: "Ver o pulso da minha fábrica",
  secondary: "Abrir a demonstração",
  whatsappNote: "WhatsApp",
  featuresTitle: "O que muda na segunda-feira",
  features: [
    "A folha do dia já está pronta quando o RH abre o sistema: presentes, atrasos, faltas, folgas e batidas a tratar, com a justificativa a um clique.",
    "O absenteísmo abre por dia, setor e mês, separando atestado e abono da falta sem justificativa, para a conversa ser sobre causa e não sobre planilha.",
    "A hora extra chega com o custo ao lado, e o que vai para o banco de horas fica registrado com autor e data.",
    "O alerta chega antes do problema: fim de experiência, férias vencendo, faltas seguidas e pontos de atenção da CLT.",
    "A jornada tem vigência e versão, então a regra de hoje não reescreve o mês passado.",
    "O cadastro passa por revisão de duplicados, e cada importação fica no histórico com linhas e período.",
    "Os painéis mostram o setor em atenção e a evolução diária, comparando unidades quando a empresa tem mais de uma.",
    "Cultura e compliance ficam no mesmo lugar: canal de manifestações com protocolo, PDI por ciclo e acesso por perfil.",
  ],
  screensTitle: "Por dentro do produto",
  screensNote: "Telas da versão em uso. Nomes de pessoas e de empresas aparecem desfocados.",
  screens: [
    {
      src: "/work/pulso-rh/inicio.webp",
      width: 1024,
      height: 576,
      alt: "Tela de início do Pulso RH com presentes, faltas, atrasos, batidas a tratar, saldo de banco e quadro ativo.",
      caption: "Início: o dia inteiro em seis números.",
    },
    {
      src: "/work/pulso-rh/folha.webp",
      width: 1024,
      height: 576,
      alt: "Folha do dia com a situação de cada pessoa e a justificativa a um clique.",
      caption: "Folha do dia: a ausência já com a justificativa.",
    },
    {
      src: "/work/pulso-rh/analise.webp",
      width: 1024,
      height: 576,
      alt: "Painel de análise com absenteísmo, horas extras e faltantes, dias de falta e evolução diária.",
      caption: "Análise: o mês fechado, com setor em atenção.",
    },
    {
      src: "/work/pulso-rh/importar.webp",
      width: 1024,
      height: 544,
      alt: "Tela de importação recebendo folha de ponto, relatório de empregados e AFD do relógio.",
      caption: "Importação: relógio e folha entram juntos.",
    },
  ],
  diagTitle: "O diagnóstico é grátis e leva um dia",
  diagLead: "Antes de falar de preço, veja o que o seu próprio ponto mostra.",
  diagSteps: [
    "Exporte o AFD do último mês no relógio ou no sistema de ponto.",
    "Mande o arquivo pelo WhatsApp.",
    "Receba um PDF com faltas, horas extras e pontos de atenção. No diagnóstico grátis, o arquivo é apagado depois do envio do PDF.",
  ],
  diagAlt:
    "Prefere não mandar dados? Importe na demonstração: o arquivo é lido no seu navegador e não sai do seu computador.",
  diagNote:
    "O diagnóstico é uma leitura dos números do ponto. Não substitui a análise do seu contador ou do advogado trabalhista.",
  faqTitle: "Perguntas frequentes",
  faq: [
    {
      q: "Serve para fábrica com mais de uma unidade?",
      a: "Serve. Cada unidade entra como empresa, os números aparecem separados e o painel compara as unidades quando faz sentido.",
    },
    {
      q: "Preciso trocar o relógio de ponto?",
      a: "Não. O Pulso RH lê o AFD da Portaria 671 e os relatórios que o sistema de ponto exporta em CSV, Excel, HTML ou PDF, além da Relação de Empregados da folha em PDF.",
    },
    {
      q: "O AFD serve para quê?",
      a: "O AFD é o Arquivo Fonte de Dados: o registro de todas as marcações do relógio, no formato da Portaria MTP nº 671/2021. É o arquivo que a fiscalização pode pedir, e é dele que sai o painel.",
    },
    {
      q: "Onde ficam os dados dos funcionários e quem acessa?",
      a: "Na demonstração, os dados ficam no navegador do seu computador, e CPF, PIS e CTPS não são guardados. Na versão contratada, o acesso é por perfil, com administração, RH e leitura definidos antes da implantação.",
    },
    {
      q: "Quanto custa?",
      a: "Depende do tamanho da equipe: há uma implantação única e uma mensalidade por faixa de funcionários. O Eduardo passa o valor exato depois de ver o seu caso.",
    },
    {
      q: "Quanto tempo leva para começar a usar?",
      a: "A primeira leitura sai no mesmo dia em que o arquivo chega. A implantação completa vai de uma a três semanas, conforme o número de unidades e de pessoas.",
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
