/**
 * Fonte da verdade do conteudo, por idioma.
 *
 * EN e PT NAO sao traducoes um do outro, e isso e proposital
 * (DECISIONS.md): o publico do EN e cliente internacional de projeto
 * remoto e recrutador no exterior; o publico do PT e PME local, com o
 * WhatsApp como canal. As duas versoes vendem coisas diferentes com a
 * mesma identidade.
 *
 * TODO(metricas): os campos `impact` trazem o resultado qualitativo
 * real, sem numero. As metricas reais seguem como pendencia aberta no
 * RECAP.md — sao o que falta para o argumento passar de plausivel a
 * verificavel.
 */

export const CASE_SLUGS = [
  "queijos-serra",
  "roda-agro",
  "paulo-henrique",
  "motormoura",
  "1000-pecas",
  "rota-forte",
  "miranda-faria",
  "motormoura-marca",
  "1000-pecas-marca",
  "roda-agro-marca",
  "uaiso-travel",
  "advogados-lco",
  "sevalho-controladoria",
  "vaf-global",
];

export const copy = {
  en: {
    meta: {
      title: "Miranda Faria: Consulting and Technology",
      description:
        "Miranda Faria develops websites, systems and automations that connect a business's identity, offer and daily operations.",
      skip: "Skip to content",
      pages: {
        home: "Complete web systems (brand, product and data as one) built end-to-end, shipped fast.",
        work: "Management systems, websites and identity delivered end to end: parts, logistics, agribusiness, retail and the arts.",
        servicos: "Four solutions, one operating principle: systems, websites, design and automation.",
        about: "Meet Miranda Faria and the approach behind its websites, business systems and automations.",
        how: "From diagnosis to deployment: an agreed scope, a working preview and guidance for everyday use.",
        insights: "A guided questionnaire about your business, with priorities and an initial plan based on your answers.",
        contact: "Tell us what needs to change in your business. We will review the context and agree the next step.",
        practice: "Business systems, websites, automation and identity, from understanding the routine to delivery.",
        eightyfive: "Attendance register for ILEP and TrustEd Ireland schools: 15-minute rule, 85% forecasts, six-week alerts and an exportable record.",
      },
    },
    nav: {
      home: "Home",
      gestao: "Systems & Management",
      design: "Design",
      desenvolvimento: "Development",
      work: "Work",
      howIWork: "Technology",
      about: "About",
      services: "Services",
      technology: "Technology",
      insights: "Diagnosis",
      contact: "Contact",
      menu: "Open menu",
      close: "Close",
      toggle: "Ver em português",
    },
    home: {
      wordmark: "Miranda Faria",
      role: "Consulting & Technology",
      thesis: {
        label: "What we do",
        lead: "We build the foundations your business runs on.",
        body: "Miranda Faria develops websites, management systems and automations around the work your business needs to do.",
      },
      pitch: {
        label: "How we work",
        lead: "Decisions connected from design to delivery.",
        items: [
          {
            t: "Design connected to development",
            d: "Interface design, code and data are developed around the same operational needs. Each decision is checked against what the business needs to use.",
          },
            {
            t: "Tools followed by review",
            d: "AI supports the repetitive parts of research, design and development. Architecture, hierarchy and the final delivery remain subject to review and direction.",
          },
          {
            t: "Working arrangements",
            d: "Based in Brazil (UTC−3), we agree contact times and review stages for each project.",
          },
        ],
      },
      workTeaser: {
        label: "Selected work",
        lead: "Systems in the field.",
        cta: "See all work",
      },
      contactTeaser: {
        label: "Contact",
        lead: "Tell us where it's stuck.",
        cta: "Book a call",
      },
      heroCta: "Let's talk",
      netHint: "hover · drag the nodes · click to explore",
      sobrePreview: {
        label: "Miranda Faria",
        lead: "Technology shaped around the way you work.",
        body: [
          "A catalogue shared through WhatsApp, stock figures that are hard to verify, a report rebuilt every month. These are the tasks we start with when defining a project.",
          "We design your digital presence and build the systems that support your operations. The initial assessment sets priorities, and you follow the solution as it takes shape.",
        ],
        cta: "See our solutions",
      },
      techPreview: {
        label: "Technology",
        lead: "A lean stack, driven by method.",
        stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Python", "Figma", "AI / LLMs", "Automation"],
        cta: "Learn more",
      },
      trabalhoPreview: {
        cta: "See all projects",
      },
      insightsPreview: {
        label: "Diagnosis",
        lead: "Where does your operation lose time?",
        intro:
          "Answer about your day-to-day work and get priorities with an initial plan.",
        cta: "Run the diagnosis",
      },
      finalCta: { label: "Next step", lead: "Tell us what needs to work better.", cta: "Message on WhatsApp" },
    },
    work: {
      label: "Work",
      lead: "Systems in the field.",
      intro:
        "Projects shipped end to end: brand, interface, data model and deployment, across more than ten sectors. Those with their own domain are linked live: go see for yourself. The client-confidential ones stay on screens and recordings.",
      viewCase: "Read the case",
      productsLabel: "In-house products",

      viewProduct: "See the product",
      sections: {
        problem: "Problem",
        process: "Process",
        decisions: "Decisions",
        impact: "Impact",
      },
      factsSector: "Sector",
      factsRole: "Role",
      factsYear: "Year",
      linkLabel: "See it live",
      filterLabel: "Filter the work",
      filterSector: "SECTOR",
      filterSolution: "SOLUTION",
      filterAll: "All",
      emptyFilter: "No projects match these filters. Clear them to see the full portfolio.",
      clearFilter: "Clear filter",
      factsPractice: "Solution",
      factsDelivery: "Delivered",
      factsDeliverySystems: "Complete system",
      factsDeliverySite: "Complete site",
      factsDeliveryDesign: "Identity system",
      factsDeliveryAutomation: "Automation",
      backToIndex: "All work",
      nextCase: "Next project",
    },
    howIWork: {
      label: "Technology",
      lead: "Four layers behind every delivery.",
      intro:
        "We connect identity, interface, data and deployment around the work your business needs to do. Decisions in each layer shape the next, from the first design to everyday use.",
      science:
        "A study of 179 large publicly traded companies associated greater use of data in decisions with productivity 5 to 6% above expectations based on other investments (Brynjolfsson, Hitt and Kim, 2011). Our approach follows a practical principle: define criteria, follow the data and test what improves the operation.",
      layers: [
        {
          t: "Surface",
          d: "Brand, typography, motion, the thing a visitor actually feels. Decided first, because it constrains everything below it.",
        },
        {
          t: "System",
          d: "Interface architecture, states, routes and controls built around the tasks the client needs to perform.",
        },
        {
          t: "Data",
          d: "The model underneath: entities, relationships, what is derived and what is stored. Where most projects quietly break.",
        },
        {
          t: "Foundation",
          d: "Hosting, publication and ownership are part of the delivery. Access and documentation support the client's continued use of the system.",
        },
      ],
      stack: {
        label: "Stack",
        lead: "Lean tools, directed by method.",
        items: [
          "React / Vite: interface and application",
          "Tailwind CSS: design tokens the code reads",
          "Node.js / Python: automation and integrations",
          "Figma: identity and interface design",
          "AI / LLMs: leverage across the mechanical parts",
          "REST APIs: systems that talk to systems",
        ],
      },
      demo: {
        label: "Live, right now",
        lead: "Three proofs running on this page.",
        body:
          "Nothing below is video, GIF or slide: three panels computing right now, in your browser, with zero animation libraries. If it holds 60 frames per second, it's because the math holds.",
        items: [
          {
            tag: "01",
            name: "Vector field",
            hint: "Move your cursor over the field.",
            caption:
              "Hundreds of particles in a flow field that reacts to your cursor. Raw Canvas 2D, zero dependencies, drawn in real time.",
          },
          {
            tag: "02",
            name: "Motion curves",
            hint: "Drag across it to scrub time.",
            caption:
              "Linear, exponential-out and elastic: the easing choreography that governs this site's motion, drawn as hand-written math. Hover to freeze time under your cursor and read each curve's value; leave, and they dance on their own.",
          },
          {
            tag: "03",
            name: "Frame time",
            hint: "Press and drag: break the 60fps.",
            caption:
              "The real time of every frame of this page, measured live. Press and drag across the panel to inject load and watch the line climb over the 16.7ms budget: then release and see it recover. Performance is measured, not promised.",
          },
        ],
      },
      ai: {
        label: "On AI",
        lead: "Tools with review and accountability.",
        body: "We use AI to support research, programming and visual studies. Architecture, content and interfaces are reviewed before delivery. Generated visual studies are identified as such.",
      },
    },
    about: {
      label: "About Miranda Faria",
      lead: "Technology applied to real businesses.",
      portraitFallback: "EMF",
      name: "Eduardo Miranda Faria",
      body: [
        "Miranda Faria develops websites, systems and automations for businesses that need to organise their operations and present their offer clearly. Every project starts with the routine: who uses it, what needs to happen and which information supports the work. That understanding shapes the interface, data and rollout.",
        "Founder Eduardo Miranda Faria leads projects from the initial assessment through delivery, across design, development and management.",
        "We use AI in development and in visual work, with human review of decisions and deliveries.",
      ],
      location: "Piumhi, Minas Gerais · working with clients across Brazil.",
      facadeCaption: "Generative brand art: AI",
      trajectoryLabel: "Trajectory",
      trajectory: "The portfolio brings together fourteen projects across parts distribution, logistics, agribusiness, retail and the arts. It includes websites, inventory systems, a sales hub and the identity for the 22nd Roda de Agronegócios, connecting design and technology to each business's routine.",
      principlesLabel: "How we decide",
      principles: [
        {
          t: "Projects guided by the operation",
          d: "Scope is defined by the work the business needs to get done.",
        },
        {
          t: "A delivery the client can use",
          d: "Interface, access and usage guidance are defined within the project.",
        },
        {
          t: "Decisions followed by review",
          d: "Tools speed up production; every delivery has to be checked.",
        },
      ],
    },
    contact: {
      signCaption: "The brand on the street: generative study (AI)",
      label: "Contact",
      lead: "Tell us what needs to change.",
      body: "Tell us what needs to change and how the business works today. We use that context to define the next step together.",
      primary: "Book a call",
      secondary: "Send an email",
      response: "We'll reply using the details you provide.",
      form: {
        title: "Or leave your details",
        body: "Tell us what needs to change and how the business works today.",
        name: "Name",
        email: "Email",
        company: "Company",
        type: "Project type",
        types: { gestao: "Systems & Management", design: "Design", desenvolvimento: "Websites & development" },
        message: "Message",
        whatsapp: "Prefer to schedule a meeting over WhatsApp?",
        submit: "Send",
        sending: "Sending…",
        error: "Check the required fields.",
        errorServer: "Please try again, or email Eduardo@mirandafaria.com.br.",
        sent: "Message received. We'll review your request and reply using the details you provided.",
      },
    },
    sellers: {
      label: "Sales reps",
      lead: "Want to sell with us?",
      body:
        "Miranda Faria's sales partners have scripts, training and a hub for following up enquiries. Contact us about becoming a partner, or access the sales app.",
      wa: "Message on WhatsApp",
      app: "Open the reps' app",
    },
    consent: {
      title: "Privacy notice",
      text: "This site uses anonymous first-party measurement and Google Analytics to learn which pages help and which don't. First-party measurement collects no personal data; Analytics uses Google cookies (see the Policy page).",
      accept: "Accept",
      decline: "Essential only",
      policy: "Policy",
    },
    footer: {
      tagline: "Miranda Faria · Design Engineer & Creative Technologist",
      privacy: "Privacy",
      report: "Report an issue",
      linkedin: "LinkedIn",
      sellers: "Sales reps' app",
    },
    servicos: {
      label: "Services",
      lead: "Four solutions, one operating principle.",
      intro:
        "Systems, design, business intelligence and automation: each shippable alone, designed to work as one.",
      metricsLabel: "Delivery in practice",
      metrics: [
        { n: "Scope", d: "The proposal sets out the delivery, stages and criteria for reviewing the project." },
        { n: "Preview", d: "You review the solution during development, before the final delivery." },
        { n: "Access", d: "Delivery includes the access, materials and usage guidance agreed for the project." },
      ],
      bandLayers: ["Surface", "System", "Data", "Foundation"],
      bandStat:
        "When orders, inventory and customer service are disconnected, people have to check the same details again. Structuring that routine gives the business better information for its decisions.",
      bandSource: "U.S. Bureau of Labor Statistics",
      verticalsLabel: "The solutions",
      faq: [
        {
          q: "What do you do, exactly?",
          a: "A project can start with an operational problem or an idea for a brand, product or business. Miranda Faria connects identity, interface, systems and data around that need. The proposal defines the scope and what will be delivered.",
        },
        {
          q: "Do you do BI or data analysis?",
          a: "Data modelling is part of the work. Information already used by the business can support dashboards, reports and indicators for inventory, sales and cash flow. The aim is to make the numbers useful in day-to-day decisions.",
        },
        {
          q: "How much does it cost?",
          a: "The scope sets the price. The diagnostic helps identify priorities, and a conversation clarifies the work before a tailored proposal is prepared. That proposal describes the delivery and its limits.",
        },
        {
          q: "How long until it's ready, and after delivery?",
          a: "Timing depends on the scope, integrations and available material. The proposal sets out the stages and when you can review a working preview. Delivery includes the agreed access and usage guidance. Maintenance and further development are agreed separately.",
        },
      ],
      faqLabel: "What they ask before closing",
      seeVertical: "See the solution",
      cards: {
        gestao: "Orders organised in a system the business owns and operates.",
        design: "A recognisable brand, clear at every point of contact.",
        desenvolvimento: "A website that presents the offer clearly and gives enquiries a direct path to your business.",
        automacao: "Automated routines connecting triggers, messaging and business systems.",
      },
      cta: "Start a project",
    },
    diag: {
      label: "Diagnosis",
      lead: "How much leaks out every month?",
      intro:
        "Answer questions about your business's routine and receive priorities with an initial plan. Your answers guide the recommendations.",
      evidence:
        "One number worth keeping: the average company takes 42 hours to answer a lead: Harvard Business Review. A system exists to keep you on the right side of that number.",
      steps: { pain: "The pain", driver: "The driver", base: "The size", urgency: "The urgency" },
      painQ: "Where does it hurt most today?",
      painHint: "Pick the main one.",
      pains: [
        {
          id: "marketplace",
          t: "The marketplace takes its cut",
          d: "Amazon, eBay, Etsy, delivery apps: a commission on every sale, and the customer belongs to them.",
        },
        {
          id: "excel",
          t: "I run on spreadsheets",
          d: "Inventory, orders and cash flow in Excel: or in someone's head.",
        },
        {
          id: "curiosos",
          t: "Too many tire-kickers",
          d: "Hours of the day answering messages from people who never buy.",
        },
        {
          id: "pessoa",
          t: "I depend on one person",
          d: "If they leave, the process and the clients leave with them.",
        },
        {
          id: "cego",
          t: "I can't see where sales come from",
          d: "Pricing and stock decisions by gut feel.",
        },
      ],
      driverQ: {
        marketplace: { q: "What share of your sales goes through a marketplace?", opts: [["0.20", "Up to 20%"], ["0.35", "20 to 50%"], ["0.60", "More than 50%"]] },
        excel: { q: "How many orders or entries pass through someone's hands per week?", opts: [["25", "Up to 50"], ["125", "50 to 200"], ["600", "200 to 1,000"], ["1500", "More than 1,000"]] },
        curiosos: { q: "How many conversations per week never become a sale?", opts: [["5", "Up to 10"], ["20", "10 to 30"], ["65", "30 to 100"], ["150", "More than 100"]] },
        pessoa: { q: "If that person left tomorrow, what stops?", opts: [["atendimento", "Customer service"], ["processo", "The whole process"], ["documentado", "Nothing: it's documented"]] },
        cego: { q: "How often do you set a price or make a purchase with no number in front of you?", opts: [["sempre", "Almost always"], ["asvezes", "Sometimes"], ["quase_nunca", "Almost never"]] },
      },
      baseQ: {
        marketplace: { q: "Approximate monthly revenue?", hint: "Ranges: no exact number needed.", opts: [["8000", "Up to $10k"], ["20000", "$10 to 30k"], ["60000", "$30 to 100k"], ["180000", "$100k+"]] },
        excel: { q: "What does one of those errors cost you, roughly?", hint: "An estimate: the literature measures the error rate, not the reais.", opts: [["12", "Up to $25"], ["37", "$25 to 50"], ["75", "$50 to 100"]] },
        curiosos: { q: "What does an hour of that person's time cost?", hint: "Fully-loaded hourly cost, ranges.", opts: [["7", "Up to $15/hr"], ["22", "$15 to 30/hr"], ["45", "$30 to 60/hr"]] },
        pessoa: { q: "Their approximate monthly salary?", hint: "Ranges.", opts: [["800", "Up to $1k"], ["1750", "$1 to 2.5k"], ["3750", "$2.5 to 5k"], ["6500", "$5k+"]] },
        cego: { q: "Approximate monthly revenue?", hint: "Margin is estimated as a sector average, and says so on the result.", opts: [["8000", "Up to $10k"], ["20000", "$10 to 30k"], ["60000", "$30 to 100k"], ["180000", "$100k+"]] },
      },
      urgencyQ: "When do you want this solved?",
      urgencies: [
        { id: "now", t: "It's bleeding now", d: "Every month of delay costs real money." },
        { id: "months", t: "In the next few months", d: "Planned, but it can't slide forever." },
        { id: "later", t: "Planning for next year", d: "I want the size of it first." },
      ],
      result: {
        label: "Your estimated leak",
        range: "conservative floor",
        to: "to",
        perMonth: "per month",
        perYear: "per year",
        delayCost: "Every month of delay costs at least",
        natureLabel: "Model estimate: not a measured result",
        sourceLabel: "Source",
        accountLabel: "The math, on the screen",
        limitNote:
          "This estimate uses market ranges. Three numbers tighten it: your actual commission rate, your average ticket, and how many orders you process per week. That's what we pin down in the conversation.",
        recoveryLabel: "What the fix actually recovers",
        solutionLabel: "What fixes it",
        solutionSee: "See the solution",
        cta: "Message on WhatsApp with the diagnosis ready",
        restart: "Run it again",
        copyCta: "Copy result",
        copied: "Copied",
        back: "Back",
        reading: "This is the price of leaving things as they are: not a quote, a leak.",
        zeroReading: "Zero. If nothing stops when that person leaves, you don't have this pain, and the number just said so. An instrument that sold fear would show you a number here; this one shows what the math gives. If the other pains add up to more than zero, that's where your money is.",
        restart2: "Run a different pain",
      },
    },
  },

  pt: {
    meta: {
      title: "Miranda Faria: Consultoria & Tecnologia",
      description:
        "Sistemas sob medida, BI, automação e identidade visual para negócios que já não cabem mais na planilha.",
      skip: "Pular para o conteúdo",
      pages: {
        home: "Sistemas completos (marca, produto e dados como um só) construídos sob medida, entregues rápido.",
        work: "Sistemas de gestão, sites e identidade entregues de ponta a ponta: peças, logística, agronegócio, comércio e arte.",
        servicos: "Quatro soluções, um princípio de operação: sistemas, sites, design e automação.",
        about: "Conheça a Miranda Faria e a abordagem por trás dos seus sites, sistemas e automações.",
        how: "Do diagnóstico à implantação: escopo definido, prévia para avaliar e orientação para usar a solução.",
        insights: "Um questionário sobre a rotina da empresa, com prioridades e um plano inicial baseado nas respostas.",
        contact: "Conte o que precisa mudar na sua empresa. Vamos entender a rotina e definir o próximo passo.",
        practice: "Sistemas de gestão, sites, automação e identidade, do entendimento da rotina à entrega.",
        apontador: "Lê o AFD do relógio de ponto (Portaria 671) e mostra faltas, horas extras e absenteísmo por setor. Peça um diagnóstico grátis do seu AFD.",
      },
    },
    nav: {
      home: "Início",
      gestao: "Sistemas & Gestão",
      design: "Design",
      desenvolvimento: "Desenvolvimento",
      work: "Trabalhos",
      howIWork: "Como funciona",
      about: "Sobre",
      services: "Serviços",
      technology: "Tecnologia",
      insights: "Diagnóstico",
      contact: "Contato",
      menu: "Abrir o menu",
      close: "Fechar",
      toggle: "View in English",
    },
    home: {
      wordmark: "Miranda Faria",
      role: "Consultoria & Tecnologia",
      thesis: {
        label: "O que fazemos",
        lead: "Estruturamos a base que sustenta o seu negócio.",
        body: "A Miranda Faria desenvolve sites, sistemas de gestão e automações a partir do trabalho que a sua empresa precisa fazer.",
      },
      pitch: {
        label: "Onde isso dói",
        lead: "O sistema começa onde a planilha trava.",
        items: [
          {
            t: "O preço mora na sua cabeça",
            d: "Você sabe de cor, mas ninguém mais sabe. Quando você não está, a venda para.",
          },
          {
            t: "O estoque tem duas versões",
            d: "Uma certa, na sua memória. Outra errada, na planilha. As duas em uso ao mesmo tempo.",
          },
          {
            t: "O relatório custa duas horas",
            d: "Todo mês, montado na mão. E ainda assim ninguém confia inteiramente no número.",
          },
        ],
      },
      workTeaser: {
        label: "Trabalhos",
        lead: "Projetos em campo.",
        cta: "Ver todos os trabalhos",
      },
      contactTeaser: {
        label: "Conversar",
        lead: "Conte onde está travando.",
        cta: "Chamar no WhatsApp",
      },
      heroCta: "Vamos conversar",
      netHint: "passe o mouse · arraste os nós · clique para explorar",
      sobrePreview: {
        label: "Miranda Faria",
        lead: "A tecnologia começa na rotina da sua empresa.",
        body: [
          "Um catálogo que vive no WhatsApp, um estoque difícil de conferir, um relatório refeito todo mês. É desse trabalho que partimos para definir o projeto.",
          "Desenhamos a presença digital e construímos os sistemas que apoiam a operação. O diagnóstico orienta o que entra primeiro, e você acompanha a solução tomando forma.",
        ],
        cta: "Conheça nossas soluções",
      },
      techPreview: {
        label: "Tecnologia",
        lead: "Stack enxuto, dirigido por método.",
        stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Python", "Figma", "IA / LLMs", "Automações"],
        cta: "Saiba mais",
      },
      trabalhoPreview: {
        cta: "Ver todos os projetos",
      },
            insightsPreview: {
        label: "Diagnóstico",
        lead: "Onde sua operação perde tempo?",
        intro:
          "Responda sobre sua rotina e receba prioridades com um plano inicial.",
        cta: "Fazer o diagnóstico",
      },
      finalCta: { label: "Próximo passo", lead: "Conte o que precisa funcionar melhor.", cta: "Chamar no WhatsApp" },
    },
    work: {
      label: "Trabalhos",
      lead: "Projetos em campo.",
      intro:
        "Projetos entregues de ponta a ponta: marca, interface, banco de dados e publicação, em mais de dez setores. Os que têm domínio próprio estão linkados ao vivo: entre e veja. Os confidenciais seguem em imagem e vídeo.",
      viewCase: "Ler o case",
      productsLabel: "Produtos próprios",

      viewProduct: "Ver o produto",
      sections: {
        problem: "Problema",
        process: "Processo",
        decisions: "Decisões",
        impact: "Resultado",
      },
      factsSector: "Setor",
      factsRole: "Papel",
      factsYear: "Ano",
      linkLabel: "Ver ao vivo",
      filterLabel: "Filtrar os trabalhos",
      filterSector: "SETOR",
      filterSolution: "SOLUÇÃO",
      filterAll: "Todos",
      emptyFilter: "Nenhum projeto corresponde a esses filtros. Limpe a seleção para ver o portfólio completo.",
      clearFilter: "Limpar filtro",
      factsPractice: "Solução",
      factsDelivery: "Entregue",
      factsDeliverySystems: "Sistema completo",
      factsDeliverySite: "Site completo",
      factsDeliveryDesign: "Sistema de identidade",
      factsDeliveryAutomation: "Automação",
      backToIndex: "Todos os trabalhos",
      nextCase: "Próximo projeto",
    },
    howIWork: {
      label: "Como funciona",
      lead: "Quatro camadas por trás de cada entrega.",
      intro:
        "Conectamos identidade, interface, dados e implantação ao trabalho que a empresa precisa realizar. As decisões de cada camada orientam a seguinte, do primeiro desenho ao uso no dia a dia.",
      science:
        "Em um estudo com 179 grandes empresas de capital aberto, o uso de dados nas decisões foi associado a produtividade 5 a 6% acima do esperado para os demais investimentos (Brynjolfsson, Hitt e Kim, 2011). Na Miranda Faria, isso orienta uma prática: definir critérios, acompanhar os dados e testar o que melhora a operação.",
      layers: [
        {
          t: "Superfície",
          d: "Marca, tipografia, movimento: o que o visitante sente. Decidido primeiro, porque limita tudo que vem abaixo.",
        },
        {
          t: "Sistema",
          d: "Arquitetura da interface, estados, rotas e controles organizados em torno das tarefas que o cliente precisa realizar.",
        },
        {
          t: "Dados",
          d: "O modelo por baixo: entidades, relações, o que é calculado e o que é guardado. Onde a maioria dos projetos quebra em silêncio.",
        },
        {
          t: "Fundação",
          d: "Hospedagem, publicação e titularidade fazem parte da entrega. Acessos e documentação apoiam a continuidade do uso pelo cliente.",
        },
      ],
      stack: {
        label: "Stack",
        lead: "Ferramentas enxutas, dirigidas por método.",
        items: [
          "React / Vite: interface e aplicação",
          "Tailwind CSS: tokens de design que o código lê",
          "Node.js / Python: automação e integrações",
          "Figma: design de identidade e interface",
          "IA / LLMs: alavanca nas partes mecânicas",
          "APIs REST: sistemas que conversam com sistemas",
        ],
      },
      demo: {
        label: "Ao vivo, agora",
        lead: "Três provas rodando nesta página.",
        body:
          "Nada abaixo é vídeo, GIF ou slide: são três painéis calculando neste instante, no seu navegador, sem nenhuma biblioteca de animação. Se está segurando 60 quadros por segundo, é porque a matemática aguenta.",
        items: [
          {
            tag: "01",
            name: "Campo vetorial",
            hint: "Passe o cursor sobre o campo.",
            caption:
              "Centenas de partículas num campo de fluxo que reage ao seu cursor. Canvas 2D puro, zero dependências, desenhado em tempo real.",
          },
          {
            tag: "02",
            name: "Curvas de movimento",
            hint: "Arraste por cima pra ler o tempo.",
            caption:
              "Linear, exponencial de saída e elástica: a coreografia de easing que rege o movimento deste site, desenhada como matemática escrita à mão. Passe o cursor pra congelar o instante e ler o valor de cada curva; tire, e elas seguem dançando sozinhas.",
          },
          {
            tag: "03",
            name: "Tempo de quadro",
            hint: "Pressione e arraste: quebre os 60fps.",
            caption:
              "O tempo real de cada quadro desta página, medido ao vivo. Pressione e arraste pelo painel pra injetar carga e ver a linha subir acima da meta de 16,7ms: solte e veja ela se recuperar. Performance se mede, não se promete.",
          },
        ],
      },
      ai: {
        label: "Sobre IA",
        lead: "Ferramentas com revisão e responsabilidade.",
        body: "Usamos IA para apoiar pesquisa, programação e estudos visuais. Arquitetura, conteúdo e interface passam por revisão antes da entrega. Quando uma imagem é um estudo gerado, sua origem é identificada.",
      },
    },
    about: {
      label: "Sobre a Miranda Faria",
      lead: "Tecnologia aplicada a negócios reais.",
      portraitFallback: "EMF",
      name: "Eduardo Miranda Faria",
      body: [
        "A Miranda Faria desenvolve sites, sistemas e automações para empresas que precisam organizar a operação e apresentar melhor a sua oferta. Cada projeto começa pela rotina: quem usa, o que precisa acontecer e quais informações sustentam o trabalho. Esse entendimento orienta a interface, os dados e a implantação.",
        "Eduardo Miranda Faria fundou a empresa e conduz os projetos, do diagnóstico à entrega. Sua atuação reúne design, desenvolvimento e gestão.",
        "Usamos IA no desenvolvimento e na criação visual, com revisão humana das decisões e das entregas.",
      ],
      location: "Piumhi, Minas Gerais · atendimento para todo o Brasil.",
      facadeCaption: "Arte generativa de marca: IA",
      trajectoryLabel: "Trajetória",
      trajectory: "O portfólio reúne quatorze projetos entre distribuição de peças, logística, agronegócio, comércio e arte. São sites, sistemas de estoque, uma central de vendas e a identidade da 22ª Roda de Agronegócios, conectando design e tecnologia à rotina de cada negócio.",
      principlesLabel: "Como decidimos",
      principles: [
        {
          t: "Projeto guiado pela operação",
          d: "Definimos o escopo a partir do trabalho que a empresa precisa realizar.",
        },
        {
          t: "Entrega que o cliente consegue usar",
          d: "Definimos no projeto a interface, os acessos e a orientação para uso.",
        },
        {
          t: "Decisões acompanhadas de revisão",
          d: "Ferramentas aceleram a produção; cada entrega precisa ser conferida.",
        },
      ],
    },
    contact: {
      signCaption: "A marca na rua: estudo generativo (IA)",
      label: "Conversar",
      lead: "Conte o que precisa funcionar melhor.",
      body: "Conte o que precisa mudar e como o negócio funciona hoje. Esse contexto ajuda a definir o próximo passo em conjunto.",
      primary: "Chamar no WhatsApp",
      secondary: "Mandar e-mail",
      response: "Retornamos pelo contato que você informar.",
      form: {
        title: "Ou deixe seus dados",
        body: "Conte o que precisa mudar e como o negócio funciona hoje.",
        name: "Nome",
        email: "E-mail",
        company: "Empresa",
        type: "Tipo de projeto",
        types: { gestao: "Sistemas & Gestão", design: "Design", desenvolvimento: "Desenvolvimento (sites)" },
        message: "Mensagem",
        whatsapp: "Prefere agendar reunião por WhatsApp?",
        submit: "Enviar",
        sending: "Enviando…",
        error: "Confira os campos obrigatórios.",
        errorServer: "Tente novamente ou fale com a Miranda Faria pelo WhatsApp.",
        sent: "Mensagem recebida. Vamos analisar seu pedido e retornar pelo contato informado.",
      },
    },
    sellers: {
      label: "Vendedores",
      lead: "Quer vender com a gente?",
      body:
        "Quem vende as soluções da Miranda Faria conta com roteiros, treinamento e uma central para acompanhar os contatos. Fale sobre uma parceria pelo WhatsApp ou acesse o aplicativo de vendas.",
      wa: "Falar no WhatsApp",
      app: "Entrar no app dos vendedores",
    },
    consent: {
      title: "Aviso de privacidade",
      text: "Este site usa medição própria anônima e o Google Analytics para saber quais páginas ajudam, e quais atrapalham. A medição própria não coleta dado pessoal; o Analytics usa cookies do Google (política de privacidade na página Política).",
      accept: "Aceitar",
      decline: "Só o necessário",
      policy: "Política",
    },
    footer: {
      tagline: "Miranda Faria · Consultoria & Tecnologia · Brasil",
      privacy: "Política de Privacidade",
      report: "Reportar problema",
      linkedin: "LinkedIn",
      sellers: "App dos vendedores",
    },
    servicos: {
      label: "Serviços",
      lead: "Quatro soluções, um princípio de operação.",
      intro:
        "Sistemas, design, gestão e automação: cada um entrega sozinho, todos desenhados para funcionar como um só.",
      metricsLabel: "Entregas na prática",
      metrics: [
        { n: "Escopo", d: "A proposta define o que será entregue, as etapas e os critérios para conferir o projeto." },
        { n: "Prévia", d: "Você avalia a solução durante o desenvolvimento, antes da entrega final." },
        { n: "Acesso", d: "A entrega inclui os acessos, os materiais e a orientação previstos no projeto." },
      ],
      bandLayers: ["Superfície", "Sistema", "Dados", "Fundação"],
      bandStat:
        "Quando pedidos, estoque e atendimento ficam desconectados, a equipe precisa conferir tudo de novo. Estruturar essa rotina dá à empresa informações melhores para decidir.",
      bandSource: "IBGE · SEBRAE",
      verticalsLabel: "As soluções",
      faq: [
        {
          q: "O que você faz, exatamente?",
          a: "Um projeto pode começar por um problema da operação ou por uma ideia de marca, produto ou negócio. A Miranda Faria conecta identidade, interface, sistemas e dados em torno dessa necessidade. A proposta define o escopo e o que será entregue.",
        },
        {
          q: "Faz BI ou análise de dados?",
          a: "A modelagem de dados faz parte do trabalho. As informações que a empresa já usa podem alimentar painéis, relatórios e indicadores de estoque, vendas e caixa. O objetivo é tornar esses números úteis nas decisões do dia a dia.",
        },
        {
          q: "Quanto custa?",
          a: "O escopo define o preço. O diagnóstico ajuda a identificar prioridades, e a conversa esclarece o trabalho antes de preparar uma proposta sob medida. Essa proposta descreve a entrega e os seus limites.",
        },
        {
          q: "Em quanto tempo fica pronto, e depois da entrega?",
          a: "O prazo depende do escopo, das integrações e do material disponível. A proposta define as etapas e quando você poderá avaliar uma prévia. A entrega inclui os acessos e a orientação previstos no projeto. Manutenção e evolução são combinadas separadamente.",
        },
      ],
      faqLabel: "O que perguntam antes de fechar",
      seeVertical: "Ver a solução",
      cards: {
        gestao: "Pedidos organizados em um sistema que a empresa opera e controla.",
        design: "Uma marca reconhecível, com clareza em cada contato.",
        desenvolvimento: "Um site que apresenta a oferta com clareza e abre um caminho direto para o contato.",
        automacao: "Rotinas automatizadas que conectam gatilhos, mensagens e sistemas da empresa.",
      },
      cta: "Começar um projeto",
    },
    diag: {
      label: "Diagnóstico",
      lead: "Quanto está vazando por mês?",
      intro:
        "Responda sobre a rotina da empresa e receba prioridades com um plano inicial. As recomendações partem das suas respostas.",
      evidence:
        "Um número para guardar: a média das empresas demora 42 horas para responder um lead: Harvard Business Review. Um sistema existe pra você ficar do lado certo desse número.",
      steps: { pain: "A dor", driver: "O driver", base: "O porte", urgency: "A urgência" },
      painQ: "Onde dói mais hoje?",
      painHint: "Escolha o principal.",
      pains: [
        {
          id: "marketplace",
          t: "O marketplace fica com a comissão",
          d: "iFood, Mercado Livre, Rappi: comissão em cada venda, e o cliente é deles.",
        },
        {
          id: "excel",
          t: "Vivo de planilha e papel",
          d: "Estoque, pedido e caixa no Excel: ou na cabeça de alguém.",
        },
        {
          id: "curiosos",
          t: "Muita mensagem de curioso, pouca venda",
          d: "Horas do dia gastas respondendo quem nunca compra, e o cliente de verdade espera.",
        },
        {
          id: "pessoa",
          t: "Dependo de uma pessoa",
          d: "Se ela sai, o processo e os clientes saem junto.",
        },
        {
          id: "cego",
          t: "Não sei de onde vêm as vendas",
          d: "Decisão de preço e estoque no chute.",
        },
      ],
      driverQ: {
        marketplace: { q: "Que fatia das suas vendas passa por marketplace?", opts: [["0.20", "Até 20%"], ["0.35", "20 a 50%"], ["0.60", "Mais de 50%"]] },
        excel: { q: "Quantos pedidos ou lançamentos por semana passam pela mão de alguém?", opts: [["25", "Até 50"], ["125", "50 a 200"], ["600", "200 a 1.000"], ["1500", "Mais de 1.000"]] },
        curiosos: { q: "Quantas conversas por semana não viram venda?", opts: [["5", "Até 10"], ["20", "10 a 30"], ["65", "30 a 100"], ["150", "Mais de 100"]] },
        pessoa: { q: "Se essa pessoa sair amanhã, o que para?", opts: [["atendimento", "O atendimento"], ["processo", "O processo inteiro"], ["documentado", "Nada: está documentado"]] },
        cego: { q: "Com que frequência você define preço ou compra sem número na frente?", opts: [["sempre", "Quase sempre"], ["asvezes", "Às vezes"], ["quase_nunca", "Quase nunca"]] },
      },
      baseQ: {
        marketplace: { q: "Faturamento mensal aproximado?", hint: "Faixas: ninguém precisa de número exato aqui.", opts: [["8000", "Até R$ 10 mil"], ["20000", "R$ 10 a 30 mil"], ["60000", "R$ 30 a 100 mil"], ["180000", "Mais de R$ 100 mil"]] },
        excel: { q: "Quanto custa um erro desses, aproximadamente?", hint: "Estimativa sua: a literatura mede a taxa de erro, não o real.", opts: [["25", "Até R$ 50"], ["75", "R$ 50 a 100"], ["150", "R$ 100 a 200"]] },
        curiosos: { q: "Quanto custa a hora dessa pessoa?", hint: "Custo-hora cheio, em faixas.", opts: [["10", "Até R$ 20/h"], ["30", "R$ 20 a 40/h"], ["60", "R$ 40 a 80/h"]] },
        pessoa: { q: "Salário mensal aproximado dessa pessoa?", hint: "Faixas.", opts: [["1500", "Até R$ 2 mil"], ["3500", "R$ 2 a 5 mil"], ["7500", "R$ 5 a 10 mil"], ["14000", "Mais de R$ 10 mil"]] },
        cego: { q: "Faturamento mensal aproximado?", hint: "A margem entra como média setorial, e o resultado avisa isso.", opts: [["8000", "Até R$ 10 mil"], ["20000", "R$ 10 a 30 mil"], ["60000", "R$ 30 a 100 mil"], ["180000", "Mais de R$ 100 mil"]] },
      },
      urgencyQ: "Quando você quer resolver?",
      urgencies: [
        { id: "now", t: "Já está sangrando", d: "Cada mês de atraso custa dinheiro de verdade." },
        { id: "months", t: "Nos próximos meses", d: "Está no plano, mas não pode empurrar pra sempre." },
        { id: "later", t: "Planejando o ano que vem", d: "Quero entender o tamanho antes." },
      ],
      result: {
        label: "Seu vazamento estimado",
        range: "piso conservador",
        to: "a",
        perMonth: "por mês",
        perYear: "por ano",
        delayCost: "Cada mês de atraso custa pelo menos",
        natureLabel: "Estimativa de modelo: não é resultado medido",
        sourceLabel: "Fonte",
        accountLabel: "A conta, na tela",
        limitNote:
          "Esta estimativa usa faixas de mercado. Três números apertam ela: sua comissão real, seu ticket médio e quantos pedidos você processa por semana. É isso que a gente levanta na conversa.",
        recoveryLabel: "O que a solução de fato recupera",
        solutionLabel: "O que resolve",
        solutionSee: "Ver a solução",
        cta: "Falar no WhatsApp com o diagnóstico pronto",
        restart: "Refazer o diagnóstico",
        copyCta: "Copiar resultado",
        copied: "Copiado",
        back: "Voltar",
        reading: "É o preço de manter as coisas como estão: não um orçamento, um vazamento.",
        zeroReading: "Zero. Se nada para quando a pessoa sai, você não tem essa dor, e o número acabou de dizer isso. Um instrumento que vendesse medo mostraria um número aqui; este mostra o que a conta dá. Se as outras dores derem mais que zero, é lá que está o seu dinheiro.",
        restart2: "Testar outra dor",
      },
    },
  },
};

/**
 * Cases, por idioma. `slug` e compartilhado entre idiomas de proposito:
 * /en/work/motormoura e /pt/work/motormoura sao a mesma pagina em
 * idiomas diferentes, o que mantem o hreflang simples e correto.
 */
export const cases = {
  en: [
    {
      slug: "queijos-serra",
      practice: "gestao",
      role: "Direction, design & development",
      name: "Queijos da Serra",
      sector: "Artisanal cheese production",
      year: "2024",
      media: { dir: "queijos-serra", shots: 3, video: true },
      summary:
        "Lot-level inventory with FEFO priority and tiered expiry alerts, for a product that spoils.",
      problem:
        "A cheese producer tracking lots on paper and in memory. With a perishable product the cost of losing track is not an inconvenience: it is stock thrown away, and the loss is usually discovered only once the batch is already past date.",
      process:
        "The inventory was modelled around each lot. Every entry carries its own code, expiry date, quantity, unit cost and physical location, whether in the display case or cold room. The dashboard follows that data model, so its numbers are calculated from records rather than typed in.",
      decisions:
        "FEFO orders lots by expiry date. Alerts are grouped by urgency: under 3 days, 4 to 7, 8 to 14 and 15 to 30. An audit trail records who moved each item, supporting stock checks and traceability.",
      impact:
        "Stock left paper and became queryable by lot. Product near expiry surfaces on its own instead of being found after the fact.",
    },
    {
      slug: "roda-agro",
      practice: "desenvolvimento",
      role: "Direction, design & development",
      name: "Roda de Agronegócios",
      sector: "Agribusiness trade fair",
      year: "2026",
      media: { dir: "roda-agro", shots: 3, video: false },
      summary:
        "Exhibition space sold from an interactive floor map, across five pricing tiers.",
      problem:
        "A regional agribusiness fair in its 22nd edition selling exhibition space by phone and spreadsheet. Every enquiry needed someone to check by hand which booths were still free, and two salespeople could promise the same spot.",
      process:
        "Built the floor as data rather than as a picture: each booth is a record with tier, position and status. The public map reads that state, so availability is the system's answer instead of a person's memory.",
      decisions:
        "Five pricing tiers instead of one price, each tied to a physical zone with its own characteristics: external grass, external paved, interior under structure, premium interior. That mirrors how the fair actually sells: position is the product. Payment terms and included promotion are stated on the page, because in this market the negotiation always reaches them anyway.",
      impact:
        "Availability is visible instead of asked for, and the spot a buyer picks is the spot the system holds.",
    },
    {
      slug: "paulo-henrique",
      practice: "desenvolvimento",
      role: "Direction, design & development",
      name: "Paulo Henrique",
      sector: "Athlete and performance coach",
      year: "2026",
      media: { dir: "paulo-henrique", shots: 3, video: true },
      summary:
        "Presentation site with a performance lab the visitor actually uses.",
      problem:
        "A competing athlete and coach whose credibility lived on social media and disappeared into the feed. A prospective client had nowhere to see the method, the results, and the way to start.",
      process:
        "Identity and site built together, in a dark register that suits the subject without collapsing into the generic dark-mode gym template. Added a performance lab: body mass index and waist-to-height ratio, each with an explanation of what it is, what it is for, and where it stops being useful.",
      decisions:
        "The calculators turn the visitor's inputs into a useful result. The copy explains the method and its limits, keeping the guidance grounded in what the tools can show.",
      impact:
        "One address where the method, the results and the way to start finally sit together.",
    },
    {
      slug: "motormoura",
      practice: "gestao",
      role: "Direction, design & development",
      name: "MotorMoura",
      sector: "Auto parts distribution",
      year: "2026",
      summary:
        "A distinct digital presence for a technical distributor, from the introduction to the catalogue.",
      problem:
        "A parts distributor needs to explain what it supplies and give buyers a clear route to an enquiry. The website brings its brands, product ranges and contact channels together.",
      process:
        "The public pages introduce the distributor and organise the search by product range. The catalogue structure includes categories, brands and applications for technical parts.",
      decisions:
        "The distributor’s identity carries through the opening, brand section and product ranges. On mobile, the hierarchy keeps the introduction and contact options easy to find.",
      impact:
        "A company website with a catalogue structure and routes to the sales team. The public catalogue is still being populated; the project is presented in its current state.",
      media: { dir: "motormoura", shots: 3, video: false },
      link: "https://motormouraequipamentos.com.br",
    },
    {
      slug: "1000-pecas",
      practice: "gestao",
      role: "Direction, design & development",
      name: "1000 Peças Truck Center",
      sector: "Heavy vehicle parts",
      year: "2026",
      summary: "From the business introduction to finding a heavy vehicle part.",
      problem:
        "Finding a heavy vehicle part requires clear information about its application, brand and condition. The website connects the business introduction with a public catalogue and a route to an enquiry.",
      process:
        "The presentation and catalogue share a visual language. The public catalogue separates new and used parts and provides brand and category filters alongside model and condition information.",
      decisions:
        "Prices remain part of a quote conversation. Typography, colour and hierarchy keep the introduction, catalogue and mobile journey connected, with contact access available throughout.",
      impact:
        "A company website, a public parts catalogue and a route to request a quote. The catalogue uses the institutional images currently supplied by the business.",
      media: { dir: "1000-pecas", shots: 3, video: true },
    },
    {
      slug: "rota-forte",
      practice: "desenvolvimento",
      role: "Direction, design & development",
      name: "Rota Forte",
      sector: "Munck and crane rental",
      year: "2026",
      summary: "Presenting the fleet before the first conversation.",
      problem:
        "Before requesting a quote, a visitor needs to understand which equipment fits the job. The website brings the fleet, technical information and contact routes into the same journey.",
      process:
        "The fleet guides the website’s structure. Each machine is presented with its specifications, while the operations section organises information about the types of work described by the business.",
      decisions:
        "Capacity, reach and equipment type help prepare an enquiry. The catalogue leads to a WhatsApp message identifying the selected machine; the business confirms availability and terms.",
      impact:
        "A company website with an equipment catalogue and a route to quote enquiries. The delivery gives visitors a clear way to explore the fleet before contacting the team.",
      media: { dir: "rota-forte", shots: 3, video: true },
    },
    {
      slug: "miranda-faria",
      practice: "design",
      role: "Direction, design & development",
      name: "This site",
      sector: "Miranda Faria",
      year: "2026",
      summary:
        "Our own website brings together the identity, interface, interactions and technology developed for Miranda Faria. The images below show the running site.",
      problem:
        "The website needed to demonstrate how Miranda Faria connects identity, digital presence and business systems. Its own interface became a place to show that work in use.",
      process:
        "The visual identity set the direction for the palette, typography and geological motifs. Those decisions became reusable design rules and interactive elements, including the M in the opening section. The development process explored several approaches before reaching the current composition.",
      decisions:
        "The diagnostic turns answers about a business's routine into priorities and an initial plan. The technology page demonstrates motion and measures frame times in the browser. Separate Portuguese and English routes support navigation, while WhatsApp, Calendly, email and the contact page offer ways to continue the conversation.",
      impact:
        "The site is a working example of Miranda Faria's approach, connecting identity, content, interface, data and publication in one project.",
      media: { dir: "miranda-faria", shots: 5, video: true },
    },
    {
      slug: "motormoura-marca",
      practice: "design",
      role: "Direction, design & development",
      name: "MotorMoura: Identity",
      sector: "Auto parts distribution",
      year: "2026",
      summary: "Complete brand kit: logo, manual, cards, seals and print material.",
      problem:
        "A B2B parts distributor whose materials were made ad hoc: a logo in one style, a flyer in another, and no rule to hold either.",
      process:
        "The identity includes a logotype with positive, white, monochrome and standalone-icon versions. A usage manual, business cards, email signature, seals and WhatsApp stickers carry the same rules into daily use.",
      decisions:
        "The kit was organised by use: identity, sales deck, go-to-market visuals, print kit, and complementary material. A distributor does not need art; it needs rules that survive any printer.",
      impact:
        "A visual identity and application kit to guide the distributor’s communications.",
      media: { dir: "motormoura-marca", shots: 3, video: false },
    },
    {
      slug: "1000-pecas-marca",
      practice: "design",
      role: "Direction, design & development",
      name: "1000 Peças: Identity",
      sector: "Heavy vehicle parts",
      year: "2026",
      summary: "Brand, signage, uniform and social for a certified dismantler.",
      problem:
        "A certified heavy-vehicle dismantler with the credibility of paperwork and the visual presence of any corner shop.",
      process:
        "The identity connects the facade, uniforms and social media, giving the business a consistent presence from the street to the screen.",
      decisions:
        "Made certification the axis of the identity: in a market full of scrap, the paper that proves it is a design asset.",
      impact:
        "A visual identity applied to the facade, uniform and communication materials presented in the project.",
      media: { dir: "1000-pecas-marca", shots: 1, video: false }, // 02/03 têm telefone provisório e "ROTAFORTE" — fora até o dono decidir
    },
    {
      slug: "roda-agro-marca",
      practice: "design",
      role: "Direction, design & development",
      name: "Roda de Agronegócios: Identity",
      sector: "Agribusiness events",
      year: "2026",
      summary: "Identity for the 22nd edition, applied to the backdrop, invitation and exhibitor communications.",
      problem:
        "A regional fair in its 22nd edition with exhibitors promoting their presence in any which way: each one inventing their own art, none of it recognisably the same event.",
      process:
        "The edition’s seal anchors the communication. The identity appears on the event backdrop, public invitation and reservation notice, with a recognisable visual language across the pieces.",
      decisions:
        "Each piece serves a different reading task. The backdrop identifies the event; the invitation brings together the programme and visitor information; the notice sets out reservation deadlines for exhibitors. The format follows the content, preserving the readability of each message.",
      impact:
        "The project also included management of the event’s Instagram profile. During the period tracked, the campaign recorded 79.6 thousand views and more than 200 new followers.",
      media: { dir: "roda-agro-marca", shots: 4, video: false },
    },
    {
      slug: "uaiso-travel",
      practice: "desenvolvimento",
      role: "Studio project · with Thales Machado Souza",
      name: "Uai Sô Travel",
      sector: "Bespoke travel agency",
      year: "2026",
      media: { dir: "uaiso-travel", shots: 3, video: false },
      summary:
        "A bespoke travel agency: curated itineraries with the quote delivered straight into a WhatsApp conversation.",
      problem:
        "Travelers who want a tailored itinerary don't fit shelf packages, and the agency lived entirely inside WhatsApp, with no storefront that showed its way of traveling.",
      process:
        "An institutional site presenting domestic and international destinations, handing the trip over through a planning form or a direct conversation.",
      decisions:
        "The site presents curated travel experiences. Each destination opens a conversation about an itinerary, with pricing discussed as the trip takes shape.",
      impact:
        "The agency gained a storefront of its own: the client arrives already fluent in the travel style, and the next step is a conversation, not a catalogue.",
    },
    {
      slug: "advogados-lco",
      practice: "desenvolvimento",
      role: "Project by Thales Machado Souza",
      name: "LCO Advogados",
      sector: "Corporate law boutique",
      year: "2026",
      media: { dir: "advogados-lco", shots: 3, video: false },
      link: "https://advogadoslco.com.br",
      summary:
        "A corporate-law boutique (corporate, tax and wealth structuring) in a site that builds trust before the first conversation.",
      problem:
        "A client's legal structure is not sold off a price table: it takes authority, clear practice areas and a direct path to the partner in charge.",
      process:
        "Institutional site with explicit practice areas and three intake channels: WhatsApp, e-mail and a scheduling form.",
      decisions:
        "A restrained layout, clear practice areas and direct copy guide visitors to a conversation with the responsible lawyer.",
      impact:
        "A company website with practice areas, information about the firm and ways to contact the responsible lawyer.",
    },
    {
      slug: "sevalho-controladoria",
      practice: "desenvolvimento",
      role: "Studio project · with Thales Machado Souza",
      name: "Sevalho Controladoria",
      sector: "Financial controllership",
      year: "2026",
      media: { dir: "sevalho-controladoria", shots: 3, video: false },
      link: "https://sevalhocontroladoria.com.br",
      summary:
        "Financial controllership consulting: a free diagnosis as the front door for SMBs trying to leave the financial chaos behind.",
      problem:
        "An SMB owner who does not know the company's real result does not hire consulting from a service description: he hires when someone names his pain.",
      process:
        "A capture landing page with one clear offer: a free diagnosis, direct WhatsApp, and the promise of finding the real economic result.",
      decisions:
        "One page, one offer, one step. No service menu: the invitation is the diagnosis, and the relationship starts there.",
      impact:
        "A company website with controllership services and a diagnostic entry point for a business conversation.",
    },
    {
      slug: "vaf-global",
      practice: "desenvolvimento",
      role: "Studio project · with Thales Machado Souza",
      name: "VAF Global",
      sector: "International deal desk",
      year: "2026",
      media: { dir: "vaf-global", shots: 3, video: false },
      link: "https://vafglobal.com.br",
      summary:
        "An international deal desk: business intermediation between Brazil, Portugal and the UAE, written in corporate-grade Portuguese.",
      problem:
        "International deals die of distance: counterparty, capital and decision scattered, with no channel that translated the operation for the decision-maker.",
      process:
        "An institutional portal positioning the practice (M&A, foreign trade, B2B expansion) and capturing counterparties through a form.",
      decisions:
        "The register of an international firm, not a startup landing: content hierarchy, proof of network, and a clear invitation to counterparties.",
      impact:
        "A company website presenting the international business and directing visitors to a contact channel.",
    }
  ],
  pt: [
    {
      slug: "queijos-serra",
      practice: "gestao",
      role: "Direção, design e desenvolvimento",
      name: "Queijos da Serra",
      sector: "Produção de queijo artesanal",
      year: "2024",
      media: { dir: "queijos-serra", shots: 3, video: true },
      summary:
        "Estoque rastreado por lote, com prioridade FEFO e alertas escalonados de validade.",
      problem:
        "Produtor de queijo controlando lote no papel e na memória. Com produto perecível, perder o controle não é transtorno: é mercadoria no lixo, e a perda quase sempre só aparece quando o lote já venceu.",
      process:
        "Modelamos o estoque em torno do lote. Cada entrada carrega código próprio, validade, quantidade, custo unitário e localização física, no expositor ou na câmara fria. O painel segue esse modelo de dados: os números são calculados a partir dos registros.",
      decisions:
        "A regra FEFO orienta a saída pela validade do lote. Os alertas são agrupados por urgência: menos de 3 dias, 4 a 7, 8 a 14 e 15 a 30. A trilha de auditoria registra quem movimentou cada item, apoiando a conferência do estoque e a rastreabilidade.",
      impact:
        "O estoque saiu do papel e virou consultável por lote. Produto perto do vencimento aparece sozinho, em vez de ser descoberto depois.",
    },
    {
      slug: "roda-agro",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
      name: "Roda de Agronegócios",
      sector: "Feira de agronegócio",
      year: "2026",
      media: { dir: "roda-agro", shots: 3, video: false },
      summary:
        "Venda de estande por mapa interativo, em cinco faixas de cota.",
      problem:
        "Feira regional de agronegócio na 22ª edição vendendo espaço por telefone e planilha. Cada consulta exigia alguém conferir na mão quais estandes ainda estavam livres, e dois vendedores podiam prometer o mesmo ponto.",
      process:
        "Estruturamos a planta com um registro para cada estande: cota, posição e status. O mapa público usa esses dados para mostrar a disponibilidade.",
      decisions:
        "Cinco faixas de cota em vez de preço único, cada uma amarrada a uma zona física com características próprias: área externa em grama, externa asfaltada, interna sob estrutura, interna premium. É assim que a feira vende de fato: a posição é o produto. Condições de pagamento e divulgação incluída ficam na página, porque nesse mercado a negociação chega nelas de qualquer jeito.",
      impact:
        "A disponibilidade fica visível em vez de ser perguntada, e o ponto que o expositor escolhe é o ponto que o sistema segura.",
    },
    {
      slug: "paulo-henrique",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
      name: "Paulo Henrique",
      sector: "Atleta e coach de performance",
      year: "2026",
      media: { dir: "paulo-henrique", shots: 3, video: true },
      summary:
        "Site de apresentação com um laboratório de performance que o visitante usa de verdade.",
      problem:
        "Atleta competidor e coach com a credibilidade morando em rede social e sumindo no feed. Quem queria contratar não tinha onde ver o método, os resultados e o caminho para começar.",
      process:
        "Identidade e site construídos juntos, num registro escuro que combina com o assunto sem cair no template genérico de academia. Somei um laboratório de performance: índice de massa corporal e relação cintura-estatura, cada um com explicação do que é, para que serve e onde deixa de servir.",
      decisions:
        "As calculadoras transformam as informações do visitante em um resultado útil. O texto explica o método e os seus limites, mantendo a orientação ligada ao que as ferramentas conseguem mostrar.",
      impact:
        "Um endereço só, onde método, resultado e caminho para começar finalmente ficam juntos.",
    },
    {
      slug: "motormoura",
      practice: "gestao",
      role: "Direção, design e desenvolvimento",
      name: "MotorMoura",
      sector: "Distribuidora de autopeças",
      year: "2026",
      summary:
        "Uma presença própria para a distribuidora, da apresentação ao catálogo.",
      problem:
        "Uma distribuidora de peças precisa explicar o que fornece e orientar quem procura atendimento. O site reúne marcas, linhas de produto e canais de contato em uma mesma experiência.",
      process:
        "As páginas públicas apresentam a distribuidora e organizam a procura por linha de produto. A estrutura do catálogo reúne categorias, marcas e aplicações das peças técnicas.",
      decisions:
        "A identidade da distribuidora acompanha a abertura, as marcas e as linhas de produto. No celular, a hierarquia mantém a apresentação e os canais de atendimento fáceis de encontrar.",
      impact:
        "Site institucional, estrutura de catálogo e caminhos para a equipe comercial. O catálogo público segue em atualização; as telas mostram o estado atual do projeto.",
      media: { dir: "motormoura", shots: 3, video: false },
      link: "https://motormouraequipamentos.com.br",
    },
    {
      slug: "1000-pecas",
      practice: "gestao",
      role: "Direção, design e desenvolvimento",
      name: "1000 Peças Truck Center",
      sector: "Peças para caminhão",
      year: "2026",
      summary: "Da apresentação da empresa à procura por uma peça para veículo pesado.",
      problem:
        "Encontrar uma peça para veículo pesado pede informações claras sobre aplicação, marca e condição. O site conecta a apresentação da empresa ao catálogo público e ao pedido de orçamento.",
      process:
        "A apresentação e o catálogo compartilham a mesma linguagem visual. O catálogo público separa peças novas e usadas e oferece filtros de marca e categoria, com identificação de modelo e condição.",
      decisions:
        "Os preços seguem para uma conversa de orçamento. Tipografia, cores e hierarquia conectam apresentação, catálogo e navegação no celular, com acesso ao atendimento ao longo do caminho.",
      impact:
        "Site institucional, catálogo público de peças e caminho para solicitar orçamento. O catálogo usa as imagens institucionais disponíveis atualmente na operação.",
      media: { dir: "1000-pecas", shots: 3, video: true },
    },
    {
      slug: "rota-forte",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
      name: "Rota Forte",
      sector: "Locação de munck e guindaste",
      year: "2026",
      summary: "Apresentar a frota antes do primeiro contato.",
      problem:
        "Antes de pedir um orçamento, o visitante precisa entender qual equipamento se aproxima da sua operação. O site reúne frota, informações técnicas e caminhos de contato em uma mesma navegação.",
      process:
        "A frota orienta a estrutura do site. Cada máquina é apresentada com suas especificações, enquanto a seção de operações organiza informações sobre os tipos de trabalho descritos pela empresa.",
      decisions:
        "Capacidade, alcance e tipo de equipamento ajudam a preparar a consulta. O catálogo encaminha ao WhatsApp com a máquina selecionada na mensagem; a empresa confirma disponibilidade e condições.",
      impact:
        "Site institucional, catálogo de equipamentos e caminho para solicitar orçamento. A entrega permite conhecer a frota antes de conversar com a equipe.",
      media: { dir: "rota-forte", shots: 3, video: true },
    },
    {
      slug: "miranda-faria",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "Este site",
      sector: "Miranda Faria",
      year: "2026",
      summary:
        "O site da Miranda Faria reúne identidade, interface, interações e tecnologia em um projeto próprio. As imagens abaixo mostram o site em funcionamento.",
      problem:
        "O site precisava demonstrar como a Miranda Faria conecta identidade, presença digital e sistemas para o negócio. A própria interface se tornou um lugar para mostrar esse trabalho em uso.",
      process:
        "A identidade orientou a paleta, a tipografia e os motivos de estratos geológicos. Essas decisões se tornaram regras de design reutilizáveis e elementos interativos, incluindo o M da abertura. O desenvolvimento explorou diferentes caminhos até chegar à composição atual.",
      decisions:
        "O Diagnóstico transforma respostas sobre a rotina da empresa em prioridades e um plano inicial. A página Tecnologia demonstra interações e mede o tempo dos quadros no navegador. As rotas em português e inglês organizam a navegação, e o contato pode continuar pelo WhatsApp, Calendly, e-mail ou pela página de contato.",
      impact:
        "O próprio site demonstra a abordagem da Miranda Faria, conectando identidade, conteúdo, interface, dados e publicação em um projeto.",
      media: { dir: "miranda-faria", shots: 5, video: true },
    },
    {
      slug: "motormoura-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "MotorMoura: Identidade",
      sector: "Distribuidora de autopeças",
      year: "2026",
      summary: "Brand kit completo: logo, manual, cartões, selos e material de impressão.",
      problem:
        "Uma distribuidora B2B cujo material era feito solto: um logo num estilo, um flyer noutro, e nenhuma regra segurando nenhum.",
      process:
        "A identidade reúne logotipo em versões positiva, branca, monocromática e de ícone isolado. Manual de uso, cartões de visita, assinatura de e-mail, selos e figurinhas de WhatsApp levam as mesmas regras para as peças do dia a dia.",
      decisions:
        "O kit foi organizado por uso: identidade, sales deck, kit visual de go-to-market, impressão e materiais complementares. Distribuidora não precisa de arte; precisa de regras que sobrevivam a qualquer gráfica.",
      impact:
        "Identidade visual e materiais de aplicação reunidos em um kit para orientar a comunicação da distribuidora.",
      media: { dir: "motormoura-marca", shots: 3, video: false },
    },
    {
      slug: "1000-pecas-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "1000 Peças: Identidade",
      sector: "Desmanche de caminhões",
      year: "2026",
      summary: "Marca, fachada, uniforme e redes sociais para um desmanche certificado.",
      problem:
        "Um desmanche de caminhões certificado, com a credibilidade do papel timbrado e a presença visual de qualquer oficina de esquina.",
      process:
        "A identidade conecta fachada, uniforme e redes sociais, mantendo uma apresentação consistente da rua à tela.",
      decisions:
        "A certificação virou o eixo da identidade: num mercado cheio de sucata, o papel que prova é ativo de design.",
      impact:
        "Identidade visual aplicada à fachada, ao uniforme e aos materiais de comunicação apresentados no projeto.",
      media: { dir: "1000-pecas-marca", shots: 1, video: false }, // 02/03 têm telefone provisório e "ROTAFORTE" — fora até o dono decidir
    },
    {
      slug: "roda-agro-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "Roda de Agronegócios: Identidade",
      sector: "Eventos de agronegócio",
      year: "2026",
      summary: "Identidade da 22ª edição aplicada ao painel, ao convite e à comunicação com expositores.",
      problem:
        "Uma feira regional na 22ª edição com expositores divulgando presença cada um por si: cada um inventando a própria arte, nada disso reconhecível como o mesmo evento.",
      process:
        "A comunicação parte do selo da edição. A identidade aparece no painel da feira, no convite ao público e no comunicado de reservas, com linguagem visual reconhecível entre as peças.",
      decisions:
        "Cada peça atende a uma leitura. O painel identifica o evento; o convite reúne programação e informações para o visitante; o comunicado organiza os prazos de reserva para expositores. O formato acompanha o conteúdo, preservando a leitura de cada mensagem.",
      impact:
        "O projeto também incluiu a gestão do Instagram do evento. No período acompanhado, a campanha registrou 79,6 mil visualizações e mais de 200 novos seguidores.",
      media: { dir: "roda-agro-marca", shots: 4, video: false },
    },
    {
      slug: "uaiso-travel",
      practice: "desenvolvimento",
      role: "Projeto do escritório · com Thales Machado Souza",
      name: "Uai Sô Travel",
      sector: "Turismo sob medida",
      year: "2026",
      media: { dir: "uaiso-travel", shots: 3, video: false },
      summary:
        "Agência de viagens sob medida: roteiros por curadoria, com a cotação chegando direto na conversa de WhatsApp.",
      problem:
        "Quem quer roteiro personalizado não cabe em pacote de prateleira, e a agência vivia só dentro do WhatsApp, sem vitrine que mostrasse o jeito dela de viajar.",
      process:
        "Institucional que apresenta destinos nacionais e internacionais e entrega o roteiro por formulário de planejamento ou conversa direta.",
      decisions:
        "O site apresenta viagens por curadoria. Cada destino abre uma conversa sobre o roteiro, e o preço é discutido conforme a viagem toma forma.",
      impact:
        "A agência ganhou vitrine própria: o cliente chega já entendendo o estilo de viagem, e o próximo passo é uma conversa, não um catálogo.",
    },
    {
      slug: "advogados-lco",
      practice: "desenvolvimento",
      role: "Projeto de Thales Machado Souza",
      name: "LCO Advogados",
      sector: "Advocacia empresarial",
      year: "2026",
      media: { dir: "advogados-lco", shots: 3, video: false },
      link: "https://advogadoslco.com.br",
      summary:
        "Boutique jurídica de advocacia empresarial (societário, tributário e patrimonial) em um site que constrói confiança antes da primeira conversa.",
      problem:
        "A estrutura jurídica do cliente não se vende por tabela de preço: precisa de autoridade, clareza de áreas de atuação e um caminho direto até o sócio responsável.",
      process:
        "Institucional com as áreas explicitadas e captação em três canais: WhatsApp, e-mail e formulário de agendamento.",
      decisions:
        "Uma composição sóbria, áreas de atuação claras e texto direto conduzem o visitante à conversa com o advogado responsável.",
      impact:
        "Site institucional com áreas de atuação, apresentação do escritório e caminhos para contato com o advogado responsável.",
    },
    {
      slug: "sevalho-controladoria",
      practice: "desenvolvimento",
      role: "Projeto do escritório · com Thales Machado Souza",
      name: "Sevalho Controladoria",
      sector: "Controladoria e finanças",
      year: "2026",
      media: { dir: "sevalho-controladoria", shots: 3, video: false },
      link: "https://sevalhocontroladoria.com.br",
      summary:
        "Consultoria de controladoria com o diagnóstico gratuito como porta de entrada para PMEs que querem sair do caos financeiro.",
      problem:
        "O dono de PME que não sabe o resultado real do próprio negócio não contrata consultoria por descrição de serviço: contrata quando alguém nomeia a dor dele.",
      process:
        "Landing de captação com uma oferta clara: diagnóstico gratuito, WhatsApp direto e a promessa de apurar o resultado econômico real.",
      decisions:
        "Uma página, uma oferta, um passo. Sem menu de serviços: o convite é o diagnóstico, e a relação começa nele.",
      impact:
        "Site institucional com serviços de controladoria e diagnóstico como ponto de entrada para a conversa comercial.",
    },
    {
      slug: "vaf-global",
      practice: "desenvolvimento",
      role: "Projeto do escritório · com Thales Machado Souza",
      name: "VAF Global",
      sector: "Negócios internacionais",
      year: "2026",
      media: { dir: "vaf-global", shots: 3, video: false },
      link: "https://vafglobal.com.br",
      summary:
        "Deal desk internacional: intermediação de negócios entre Brasil, Portugal e Emirados, apresentada em português de empresa.",
      problem:
        "Negócio internacional morre de distância: contraparte, capital e decisão espalhados, sem um canal que traduzisse a operação para quem decide.",
      process:
        "Portal institucional que posiciona a atuação (fusões e aquisições, comércio exterior, expansão B2B) e captura contrapartes por formulário.",
      decisions:
        "Registro de empresa internacional em vez de landing de startup: hierarquia de conteúdo, prova de rede e um convite claro a contrapartes.",
      impact:
        "Site institucional que apresenta a atuação internacional e direciona o visitante para o canal de contato.",
    }
  ],
};

/**
 * As tres verticais de pratica. Cada uma e uma aba profunda e
 * independente, com assinatura visual propria — nao uma secao rolada da
 * Home. Os cases sao transversais: /work lista todos, e cada vertical
 * lista os seus, pelo campo `practice`.
 *
 * A copy de `deliverables` resgata as quatro frentes de servico e a de
 * `process` os quatro passos que viviam em sections/Frentes.jsx e
 * sections/ComoFunciona.jsx — as duas secoes antigas que nunca tinham
 * sido portadas.
 */
export const PRACTICE_SLUGS = ["gestao", "desenvolvimento", "design", "automacao"];

export const practices = {
  en: {
    gestao: {
      slug: "gestao",
      label: "Systems & Management",
      lead: "A system the business owner can operate.",
      intro:
        "An order arrives on WhatsApp, is copied into a notebook and must later be checked against a spreadsheet. We turn those disconnected steps into a system for catalogues, inventory, orders and dashboards. The structure follows the way the business operates, with records that the owner can manage directly.",
      artAlt: "A grid of recorded cells where a decision is born and propagates on its own",
      artLabel: "MANAGEMENT: THE SYSTEM, LIVE",
      artHint: "Each dot is a recorded fact. Tap a cell: the decision propagates on its own.",
      thesis: {
        label: "MANAGEMENT: THE THESIS",
        title: "A spreadsheet is memory. A system is decision.",
        desc:
          "Every company with a process runs on memory today: whoever remembers, handles it, and whoever takes a vacation, freezes the operation. The spreadsheet is the past written down; the system is the present deciding on its own: the order that doesn't depend on who read the message, the stock that warns before it runs out, the number nobody reassembles by month's end. The difference between the two is the difference between operating and reacting, and between a business that depends on people and a business that works.",
      },
      deliverablesLabel: "What's included",
      deliverables: [
        {
          t: "Catalogue and inventory",
          d: "Products, categories, brands and photos modelled as real entities: not spreadsheet rows. One-tap search, filters a salesperson actually understands, edits the owner makes alone. Inventory stops being that notebook and starts warning you before it runs out.",
        },
        {
          t: "Ordering and workflow",
          d: "The order that stops dying inside a message thread: each one is born with status, history and an owner. Nobody resends screenshots, nobody asks whether it shipped: the system answers before the question exists.",
        },
        {
          t: "Dashboards and data",
          d: "Sales, stock and margin on one screen that updates itself. The monthly report stops being someone's afternoon watching the month go by: the panel is born ready, every day.",
        },
        {
          t: "Ownership",
          d: "The client registers, edits and publishes through the admin panel. Access, data and operating documentation support continued use of the system.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura and 1000 Peças: catalogues a customer can browse and a quote flow that runs without a phone call.",
        "Queijos da Serra: lot-level inventory with FEFO ordering and expiry alerts to support stock checks.",
        "The monthly report replaced by a panel that updates itself: a closing that took an afternoon now takes a minute.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "A recognisable brand, from first impression to the smallest detail.",
      intro:
        "Visual identity, interfaces and materials that keep a brand consistent. We connect how the company presents itself with what people need to understand and do.",
      artAlt: "Translucent planes composing, some still finding position",
      gen: {
        label: "VISUAL DIRECTION",
        title: "An identity that holds together in every application.",
        desc:
          "Logo, typography, colour and composition need to work together. We assess those choices where the brand will be used: on a screen, in print and in the details people notice.",
        capA: "Copper particles: identity in motion",
        capB: "Office entrance: AI-generated visual study",
        capLayers: "Disorder finding order: the method, in one shot",
        capSeam: "The copper seam: what runs under every project",
      },
      deliverablesLabel: "What's included",
      deliverables: [
        {
          t: "Identity",
          d: "Logotype, palette, typography and the applied pieces. Decided once, documented, and then held to across every surface.",
        },
        {
          t: "Design system",
          d: "Design tokens, a fluid type scale, spacing and motion rules become the variables used by the interface's code.",
        },
        {
          t: "Brand applications",
          d: "Digital and print materials follow the same visual direction. Templates and usage guidance help the team create new pieces without starting the identity again.",
        },
        {
          t: "Design that ships",
          d: "It arrives as running code, not as a file handed to someone else to interpret. Nothing is lost in translation because there is no translation.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura's identity includes its logo, manual, business cards, seals and print materials.",
        "1000 Peças: brand, signage, uniform and social, from one identity system.",
        "Identity for the 22nd Roda de Agronegócios, including the central seal, invitation and promotional materials.",
        "This website brings identity, motion and development together in one experience.",
      ],
      casesLabel: "Built this way",
      closingLine: "Every company has a brand. Few have one that carries its price.",
      closingCtaLabel: "Let's draw yours",
      closingCta: { label: "See the case of this site", to: "work/miranda-faria" },
      cta: "Start a project",
    },
    desenvolvimento: {
      slug: "desenvolvimento",
      label: "Development",
      lead: "Sites that work the lead, not just present it.",
      intro:
        "Company websites, landing pages and online catalogues organised around your offer. We make it clear what the business provides, help visitors find relevant information and give them a direct way to get in touch. The proposal defines the stages and delivery dates.",
      artAlt: "Dots wandering the page, turning to copper and leaving through the conversation",
      artLabel: "DEVELOPMENT: THE CONVERSATION",
      artHint: "Each dot is a visitor; copper is the one who converts. Lead them with your cursor.",
      thesis: {
        label: "DEVELOPMENT: THE THESIS",
        title: "A website isn't a shop window. It's the first salesperson.",
        desc:
          "A clear page helps visitors understand the offer and choose the next step. We organise its sections so enquiries arrive with context: what the person saw, which information they need and how the business can respond. The website then supports customer service and the sales process.",
      },
      deliverablesLabel: "What's included",
      deliverables: [
        {
          t: "Institutional site",
          d: "The business presented properly: what it does, for whom, and why it charges what it charges. Copy written to sell (not to fill a layout) and not one sentence that smells of template.",
        },
        {
          t: "WhatsApp-first pages",
          d: "A clear next step gives each enquiry context: the page the visitor saw and the information they need. Quote requests, bookings and orders can then reach the business through the appropriate channel.",
        },
        {
          t: "Capture and presentation",
          d: "Galleries, catalogues and calculators that make the visitor do something measurable before leaving, because a visit that leaves no trace doesn't exist for any analysis.",
        },
        {
          t: "Hosting and upkeep",
          d: "Fast, hosted, domain in the client's name. Changes ship in hours when the business asks, and the site keeps working every day, no day off, no salary.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "Rota Forte: a page whose only job is to route the right enquiry to WhatsApp, and it does.",
        "Paulo Henrique: a presentation site with a performance lab the visitor actually uses.",
        "1000 Peças: an institutional catalogue that routes quote requests to WhatsApp, reflecting the sales process in the interface.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    automacao: {
      slug: "automacao",
      label: "Automation",
      lead: "The repetitive work leaves human hands.",
      intro:
        "A client asks for a price, an order arrives through another channel and the same details have to be typed again. We connect messaging, spreadsheets and systems to reduce that repeated work. Automation handles the defined steps while people follow up exceptions and decisions. The same approach can support business systems, websites and operational routines.",
      artAlt: "A stream where loose information enters and structured data comes out",
      artLabel: "AUTOMATION: THE TRIGGER, LIVE",
      artHint: "Click to see the message become a reply, a record and a routine.",
      thesis: {
        label: "AUTOMATION: THE THESIS",
        title: "Every manual copy is an error waiting to happen.",
        desc:
          "Each time data passes from one hand to another, the operation pays a tax: time, error, rework. Automation cuts that tax: the message becomes a record, the record becomes a charge, the report assembles itself. What is left of the day becomes decision.",
      },
      deliverablesLabel: "What's included",
      deliverables: [
        {
          t: "Service that answers on its own",
          d: "WhatsApp and Instagram connected to the system to answer frequent questions, forward quote requests with context and create contact records.",
        },
        {
          t: "Integration between systems",
          d: "The form feeds the sheet, the sheet talks to the panel, the order is born in one place and shows up in the other. No double typing, no 'let me check here'.",
        },
        {
          t: "Routines that run by themselves",
          d: "Weekly report on Monday morning, low-stock warning, backups and syncs outside business hours. Repetitive work has a schedule, and it is not yours.",
        },
        {
          t: "AI where text becomes data",
          d: "AI helps turn descriptions into structured records, with fields such as brand, model, year and category. A person checks the result before it is used.",
        },
      ],
      proofLabel: "Proof in the field",
      proofs: [
        "MotorMoura: the dealer's free text (a road train described in three words) becomes a structured record read by AI: brand, model, year, power. On the same record, the system estimates which parts that equipment is likely to buy.",
        "Automation integrated with every other solution: in management, the low-stock alert is born on its own; on the website, the form delivers the lead ready; on WhatsApp, the first answer arrives before the coffee gets cold.",
      ],
      casesLabel: "Where it shows up",
      cta: "Tell us which tasks are still manual.",
    },
  },

  pt: {
    automacao: {
      slug: "automacao",
      label: "Automação",
      lead: "O trabalho repetitivo sai da mão humana.",
      intro:
        "O cliente pergunta um preço, o pedido chega por outro canal e a mesma informação precisa ser digitada de novo. Conectamos atendimento, planilhas e sistemas para reduzir esse trabalho repetido. A automação cuida das etapas definidas, e as pessoas acompanham exceções e decisões. Essa abordagem pode apoiar o sistema de gestão, o site e as rotinas da empresa.",
      artAlt: "Uma mensagem chega e o gatilho a transforma sozinho em resposta, cadastro e rotina",
      artLabel: "AUTOMAÇÃO: O DISPARO, AO VIVO",
      artHint: "Clique para ver a mensagem virar resposta, cadastro e rotina.",
      thesis: {
        label: "AUTOMAÇÃO: A TESE",
        title: "Toda cópia manual é um erro esperando acontecer.",
        desc:
          "Cada vez que um dado passa de uma mão pra outra, a operação paga imposto: tempo, erro, retrabalho. Automação corta esse imposto: a mensagem vira cadastro, o cadastro vira cobrança, o relatório se monta sozinho. O que sobra do dia vira decisão.",
      },
      deliverablesLabel: "O que entregamos",
      deliverables: [
        {
          t: "Atendimento que responde sozinho",
          d: "WhatsApp e Instagram conectados ao sistema para responder perguntas frequentes, encaminhar orçamentos com contexto e registrar os contatos.",
        },
        {
          t: "Integração entre sistemas",
          d: "O formulário alimenta a planilha, a planilha conversa com o painel, o pedido nasce num lugar e aparece no outro. Sem digitação dupla, sem 'deixa eu conferir aqui'.",
        },
        {
          t: "Rotinas que rodam sozinhas",
          d: "Relatório semanal na segunda de manhã, aviso de estoque no limite, backup e sincronização fora do horário. O trabalho repetitivo tem hora marcada, e não é a sua.",
        },
        {
          t: "IA onde o texto vira dado",
          d: "A IA ajuda a transformar descrições em fichas estruturadas, com campos como marca, modelo, ano e categoria. Uma pessoa confere o resultado antes do uso.",
        },
      ],
      proofLabel: "Prova em campo",
      proofs: [
        "MotorMoura: o texto livre do lojista (uma carreta descrita em três palavras) vira ficha estruturada lida por IA: marca, modelo, ano, potência. Na mesma ficha, o sistema estima as peças que aquele equipamento tende a comprar.",
        "Automação integrada às outras soluções: na gestão, o alerta de estoque nasce sozinho; no site, o formulário entrega o lead pronto; no WhatsApp, a primeira resposta chega antes do café esfriar.",
      ],
      casesLabel: "Onde isso aparece",
      cta: "Me diz o que ainda é manual.",
    },
    gestao: {
      slug: "gestao",
      label: "Sistemas & Gestão",
      lead: "Um sistema que o dono do negócio consegue operar.",
      intro:
        "O pedido chega pelo WhatsApp, vai para um caderno e depois precisa ser conferido na planilha. Transformamos essas etapas soltas em um sistema para catálogo, estoque, pedidos e painéis. A estrutura acompanha a operação, com registros que o dono do negócio consegue administrar diretamente.",
      artAlt: "Uma grade de células anotadas onde uma decisão nasce e se propaga sozinha",
      artLabel: "GESTÃO: O SISTEMA AO VIVO",
      artHint: "Cada ponto é um dado anotado. Toque numa célula: a decisão se propaga sozinha.",
      thesis: {
        label: "GESTÃO: A TESE",
        title: "Planilha é memória. Sistema é decisão.",
        desc:
          "Toda empresa com processo roda hoje na memória de quem atende: quem lembra, resolve, e quem tira férias, trava a operação. A planilha é o passado anotado; o sistema é o presente decidindo sozinho: o pedido que não depende de quem leu a mensagem, o estoque que avisa antes de faltar, o número que ninguém precisa remontar no fim do mês. A diferença entre os dois é a diferença entre operar e reagir, e entre um negócio que depende de gente e um negócio que funciona.",
      },
      deliverablesLabel: "O que entregamos",
      deliverables: [
        {
          t: "Catálogo e estoque",
          d: "Produtos, categorias, marcas e fotos modelados como entidades de verdade: não como linhas de planilha. Busca em um toque, filtro que o vendedor entende, edição que o dono faz sozinho. O estoque deixa de ser aquele caderno e passa a avisar antes de faltar.",
        },
        {
          t: "Pedidos e fluxo",
          d: "O pedido que deixa de morrer dentro de uma conversa: cada um nasce com status, histórico e dono. Ninguém reenvia print, ninguém pergunta se já saiu: o sistema responde antes de pergunta existir.",
        },
        {
          t: "Painéis e dados",
          d: "Venda, estoque e margem numa tela que atualiza sozinha. O relatório mensal deixa de ser uma tarde de alguém vendo o mês passar: o painel já nasce pronto, todos os dias.",
        },
        {
          t: "Propriedade",
          d: "O cliente cadastra, edita e publica pelo painel administrativo. Acessos, dados e documentação de uso apoiam a continuidade da operação.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "MotorMoura e 1000 Peças: catálogos que o cliente navega e um fluxo de orçamento que roda sem telefonema.",
        "Queijos da Serra: estoque por lote com ordenação FEFO e alertas por validade, apoiando o acompanhamento do vencimento.",
        "O relatório mensal substituído por um painel que atualiza sozinho: fechamento que era tarde virou minuto.",
      ],
      casesLabel: "Feitos assim",
      cta: "Começar um projeto",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "Uma marca reconhecível, do primeiro contato aos detalhes.",
      intro:
        "Identidade visual, interfaces e materiais que mantêm a marca consistente. Conectamos a apresentação da empresa ao que as pessoas precisam entender e fazer.",
      artAlt: "Planos translúcidos se compondo, alguns ainda assentando",
      gen: {
        label: "DIREÇÃO VISUAL",
        title: "Uma identidade que se sustenta em cada aplicação.",
        desc:
          "Logotipo, tipografia, cor e composição precisam funcionar juntos. Avaliamos essas escolhas onde a marca será usada: na tela, nos materiais impressos e nos detalhes que as pessoas percebem.",
        capA: "Partículas de cobre: identidade em movimento",
        capB: "Entrada de escritório: estudo visual gerado com IA",
        capLayers: "Desordem encontrando ordem: o método em um plano",
        capSeam: "O veio de cobre: o que corre por baixo de cada projeto",
      },
      deliverablesLabel: "O que entregamos",
      deliverables: [
        {
          t: "Identidade",
          d: "Logotipo, paleta, tipografia e as peças de aplicação. Decidido uma vez, documentado, e sustentado em toda superfície depois.",
        },
        {
          t: "Design system",
          d: "Tokens de design, escala tipográfica fluida, espaçamento e regras de movimento se tornam as variáveis usadas pelo código da interface.",
        },
        {
          t: "Aplicações da marca",
          d: "Materiais digitais e impressos seguem a mesma direção visual. Modelos e orientações de uso ajudam a equipe a criar novas peças sem redesenhar a identidade a cada vez.",
        },
        {
          t: "Design que vira código",
          d: "Chega funcionando, não como arquivo para outra pessoa interpretar. Nada se perde na tradução porque não existe tradução.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "A identidade da MotorMoura reúne logo, manual, cartões, selos e materiais de impressão.",
        "1000 Peças: marca, fachada, uniforme e social, de um sistema de identidade só.",
        "Identidade da 22ª Roda de Agronegócios, com selo central, convite e peças de divulgação.",
        "Este site reúne identidade, movimento e desenvolvimento em uma única experiência.",
      ],
      casesLabel: "Feitos assim",
      closingLine: "Toda empresa tem uma marca. Poucas têm uma que sustenta o preço.",
      closingCtaLabel: "Vamos desenhar a sua",
      closingCta: { label: "Ver o case deste site", to: "work/miranda-faria" },
      cta: "Começar um projeto",
    },
    desenvolvimento: {
      slug: "desenvolvimento",
      label: "Desenvolvimento",
      lead: "Site que trabalha o lead, não só apresenta.",
      intro:
        "Sites institucionais, landing pages e catálogos organizados em torno da sua oferta. Apresentamos o que a empresa faz, ajudamos o visitante a encontrar a informação certa e criamos um caminho direto para o contato. As etapas e os prazos são definidos na proposta.",
      artAlt: "Pontos que vagam pela página, convertem em cobre e saem pela conversa",
      artLabel: "DESENVOLVIMENTO: A CONVERSA",
      artHint: "Cada ponto é um visitante; o cobre é quem converte. Conduza-os com o cursor.",
      thesis: {
        label: "DESENVOLVIMENTO: A TESE",
        title: "Um site não é vitrine. É o primeiro vendedor.",
        desc:
          "Uma página clara ajuda o visitante a entender a oferta e escolher o próximo passo. Organizamos as seções para que o contato chegue com contexto: o que a pessoa viu, de que informação precisa e como a empresa pode responder. A presença digital passa a apoiar o atendimento e o processo comercial.",
      },
      deliverablesLabel: "O que entregamos",
      deliverables: [
        {
          t: "Site institucional",
          d: "O negócio apresentado direito: o que faz, pra quem, e por que cobra o que cobra. Texto escrito pra vender (não pra preencher layout) e nenhuma frase com cheiro de template.",
        },
        {
          t: "Páginas WhatsApp-first",
          d: "Um próximo passo claro dá contexto ao contato: a página que a pessoa viu e a informação de que precisa. Pedidos de orçamento, agendamentos e consultas podem chegar ao canal adequado da empresa.",
        },
        {
          t: "Captura e apresentação",
          d: "Galerias, catálogos e calculadoras que fazem o visitante fazer algo mensurável antes de ir embora, porque visita que não deixa rastro não existe pra análise nenhuma.",
        },
        {
          t: "Hospedagem e manutenção",
          d: "Rápido, hospedado, domínio no nome do cliente. Mudança sobe em horas quando o negócio pede, e o site segue trabalhando todos os dias, sem folga, sem salário.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "Rota Forte: uma página cujo único trabalho é levar o orçamento certo pro WhatsApp, e ela leva.",
        "Paulo Henrique: site de apresentação com um laboratório de performance que o visitante usa de verdade.",
        "1000 Peças: catálogo institucional que encaminha pedidos de orçamento para o WhatsApp, com a estratégia comercial refletida na interface.",
      ],
      casesLabel: "Feitos assim",
      cta: "Começar um projeto",
    },
  },
};

/**
 * Os quatro passos sao os mesmos nas tres verticais, e isso e o
 * argumento: o processo nao muda conforme o que voce compra.
 */
/**
 * Os quatro passos sao os mesmos nas tres verticais, e isso e o
 * argumento: o processo nao muda conforme o que voce compra.
 */
export const designSteps = {
  pt: {
    label: "Como funciona",
    steps: [
      {
        t: "Entender antes de desenhar",
        d: "O diagnóstico é gratuito, e é onde o resultado se decide: o preço que a marca precisa sustentar, o cliente que precisa reconhecê-la, a superfície onde ela vai viver.",
      },
      {
        t: "Direções, não promessas",
        d: "Estudos generativos ajudam a explorar diferentes direções. Você avalia as propostas com o material à vista, depois da revisão de design.",
      },
      {
        t: "Um sistema, não um logo",
        d: "Símbolo, tipografia, cor e regras de uso: o conjunto que faz qualquer peça sair certa, do cartão à fachada, sem depender de quem desenhou.",
      },
      {
        t: "Entregue viva",
        d: "Impresso, social e web, com os arquivos organizados por uso. A identidade chega funcionando em toda parte: não em PDF.",
      },
    ],
  },
  en: {
    label: "How it runs",
    steps: [
      {
        t: "Understand before drawing",
        d: "The diagnosis is free, and it is where the outcome is decided: the price the brand must sustain, the client who must recognise it, the surface where it will live.",
      },
      {
        t: "Directions, not promises",
        d: "Generative studies help explore different directions. You review the proposals with the work in front of you, after a design review.",
      },
      {
        t: "A system, not a logo",
        d: "Symbol, type, colour and usage rules: the set that makes any piece come out right, from card to facade, without depending on who drew it.",
      },
      {
        t: "Delivered alive",
        d: "Print, social and web, with files organised by use. The identity arrives working everywhere: not as a PDF.",
      },
    ],
  },
};

export const processSteps = {
  en: {
    label: "How it runs",
    steps: [
      { t: "Diagnosis", d: "One conversation to find where the process jams. No cost." },
      { t: "Fixed scope", d: "A proposal with deliverable, deadline and price set. No surprise later." },
      { t: "Build", d: "You follow along during, not only at the end." },
      { t: "Handover", d: "System live, you trained to operate it. The infrastructure is in your name." },
    ],
  },
  pt: {
    label: "Como funciona",
    steps: [
      { t: "Diagnóstico", d: "Uma conversa para entender onde o processo trava. Sem custo." },
      { t: "Escopo fechado", d: "Proposta com entrega, prazo e valor definidos. Sem surpresa depois." },
      { t: "Construção", d: "Você acompanha durante, não só no final." },
      { t: "Entrega e autonomia", d: "Sistema no ar, você treinado para operar. A infraestrutura fica no seu nome." },
    ],
  },
};

export function getPractice(lang, slug) {
  return practices[lang]?.[slug] ?? null;
}

export function casesOfPractice(lang, slug) {
  return (cases[lang] ?? []).filter((c) => c.practice === slug);
}

export function getCase(lang, slug) {
  return cases[lang]?.find((c) => c.slug === slug) ?? null;
}
