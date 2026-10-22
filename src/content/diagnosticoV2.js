/**
 * diagnosticoV2.js (conteúdo) — perguntas e textos do Diagnóstico v2, PT/EN.
 * Etapa 1: dados puros, sem UI. Identificadores estáveis; a UI localiza por id.
 * Desenho aprovado em 22/10 ("prioridades e plano inicial").
 * Este módulo NÃO altera src/lib/diagnostico.js nem Insights.jsx.
 *
 * Regras de conteúdo (plano 2026-10-22):
 *  - 8 perguntas principais + no máximo 2 complementares por caminho.
 *  - "Não sei" é legítimo: null/unknown, nunca 0.
 *  - Faixas marcadas aproximadas; valor exato opcional.
 *  - Sem promessa de duração, sem benchmark individual, sem moeda convertida.
 */

export const VERSION = 2;

/* Bandas de volume não-monetárias (aproximadas; lo/hi por período declarado). */
export const VOLUME_BANDS = [
  { id: "zero", lo: 0, hi: 0 },
  { id: "ate10", lo: 1, hi: 10 },
  { id: "11a50", lo: 11, hi: 50 },
  { id: "51a200", lo: 51, hi: 200 },
  { id: "acima200", lo: 201, hi: null },
];

/* Bandas de receita mensal do canal com comissão (aproximadas). */
export const VOLUME_BANDS_CURRENCY = [
  { id: "zero", lo: 0, hi: 0 },
  { id: "ate2k", lo: 1, hi: 2000 },
  { id: "2ka10k", lo: 2001, hi: 10000 },
  { id: "10ka50k", lo: 10001, hi: 50000 },
  { id: "acima50k", lo: 50001, hi: null },
];

/* Bandas de horas por semana (estimativa direta do visitante). */
export const HOURS_BANDS = [
  { id: "zero", lo: 0, hi: 0 },
  { id: "ate1h", lo: 0.5, hi: 1 },
  { id: "1a3h", lo: 1, hi: 3 },
  { id: "3a8h", lo: 3, hi: 8 },
  { id: "acima8h", lo: 8, hi: null },
];

/**
 * Unidade/período do volume por objetivo. comissao_canal: receita mensal do canal.
 * A resposta de volume é SEMPRE o ramo escolhido na pergunta 2 — não misturar
 * faturamento com lucro, nem volume anual com mensal.
 */
export const VOLUME_UNITS = {
  pt: {
    pedidos_vendas: { unit: "pedidos", period: "por semana" },
    atendimento_presenca: { unit: "atendimentos", period: "por mês" },
    estoque_informacao: { unit: "itens ou registros", period: "por mês" },
    tarefas_repetitivas: { unit: "tarefas", period: "por mês" },
    continuidade_operacao: { unit: "rotinas que dependem de alguém", period: "por mês" },
    comissao_canal: { unit: "receita do canal", period: "por mês", currency: true },
  },
  en: {
    pedidos_vendas: { unit: "orders", period: "per week" },
    atendimento_presenca: { unit: "customer interactions", period: "per month" },
    estoque_informacao: { unit: "items or records", period: "per month" },
    tarefas_repetitivas: { unit: "tasks", period: "per month" },
    continuidade_operacao: { unit: "routines depending on one person", period: "per month" },
    comissao_canal: { unit: "channel revenue", period: "per month", currency: true },
  },
};

/* ─────────────────────────── perguntas PT/EN ─────────────────────────── */

export const QUESTIONS_V2 = {
  pt: [
    {
      id: "sector",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "comercio", label: "Comércio ou distribuição" },
        { id: "industria", label: "Indústria" },
        { id: "servicos", label: "Serviços" },
        { id: "alimentacao", label: "Alimentação" },
        { id: "outro", label: "Outra atividade" },
      ],
      title: "Qual é a atividade da empresa?",
      hint: "Usada para exemplos e aplicabilidade; não presumimos margem pelo setor.",
    },
    {
      id: "goal",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "pedidos_vendas", label: "Pedidos e vendas" },
        { id: "atendimento_presenca", label: "Atendimento e presença digital" },
        { id: "estoque_informacao", label: "Estoque e informação" },
        { id: "tarefas_repetitivas", label: "Tarefas repetitivas" },
        { id: "continuidade_operacao", label: "Continuidade da operação" },
        { id: "comissao_canal", label: "Comissão de canal ou marketplace" },
      ],
      title: "O que precisa melhorar primeiro?",
      hint: "Isso define o ramo do diagnóstico e a recomendação.",
    },
    {
      id: "currentTools",
      type: "choice",
      required: true,
      dependsOn: ["goal"],
      options: [
        { id: "conversa_papel", label: "Conversa e papel" },
        { id: "planilha", label: "Planilha" },
        { id: "sistema_manual", label: "Sistema com etapas manuais" },
        { id: "sistemas_integrados", label: "Sistemas integrados" },
      ],
      title: "Como essa rotina funciona hoje?",
      hint: "A explicação da recomendação cita esta resposta.",
    },
    {
      id: "volume",
      type: "volume",
      required: true,
      dependsOn: ["goal"],
      title: "Qual é o tamanho da rotina?",
      hint: "Faixa aproximada; o valor exato é opcional.",
    },
    {
      id: "bottleneck",
      type: "choice",
      required: true,
      dependsOn: ["goal"],
      options: [
        { id: "redigitar", label: "Redigitar a mesma informação" },
        { id: "procurar_conferir", label: "Procurar ou conferir informação" },
        { id: "corrigir_erro", label: "Corrigir erro" },
        { id: "esperar_alguem", label: "Esperar alguém" },
        { id: "nenhum", label: "Nenhum desses" },
      ],
      title: "Onde o trabalho precisa ser refeito?",
      hint: "A prioridade sugerida indica a ação específica desse gargalo.",
    },
    {
      id: "hoursPerWeek",
      type: "hours",
      required: false,
      dependsOn: ["bottleneck"],
      options: [
        { id: "zero", label: "Praticamente nada" },
        { id: "ate1h", label: "Até 1 hora" },
        { id: "1a3h", label: "De 1 a 3 horas" },
        { id: "3a8h", label: "De 3 a 8 horas" },
        { id: "acima8h", label: "Mais de 8 horas" },
        { id: "nao_sei", label: "Não sei" },
      ],
      title: "Quanto tempo isso ocupa?",
      hint: "Sua estimativa por semana. “Não sei” é uma resposta válida — não viramos zero.",
    },
    {
      id: "dataAccess",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "atualizadas_compartilhadas", label: "Atualizadas e acessíveis a mais de uma pessoa" },
        { id: "precisam_conferencia", label: "Precisam de conferência" },
        { id: "uma_pessoa_sabe", label: "Só uma pessoa sabe" },
        { id: "nao_sei", label: "Não sei" },
      ],
      title: "Quão confiáveis e acessíveis são as informações?",
      hint: "Isso orienta pré-requisitos e dependência humana.",
    },
    {
      id: "urgency",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "agora", label: "Agora" },
        { id: "proximos_meses", label: "Nos próximos meses" },
        { id: "explorando", label: "Explorando, sem pressa" },
      ],
      title: "Quando faz sentido começar?",
      hint: "Ajusta o próximo passo; não muda nenhum valor.",
    },
    /* complementares (no máx. 2 por caminho) */
    {
      id: "hourlyCost",
      type: "currency",
      required: false,
      dependsOn: ["hoursPerWeek"],
      applyIf: { goal: ["tarefas_repetitivas"], hoursKnown: true },
      unit: "valor por hora",
      title: "Quanto custa a hora dessa rotina?",
      hint: "Opcional. Sem custo informado, mostramos tempo, não dinheiro.",
    },
    {
      id: "commissionRate",
      type: "percent",
      required: false,
      dependsOn: ["goal"],
      applyIf: { goal: ["comissao_canal"] },
      unit: "% da receita do canal",
      title: "Qual taxa o canal cobra de fato?",
      hint: "A taxa efetivamente cobrada, não a anunciada.",
    },
    {
      id: "migratableShare",
      type: "percent",
      required: false,
      dependsOn: ["commissionRate"],
      applyIf: { goal: ["comissao_canal"] },
      unit: "% da receita do canal",
      title: "Qual parcela seria viável migrar?",
      hint: "A parcela que você considera viável, não uma ambição.",
    },
  ],
  en: [
    {
      id: "sector",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "comercio", label: "Commerce or distribution" },
        { id: "industria", label: "Manufacturing" },
        { id: "servicos", label: "Services" },
        { id: "alimentacao", label: "Food" },
        { id: "outro", label: "Other" },
      ],
      title: "What does the company do?",
      hint: "Used for examples and fit; we assume no margin by sector.",
    },
    {
      id: "goal",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "pedidos_vendas", label: "Orders and sales" },
        { id: "atendimento_presenca", label: "Service and online presence" },
        { id: "estoque_informacao", label: "Inventory and information" },
        { id: "tarefas_repetitivas", label: "Repetitive tasks" },
        { id: "continuidade_operacao", label: "Business continuity" },
        { id: "comissao_canal", label: "Marketplace or channel commission" },
      ],
      title: "What needs to improve first?",
      hint: "This sets the diagnosis branch and the recommendation.",
    },
    {
      id: "currentTools",
      type: "choice",
      required: true,
      dependsOn: ["goal"],
      options: [
        { id: "conversa_papel", label: "Conversation and paper" },
        { id: "planilha", label: "Spreadsheets" },
        { id: "sistema_manual", label: "A system with manual steps" },
        { id: "sistemas_integrados", label: "Integrated systems" },
      ],
      title: "How does that routine work today?",
      hint: "The recommendation cites this answer.",
    },
    {
      id: "volume",
      type: "volume",
      required: true,
      dependsOn: ["goal"],
      title: "How big is the routine?",
      hint: "Approximate range; an exact figure is optional.",
    },
    {
      id: "bottleneck",
      type: "choice",
      required: true,
      dependsOn: ["goal"],
      options: [
        { id: "redigitar", label: "Retyping the same information" },
        { id: "procurar_conferir", label: "Searching for or checking information" },
        { id: "corrigir_erro", label: "Fixing errors" },
        { id: "esperar_alguem", label: "Waiting on someone" },
        { id: "nenhum", label: "None of these" },
      ],
      title: "Where does work have to be redone?",
      hint: "The suggested priority points at the specific action for that bottleneck.",
    },
    {
      id: "hoursPerWeek",
      type: "hours",
      required: false,
      dependsOn: ["bottleneck"],
      options: [
        { id: "zero", label: "Almost nothing" },
        { id: "ate1h", label: "Up to 1 hour" },
        { id: "1a3h", label: "1 to 3 hours" },
        { id: "3a8h", label: "3 to 8 hours" },
        { id: "acima8h", label: "More than 8 hours" },
        { id: "nao_sei", label: "I don't know" },
      ],
      title: "How much time does it take?",
      hint: "Your estimate per week. “I don't know” is a valid answer — it never becomes zero.",
    },
    {
      id: "dataAccess",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "atualizadas_compartilhadas", label: "Up to date and accessible to more than one person" },
        { id: "precisam_conferencia", label: "They need checking" },
        { id: "uma_pessoa_sabe", label: "Only one person knows them" },
        { id: "nao_sei", label: "I don't know" },
      ],
      title: "How reliable and accessible is the information?",
      hint: "This guides prerequisites and human dependency.",
    },
    {
      id: "urgency",
      type: "choice",
      required: true,
      dependsOn: [],
      options: [
        { id: "agora", label: "Now" },
        { id: "proximos_meses", label: "In the coming months" },
        { id: "explorando", label: "Just exploring" },
      ],
      title: "When does it make sense to start?",
      hint: "It adjusts the next step; it changes no value.",
    },
    {
      id: "hourlyCost",
      type: "currency",
      required: false,
      dependsOn: ["hoursPerWeek"],
      applyIf: { goal: ["tarefas_repetitivas"], hoursKnown: true },
      unit: "value per hour",
      title: "What does an hour of this routine cost?",
      hint: "Optional. Without a cost, we show time, not money.",
    },
    {
      id: "commissionRate",
      type: "percent",
      required: false,
      dependsOn: ["goal"],
      applyIf: { goal: ["comissao_canal"] },
      unit: "% of channel revenue",
      title: "What does the channel actually charge?",
      hint: "The effective rate, not the advertised one.",
    },
    {
      id: "migratableShare",
      type: "percent",
      required: false,
      dependsOn: ["commissionRate"],
      applyIf: { goal: ["comissao_canal"] },
      unit: "% of channel revenue",
      title: "What share could realistically move?",
      hint: "The share you consider viable, not an ambition.",
    },
  ],
};

/* ─────────────────────────── textos do resultado ─────────────────────────── */

export const PRIORITY_TEXTS = {
  organizar_informacao: {
    pt: {
      title: "Organizar a informação antes de qualquer automação",
      action: "Listar onde cada informação da operação vive hoje, quem acessa e com que frequência atualiza; definir um lugar único e atualizado.",
      prerequisite: "Um responsável pela informação e meia hora de inventário honesto.",
      measure: "Semana a semana, menos conferência manual para fechar um número.",
    },
    en: {
      title: "Organize the information before any automation",
      action: "List where each piece of information lives today, who can access it and how often it's updated; settle on one up-to-date home for it.",
      prerequisite: "One person responsible and half an hour of honest inventory.",
      measure: "Week over week, less manual checking to close a number.",
    },
  },
  mapear_retrabalho: {
    pt: {
      title: "Mapear e padronizar a rotina refeita",
      action: "Desenhar a rotina onde o trabalho é refeito (redigitação ou correção) e padronizar uma única entrada, no momento em que a informação nasce.",
      prerequisite: "O desenho atual do processo, mesmo em papel.",
      measure: "Contagem de quantas vezes a mesma informação foi digitada numa semana.",
    },
    en: {
      title: "Map and standardize the redone routine",
      action: "Draw the routine where work gets redone (retyping or fixing) and standardize a single entry, at the moment the information is born.",
      prerequisite: "The current process sketch, even on paper.",
      measure: "A count of how many times the same information was typed in a week.",
    },
  },
  organizar_consulta_dados: {
    pt: {
      title: "Definir um lugar único para o que hoje se procura",
      action: "Escolher a informação mais consultada da rotina e dar a ela um local único, atualizado e consultável sem depender de alguém.",
      prerequisite: "Acordo sobre qual fonte é a verdadeira.",
      measure: "Tempo até encontrar a informação certa no dia a dia.",
    },
    en: {
      title: "One single home for what gets searched",
      action: "Pick the most-consulted piece of the routine and give it a single, up-to-date, searchable place that doesn't depend on one person.",
      prerequisite: "Agreement on which source is the source of truth.",
      measure: "Time to find the right information day to day.",
    },
  },
  destravar_gargalo_pessoa: {
    pt: {
      title: "Destravar a dependência de uma pessoa",
      action: "Documentar a rotina que hoje espera alguém e dar a uma segunda pessoa acesso e treinamento para executá-la.",
      prerequisite: "A pessoa que sabe aceitar registrar como faz.",
      measure: "Rotina executada sem a pessoa-chave presente.",
    },
    en: {
      title: "Unlock the single-person dependency",
      action: "Document the routine that waits on someone and give a second person access and training to run it.",
      prerequisite: "The person who knows agreeing to write down how they do it.",
      measure: "The routine runs without the key person present.",
    },
  },
  avaliar_migracao_canal: {
    pt: {
      title: "Avaliar migrar parte da receita do canal com comissão",
      action: "Simular, com a taxa informada, migrar a parcela viável para um canal próprio e levantar TODOS os custos novos antes de decidir.",
      prerequisite: "Custos do canal próprio (entrega, pagamento, tráfego) medidos ou orçados.",
      measure: "Comissão bruta evitável por mês, recalculada com custos reais.",
    },
    en: {
      title: "Evaluate moving part of the commission revenue",
      action: "Using the informed rate, simulate moving the viable share to your own channel and map ALL new costs before deciding.",
      prerequisite: "Own-channel costs (delivery, payments, traffic) measured or quoted.",
      measure: "Gross commission avoidable per month, recalculated with real costs.",
    },
  },
  acompanhar_indicadores: {
    pt: {
      title: "Acompanhar indicadores simples",
      action: "Definir um ou dois indicadores da rotina (tempo da etapa, volume tratado) e registrá-los por algumas semanas antes de mexer mais.",
      prerequisite: "Uma planilha simples e uma semana de disciplina.",
      measure: "A própria série de indicadores, semana a semana.",
    },
    en: {
      title: "Track simple indicators",
      action: "Pick one or two routine indicators (step time, volume handled) and log them for a few weeks before changing more.",
      prerequisite: "A simple spreadsheet and one disciplined week.",
      measure: "The indicator series itself, week over week.",
    },
  },
  acompanhar_validar: {
    pt: {
      title: "Validar em uso antes de mudar mais",
      action: "A rotina já é organizada; validar em uso, acompanhar os indicadores existentes e só mudar com evidência.",
      prerequisite: "Nenhum — a base informada já é suficiente.",
      measure: "Indicadores atuais estáveis ao longo de semanas.",
    },
    en: {
      title: "Validate in use before changing more",
      action: "The routine is already organized; validate it in use, keep an eye on existing indicators and change only with evidence.",
      prerequisite: "None — the informed base is already enough.",
      measure: "Current indicators holding steady over weeks.",
    },
  },
};

/* Ação específica por objetivo (3ª camada da recomendação). */
export const GOAL_ACTIONS = {
  pt: {
    pedidos_vendas: { action: "Organizar o fluxo de pedidos de ponta a ponta, com o pedido registrado uma única vez.", measure: "Pedidos tratados por semana sem redigitação." },
    atendimento_presenca: { action: "Definir o destino único dos contatos e uma triagem simples de quem responde o quê.", measure: "Contatos respondidos dentro de um prazo definido." },
    estoque_informacao: { action: "Escolher o item de maior giro e manter sua contagem viva num lugar só, confiável.", measure: "Divergências encontradas na contagem de fechamento." },
    tarefas_repetitivas: { action: "Padronizar a tarefa repetitiva de maior tempo antes de automatizar qualquer coisa.", measure: "Tempo por tarefa e tarefas por semana." },
    continuidade_operacao: { action: "Documentar a rotina crítica e treinar um segundo acesso, sem transformar risco em perda mensal imaginária.", measure: "Rotina executada sem a pessoa-chave." },
    comissao_canal: { action: "Simular a migração da parcela viável com a taxa real informada.", measure: "Comissão bruta evitável por mês, recalculada com custos reais." },
  },
  en: {
    pedidos_vendas: { action: "Organize the order flow end to end, with the order recorded once.", measure: "Orders handled per week without retyping." },
    atendimento_presenca: { action: "Give contacts a single destination and a simple triage of who answers what.", measure: "Contacts answered within a set window." },
    estoque_informacao: { action: "Pick the highest-turnover item and keep its count alive in one trustworthy place.", measure: "Discrepancies found at closing counts." },
    tarefas_repetitivas: { action: "Standardize the highest-time repetitive task before automating anything.", measure: "Time per task and tasks per week." },
    continuidade_operacao: { action: "Document the critical routine and train a second owner, without turning risk into an imagined monthly loss.", measure: "Routine run without the key person." },
    comissao_canal: { action: "Simulate moving the viable share using the real informed rate.", measure: "Gross commission avoidable per month, recalculated with real costs." },
  },
};

export const NEXT_STEP_TEXTS = {
  pt: {
    conversar: "Com o contexto acima, uma conversa de 30 minutos transforma essas prioridades num plano. O WhatsApp está aberto; o resultado é seu, com ou sem conversa.",
    planejar: "Guarde o resumo. Quando o momento chegar, ele economiza a primeira hora de qualquer conversa.",
    explorar: "Sem pressa: leve o resumo, meça o que está marcado como faltante e volte quando fizer sentido.",
    medir_horas: "Registrar, por uma semana, o tempo gasto na rotina.",
    informar_custo_hora: "Informar o custo da hora da rotina para transformar tempo em custo.",
    informar_taxa: "Informar a taxa efetiva cobrada pelo canal.",
    informar_parcela: "Informar a parcela que considera viável migrar.",
    falta_dados: "Ainda faltam dados para estimar valor. O plano acima não depende disso — e o que medir está listado.",
  },
  en: {
    conversar: "With the context above, a 30-minute conversation turns these priorities into a plan. WhatsApp is open; the result is yours either way.",
    planejar: "Keep the summary. When the time comes, it saves the first hour of any conversation.",
    exploring: "No rush: take the summary, measure what's marked missing and come back when it makes sense.",
    medir_horas: "Log, for one week, the time spent on the routine.",
    informar_custo_hora: "Provide the hourly cost of the routine to turn time into cost.",
    informar_taxa: "Provide the effective rate the channel charges.",
    informar_parcela: "Provide the share you consider viable to move.",
    falta_dados: "There isn't enough data to estimate value yet. The plan above doesn't depend on it — what to measure is listed.",
  },
};
