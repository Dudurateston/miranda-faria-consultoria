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
      title: "Miranda Faria — Design Engineer & Creative Technologist",
      description:
        "I design and build complete web systems — brand, product and data as one — with an orchestrated AI workflow.",
      skip: "Skip to content",
      pages: {
        home: "Complete web systems — brand, product and data as one — built end-to-end, shipped fast.",
        work: "Management systems, websites and identity delivered end to end — parts, logistics, agribusiness, retail and the arts.",
        servicos: "Four solutions, one operating principle: systems, websites, design and automation.",
        about: "Design engineer working across brand, product and data — technology applied to a business that actually exists.",
        how: "How a project runs here: diagnosis first, demo in the first week, delivery in the owner's hands.",
        insights: "Four questions and a defensible estimate of what the problem costs — before any talk of price or technology.",
        contact: "Bring the problem, not a spec. Same-day response, straight from who builds it.",
        practice: "Management systems, websites, automation and identity — one hand from diagnosis to delivery.",
      },
    },
    nav: {
      home: "Home",
      gestao: "Systems & Management",
      design: "Design",
      desenvolvimento: "Development",
      work: "Work",
      howIWork: "How I work",
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
      role: "Design Engineer & Creative Technologist",
      thesis: {
        label: "What I do",
        lead: "I build the structure a business runs on.",
        body: "Brand, product and data as one system — designed and shipped by one person, so nothing is lost in the handoff between a design team, a front-end team and a data team.",
      },
      pitch: {
        label: "Why solo works",
        lead: "One mind across the whole stack.",
        items: [
          {
            t: "No handoff loss",
            d: "The person who designs the interface is the person who writes it and the person who models the data behind it. Intent survives all the way to production.",
          },
            {
            t: "AI as leverage, not shortcut",
            d: "I use an orchestrated AI workflow to move faster through the mechanical parts. Every decision that matters — architecture, hierarchy, what to cut — is mine.",
          },
          {
            t: "Full working-day overlap",
            d: "Based in Brazil (UTC−3): a complete overlap with US hours and a partial one with Europe. Same-day iteration, not next-day.",
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
        lead: "Tell me where it's stuck.",
        cta: "Book a call",
      },
      heroCta: "Get in touch",
      netHint: "hover · drag the nodes · click to explore",
      sobrePreview: { label: "About", cta: "Learn more" },
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
        lead: "What does it cost to leave it unsolved?",
        intro:
          "Three questions and an estimate of what the problem drains per month — the same diagnosis I run in a first conversation, in forty seconds.",
        cta: "Run the diagnosis",
      },
      finalCta: { label: "Next step", lead: "Tell me where it breaks — the answer lands the same day.", cta: "Message on WhatsApp" },
    },
    work: {
      label: "Work",
      lead: "Systems in the field.",
      intro:
        "Projects shipped end to end — brand, interface, data model and deployment, across nine sectors. Those with their own domain are linked live: go see for yourself. The client-confidential ones stay on screens and recordings.",
      viewCase: "Read the case",
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
      emptyFilter: "No project in this cut yet — it exists, it just hasn't shipped. Clear the filter and take the full tour.",
      clearFilter: "Clear filter",
      factsPractice: "Solution",
      factsDelivery: "Delivered",
      factsDeliverySystems: "Complete system",
      factsDeliverySite: "Complete site",
      backToIndex: "All work",
      nextCase: "Next project",
    },
    howIWork: {
      label: "How I work",
      lead: "Four layers, one person.",
      intro:
        "Every project moves through the same four layers. They are the reason a single person can carry a whole system without it falling apart in the middle.",
      science:
        "And there is science under the method, not taste: across 136 studies, a statistical rule beats expert judgement by ~10% in decision accuracy (Grove et al., 2000, Psychological Assessment), and companies that decide on data run 5–6% more productive than their peers (Brynjolfsson, Hitt & Kim, 2011, 179 public companies). Deciding by number is not a preference — it is measured.",
      layers: [
        {
          t: "Surface",
          d: "Brand, typography, motion, the thing a visitor actually feels. Decided first, because it constrains everything below it.",
        },
        {
          t: "System",
          d: "Interface architecture, states, routes, the parts a user operates. Built to be run by the owner, not by me.",
        },
        {
          t: "Data",
          d: "The model underneath: entities, relationships, what is derived and what is stored. Where most projects quietly break.",
        },
        {
          t: "Foundation",
          d: "Hosting, deployment, ownership. The infrastructure ends up in the client's name — I leave, it keeps running.",
        },
      ],
      stack: {
        label: "Stack",
        lead: "Lean tools, directed by method.",
        items: [
          "React / Vite — interface and application",
          "Tailwind CSS — design tokens the code reads",
          "Node.js / Python — automation and integrations",
          "Figma — identity and interface design",
          "AI / LLMs — leverage across the mechanical parts",
          "REST APIs — systems that talk to systems",
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
              "Linear, exponential-out and elastic — the easing choreography that governs this site's motion, drawn as hand-written math. Hover to freeze time under your cursor and read each curve's value; leave, and they dance on their own.",
          },
          {
            tag: "03",
            name: "Frame time",
            hint: "Press and drag — break the 60fps.",
            caption:
              "The real time of every frame of this page, measured live. Press and drag across the panel to inject load and watch the line climb over the 16.7ms budget — then release and see it recover. Performance is measured, not promised.",
          },
        ],
      },
      ai: {
        label: "On AI",
        lead: "Leverage, directed by judgment.",
        body: "AI writes a lot of the mechanical code and generates a lot of the first-draft visual material. It does not decide the architecture, the hierarchy, or what gets cut. Treating it as a shortcut is how you ship something generic; treating it as leverage is how one person ships what used to take a team.",
      },
    },
    about: {
      label: "About",
      lead: "Technology applied to a business that actually exists.",
      portraitFallback: "EMF",
      name: "Eduardo Miranda Faria",
      body: [
        "I'm Eduardo Miranda Faria. Miranda Faria carries my own name, and the M opening this site is mine: whoever talks to me talks to whoever builds — from the first WhatsApp voice note to the system running on your screen.",
        "I'm from Piumhi, in the Minas Gerais countryside, with an office in Belo Horizonte — working with companies across Brazil: parts distributors, repair shops, logistics, retail and services. The kind of business that has billed enough to know a loose spreadsheet doesn't scale anymore.",
        "I lead every project personally, brief to delivery, with AI as leverage through the whole process: it accelerates the code and the visual work; architecture, hierarchy and what gets cut stay mine to decide. Genuinely custom, without an agency's overhead — everything that leaves here passes through my hands before it reaches you.",
      ],
      location: "Piumhi, Minas Gerais — office in Belo Horizonte · working with clients across Brazil.",
      facadeCaption: "Generative brand art — AI",
      trajectoryLabel: "Trajectory",
      trajectory: "Fourteen jobs across parts distribution, logistics, agribusiness, commerce and the arts — brand, interface, data model and deployment, end to end. Along the way: sites that sell in the silence of WhatsApp, inventories that correct themselves, the sales manual I wrote for my own network, the identity of the 22nd Roda de Agronegócios — and the app that network still runs on so no lead gets lost.",
      principlesLabel: "How I decide",
      principles: [
        {
          t: "Custom, never template",
          d: "Every system starts from the client's operation, not from a theme. If it can be delivered by form, it does not need me.",
        },
        {
          t: "The owner operates it",
          d: "Delivery is only done when the client runs the system without me in the room. Infrastructure in their name, panel in their hands.",
        },
        {
          t: "AI as leverage, judgment as the work",
          d: "AI generates the drafts and writes the mechanical code. Architecture, hierarchy and what gets cut remain human decisions — mine.",
        },
      ],
    },
    contact: {
      signCaption: "The brand on the street — generative study (AI)",
      label: "Contact",
      lead: "Tell me where it's stuck.",
      body: "The fastest path is a short call. Bring the problem, not a spec — figuring out what to build is part of the work.",
      primary: "Book a call",
      secondary: "Send an email",
      response: "I answer the same day.",
      form: {
        title: "Or leave your details",
        body: "I read everything and answer the same day.",
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
        errorServer: "Something failed on the way. Try again, or reach me on WhatsApp.",
        sent: "Received — I'll be in touch today.",
      },
    },
    sellers: {
      label: "Sales reps",
      lead: "Want to sell with us?",
      body:
        "Who sells with me doesn't improvise: tested scripts, continuous training and a hub that keeps every lead in order. If you want structure behind your commission, message me — or jump straight into the reps' app.",
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
        "Systems, design, business intelligence and automation — each shippable alone, designed to work as one.",
      metricsLabel: "How I deliver — in numbers",
      metrics: [
        { n: "18", d: "Systems live in production, each on a real database — catalogue, orders, payment. Not slides: running software." },
        { n: "7 days", d: "A working demo in week one: your problem solved and visible, before paying for the whole project." },
        { n: "100%", d: "Delivery in your name: you run it, the data and access are yours. No lock-in, no strings — upkeep and evolution only if you want them." },
      ],
      bandLayers: ["Surface", "System", "Data", "Foundation"],
      bandStat:
        "About half of new US businesses never reach year five. It is rarely the market that runs out — it is the structure underneath.",
      bandSource: "U.S. Bureau of Labor Statistics",
      verticalsLabel: "The solutions",
      faq: [
        {
          q: "What do you do, exactly?",
          a: "Every project starts in one of two places: a problem to solve — the spreadsheet that locks up, the order that gets lost, the lead that goes cold — or an idea to bring to life — brand, concept, a whole business. From there I own the whole thing: identity, interface, system and data. Made-to-measure delivery: no templates, and the proposal describes exactly what will exist at the end.",
        },
        {
          q: "Do you do BI or data analysis?",
          a: "It's part of the delivery. The system doesn't just record: it models the data you already have and turns it into dashboards, reports and indicators — the number that changes a decision, visible in real time. Inventory, sales, cash: what lives in spreadsheets today becomes business reading.",
        },
        {
          q: "How much does it cost?",
          a: "The scope sets the price — which is exactly why the diagnosis exists: it sizes the pain first, and the price comes after, in the conversation, together with the made-to-measure proposal. No generic price list: what you receive describes exactly what will exist at the end.",
        },
        {
          q: "How long until it's ready — and after delivery?",
          a: "A system: weeks, not months. A site: even less. The first navigable demo ships in the first week — you watch your problem being solved before paying for the whole project. After that, the system is yours, in your name. If you want, maintenance and evolution stay with me — no lock-in, no strings.",
        },
      ],
      faqLabel: "What they ask before closing",
      seeVertical: "See the solution",
      cards: {
        gestao: "The order that dies in a chat thread — in a system you own.",
        design: "Brand and interface that justify the premium.",
        desenvolvimento: "A site that works the lead for you — it arrives ready, in your WhatsApp.",
        automacao: "Routines that run themselves: triggers, WhatsApp and systems talking — nobody pushing buttons.",
      },
      cta: "Start a project",
    },
    diag: {
      label: "Diagnosis",
      lead: "How much leaks out every month?",
      intro:
        "Four questions and a defensible estimate of what the problem costs — before any talk of price or technology. Size the pain first, prescribe second.",
      evidence:
        "Two numbers worth keeping: answering a customer within 5 minutes makes you 21× more likely to qualify them than taking 30 — MIT/InsideSales lead response study. And the average company takes 42 hours to answer a lead — Harvard Business Review. A system exists to keep you on the right side of those numbers.",
      steps: { pain: "The pain", driver: "The driver", base: "The size", urgency: "The urgency" },
      painQ: "Where does it hurt most today?",
      painHint: "Pick the main one.",
      pains: [
        {
          id: "marketplace",
          t: "The marketplace takes its cut",
          d: "Amazon, eBay, Etsy, delivery apps — a commission on every sale, and the customer belongs to them.",
        },
        {
          id: "excel",
          t: "I run on spreadsheets",
          d: "Inventory, orders and cash flow in Excel — or in someone's head.",
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
        marketplace: { q: "What share of your sales goes through a marketplace?", opts: [["0.20", "Up to 20%"], ["0.35", "20–50%"], ["0.60", "More than 50%"]] },
        excel: { q: "How many orders or entries pass through someone's hands per week?", opts: [["25", "Up to 50"], ["125", "50–200"], ["600", "200–1,000"], ["1500", "More than 1,000"]] },
        curiosos: { q: "How many conversations per week never become a sale?", opts: [["5", "Up to 10"], ["20", "10–30"], ["65", "30–100"], ["150", "More than 100"]] },
        pessoa: { q: "If that person left tomorrow, what stops?", opts: [["atendimento", "Customer service"], ["processo", "The whole process"], ["documentado", "Nothing — it's documented"]] },
        cego: { q: "How often do you set a price or make a purchase with no number in front of you?", opts: [["sempre", "Almost always"], ["asvezes", "Sometimes"], ["quase_nunca", "Almost never"]] },
      },
      baseQ: {
        marketplace: { q: "Approximate monthly revenue?", hint: "Ranges — no exact number needed.", opts: [["8000", "Up to $10k"], ["20000", "$10–30k"], ["60000", "$30–100k"], ["180000", "$100k+"]] },
        excel: { q: "What does one of those errors cost you, roughly?", hint: "An estimate — the literature measures the error rate, not the reais.", opts: [["12", "Up to $25"], ["37", "$25–50"], ["75", "$50–100"]] },
        curiosos: { q: "What does an hour of that person's time cost?", hint: "Fully-loaded hourly cost, ranges.", opts: [["7", "Up to $15/hr"], ["22", "$15–30/hr"], ["45", "$30–60/hr"]] },
        pessoa: { q: "Their approximate monthly salary?", hint: "Ranges.", opts: [["800", "Up to $1k"], ["1750", "$1–2.5k"], ["3750", "$2.5–5k"], ["6500", "$5k+"]] },
        cego: { q: "Approximate monthly revenue?", hint: "Margin is estimated as a sector average — and says so on the result.", opts: [["8000", "Up to $10k"], ["20000", "$10–30k"], ["60000", "$30–100k"], ["180000", "$100k+"]] },
      },
      urgencyQ: "When do you want this solved?",
      urgencies: [
        { id: "now", t: "It's bleeding now", d: "Every month of delay costs real money." },
        { id: "months", t: "In the next few months", d: "Planned — but it can't slide forever." },
        { id: "later", t: "Planning for next year", d: "I want the size of it first." },
      ],
      result: {
        label: "Your estimated leak",
        range: "conservative floor",
        to: "to",
        perMonth: "per month",
        perYear: "per year",
        delayCost: "Every month of delay costs at least",
        natureLabel: "Model estimate — not a measured result",
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
        reading: "This is the price of leaving things as they are — not a quote, a leak.",
        zeroReading: "Zero. If nothing stops when that person leaves, you don't have this pain — and the number just said so. An instrument that sold fear would show you a number here; this one shows what the math gives. If the other pains add up to more than zero, that's where your money is.",
        restart2: "Run a different pain",
      },
    },
  },

  pt: {
    meta: {
      title: "Miranda Faria — Consultoria & Tecnologia",
      description:
        "Sistemas sob medida, BI, automação e identidade visual para negócios que já não cabem mais na planilha.",
      skip: "Pular para o conteúdo",
      pages: {
        home: "Sistemas completos — marca, produto e dados como um só — construídos sob medida, entregues rápido.",
        work: "Sistemas de gestão, sites e identidade entregues de ponta a ponta: peças, logística, agronegócio, comércio e arte.",
        servicos: "Quatro soluções, um princípio de operação: sistemas, sites, design e automação.",
        about: "Design engineer entre marca, produto e dados — tecnologia aplicada a negócio que existe de verdade.",
        how: "Como um projeto corre por aqui: diagnóstico primeiro, demo na primeira semana, entrega na mão do dono.",
        insights: "Quatro perguntas e uma estimativa defensável do custo do seu problema — antes de falar de preço ou tecnologia.",
        contact: "Traga o problema, não a especificação. Resposta no mesmo dia, direto com quem executa.",
        practice: "Sistemas de gestão, sites, automação e identidade — uma mão só do diagnóstico à entrega.",
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
        label: "O que eu faço",
        lead: "Estruturo a base que sustenta o negócio.",
        body: "Catálogos, painéis e processos que funcionam sem depender de mim todo dia. A infraestrutura fica no seu nome — você opera, eu saio de cena.",
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
        lead: "Me conta onde está travando.",
        cta: "Chamar no WhatsApp",
      },
      heroCta: "Fale comigo",
      netHint: "passe o mouse · arraste os nós · clique para explorar",
      sobrePreview: { label: "Sobre", cta: "Saiba mais" },
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
        lead: "Quanto custa não resolver?",
        intro:
          "Três perguntas e uma estimativa do que o problema drena por mês — o mesmo diagnóstico que eu faria numa primeira conversa, em quarenta segundos.",
        cta: "Fazer o diagnóstico",
      },
      finalCta: { label: "Próximo passo", lead: "Me conta onde trava — a resposta chega no mesmo dia.", cta: "Chamar no WhatsApp" },
    },
    work: {
      label: "Trabalhos",
      lead: "Projetos em campo.",
      intro:
        "Projetos entregues de ponta a ponta — marca, interface, banco de dados e publicação, em nove setores. Os que têm domínio próprio estão linkados ao vivo: entre e veja. Os confidenciais seguem em imagem e vídeo.",
      viewCase: "Ler o case",
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
      emptyFilter: "Ainda não tem projeto nesse recorte — existe, só ainda não saiu. Limpe o filtro e veja o índice inteiro.",
      clearFilter: "Limpar filtro",
      factsPractice: "Solução",
      factsDelivery: "Entregue",
      factsDeliverySystems: "Sistema completo",
      factsDeliverySite: "Site completo",
      backToIndex: "Todos os trabalhos",
      nextCase: "Próximo projeto",
    },
    howIWork: {
      label: "Como funciona",
      lead: "Quatro camadas, uma pessoa.",
      intro:
        "Todo projeto passa pelas mesmas quatro camadas. É por isso que uma pessoa só consegue carregar o sistema inteiro sem ele desmontar no meio.",
      science:
        "E há ciência por baixo do método, não gosto: em 136 estudos, a regra estatística vence o julgamento de especialista em ~10% de precisão (Grove et al., 2000, Psychological Assessment) — e empresas que decidem por dado operam 5–6% mais produtivas que as demais (Brynjolfsson, Hitt & Kim, 2011, 179 empresas de capital aberto). Decidir por número não é preferência — é medido.",
      layers: [
        {
          t: "Superfície",
          d: "Marca, tipografia, movimento — o que o visitante sente. Decidido primeiro, porque limita tudo que vem abaixo.",
        },
        {
          t: "Sistema",
          d: "Arquitetura da interface, estados, rotas. Construído para o dono operar, não para depender de mim.",
        },
        {
          t: "Dados",
          d: "O modelo por baixo: entidades, relações, o que é calculado e o que é guardado. Onde a maioria dos projetos quebra em silêncio.",
        },
        {
          t: "Fundação",
          d: "Hospedagem, publicação, titularidade. A infraestrutura fica no seu nome — eu saio, o sistema continua.",
        },
      ],
      stack: {
        label: "Stack",
        lead: "Ferramentas enxutas, dirigidas por método.",
        items: [
          "React / Vite — interface e aplicação",
          "Tailwind CSS — tokens de design que o código lê",
          "Node.js / Python — automação e integrações",
          "Figma — design de identidade e interface",
          "IA / LLMs — alavanca nas partes mecânicas",
          "APIs REST — sistemas que conversam com sistemas",
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
              "Linear, exponencial de saída e elástica — a coreografia de easing que rege o movimento deste site, desenhada como matemática escrita à mão. Passe o cursor pra congelar o instante e ler o valor de cada curva; tire, e elas seguem dançando sozinhas.",
          },
          {
            tag: "03",
            name: "Tempo de quadro",
            hint: "Pressione e arraste — quebre os 60fps.",
            caption:
              "O tempo real de cada quadro desta página, medido ao vivo. Pressione e arraste pelo painel pra injetar carga e ver a linha subir acima da meta de 16,7ms — solte e veja ela se recuperar. Performance se mede, não se promete.",
          },
        ],
      },
      ai: {
        label: "Sobre IA",
        lead: "Alavanca dirigida por julgamento.",
        body: "A IA escreve boa parte do código mecânico e gera boa parte do primeiro rascunho visual. Ela não decide arquitetura, hierarquia, nem o que sai fora. Tratar como atalho é o caminho para entregar algo genérico; tratar como alavanca é como uma pessoa entrega o que antes exigia um time.",
      },
    },
    about: {
      label: "Quem faz",
      lead: "Tecnologia aplicada a negócio real.",
      portraitFallback: "EMF",
      name: "Eduardo Miranda Faria",
      body: [
        "Sou Eduardo Miranda Faria. A Miranda Faria leva o meu nome e o M que abre este site: quem conversa comigo fala com quem constrói — do primeiro áudio no WhatsApp até o sistema rodando na sua tela.",
        "Sou de Piumhi, interior de Minas Gerais, com escritório em Belo Horizonte — e operação em empresas de todo o Brasil: distribuidoras, oficinas, transportadoras, comércio e prestadores de serviço. Gente que já faturou o suficiente pra saber que planilha solta não escala mais.",
        "Lidero cada projeto pessoalmente, do briefing à entrega, com IA como alavanca em todo o processo: ela acelera o código e a criação visual; arquitetura, hierarquia e o que fica de fora continuam sendo decisão minha. Sob medida de verdade, sem o custo de uma agência — tudo que sai daqui passa pela minha mão antes de chegar na sua.",
      ],
      location: "Piumhi, Minas Gerais — escritório em Belo Horizonte · atendimento para todo o Brasil.",
      facadeCaption: "Arte generativa de marca — IA",
      trajectoryLabel: "Trajetória",
      trajectory: "Quatorze trabalhos entre distribuição de peças, logística, agronegócio, comércio e arte — marca, interface, modelo de dados e publicação, de ponta a ponta. No caminho: sites que vendem no silêncio do WhatsApp, estoques que se corrigem sozinhos, o manual de vendas que escrevi para a minha própria rede, a identidade da 22ª Roda de Agronegócios — e o aplicativo que essa rede usa até hoje para não perder um lead.",
      principlesLabel: "Como eu decido",
      principles: [
        {
          t: "Sob medida, nunca template",
          d: "Todo sistema nasce da operação do cliente, não de um tema. Se dá pra entregar por formulário, não precisa de mim.",
        },
        {
          t: "O dono opera",
          d: "Só está entregue quando o cliente roda o sistema sem mim na sala. Infraestrutura no nome dele, painel na mão dele.",
        },
        {
          t: "IA como alavanca, julgamento como trabalho",
          d: "A IA gera os rascunhos e escreve o código mecânico. Arquitetura, hierarquia e o que sai fora continuam sendo decisão humana — minha.",
        },
      ],
    },
    contact: {
      signCaption: "A marca na rua — estudo generativo (IA)",
      label: "Conversar",
      lead: "Me conta onde está travando.",
      body: "O caminho mais rápido é uma conversa curta. Traga o problema, não a especificação — descobrir o que construir faz parte do trabalho.",
      primary: "Chamar no WhatsApp",
      secondary: "Mandar e-mail",
      response: "Respondo no mesmo dia.",
      form: {
        title: "Ou deixe seus dados",
        body: "Eu leio tudo e respondo no mesmo dia.",
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
        errorServer: "Algo falhou no caminho. Tente de novo, ou me chame no WhatsApp.",
        sent: "Recebido — retorno hoje.",
      },
    },
    sellers: {
      label: "Vendedores",
      lead: "Quer vender com a gente?",
      body:
        "Quem vende comigo não vai no improviso: scripts testados, treino contínuo e uma central que organiza cada lead. Se quer estrutura por trás da sua comissão, chama no WhatsApp — ou entra direto no app dos vendedores.",
      wa: "Falar no WhatsApp",
      app: "Entrar no app dos vendedores",
    },
    consent: {
      title: "Aviso de privacidade",
      text: "Este site usa medição própria anônima e o Google Analytics para saber quais páginas ajudam — e quais atrapalham. A medição própria não coleta dado pessoal; o Analytics usa cookies do Google (política de privacidade na página Política).",
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
        "Sistemas, design, gestão e automação — cada um entrega sozinho, todos desenhados para funcionar como um só.",
      metricsLabel: "Como entrego — em números",
      metrics: [
        { n: "18", d: "Sistemas em operação, cada um com banco de dados real — catálogo, pedido, pagamento. Não é slide: é software rodando." },
        { n: "7 dias", d: "Demo funcional na primeira semana: o seu problema resolvido pra ver, antes de pagar o projeto inteiro." },
        { n: "100%", d: "Entrega no seu nome: você opera, os dados e o acesso são seus. Sem fidelidade, sem amarração — evolução e manutenção só se você quiser." },
      ],
      bandLayers: ["Superfície", "Sistema", "Dados", "Fundação"],
      bandStat:
        "6 em cada 10 empresas brasileiras não chegam ao quinto ano. Quase nunca falta mercado — falta estrutura por baixo.",
      bandSource: "IBGE · SEBRAE",
      verticalsLabel: "As soluções",
      faq: [
        {
          q: "O que você faz, exatamente?",
          a: "Todo projeto nasce de um de dois lugares: um problema pra resolver — a planilha que trava, o pedido que se perde, o lead que esfria — ou uma ideia pra tirar do papel — marca, conceito, negócio inteiro. Desse ponto em diante eu cuido do todo: identidade, interface, sistema e dados. Entrega sob medida: nada de template, a proposta descreve exatamente o que vai existir no fim.",
        },
        {
          q: "Faz BI ou análise de dados?",
          a: "Faz parte da entrega. O sistema não fica só registrando: modela os dados que você já tem e transforma em painéis, relatórios e indicadores — o número que muda a decisão, visível na hora. Estoque, vendas, caixa: o que hoje mora em planilha vira leitura de negócio.",
        },
        {
          q: "Quanto custa?",
          a: "O escopo define o preço — e é por isso que o diagnóstico existe: ele dimensiona a dor primeiro, e o preço vem depois, na conversa, junto com a proposta sob medida. Nada de tabela genérica: o que você recebe descreve exatamente o que vai existir no fim.",
        },
        {
          q: "Em quanto tempo fica pronto — e depois da entrega?",
          a: "Sistema: semanas, não meses. Site: menos ainda. A primeira demo navegável sai na primeira semana — você vê o seu problema sendo resolvido antes de pagar o projeto inteiro. Depois, o sistema é seu, no seu nome. Se quiser, manutenção e evolução continuam comigo — sem fidelidade, sem amarração.",
        },
      ],
      faqLabel: "O que perguntam antes de fechar",
      seeVertical: "Ver a solução",
      cards: {
        gestao: "O pedido que hoje morre na conversa — num sistema que é seu.",
        design: "Marca e interface que sustentam o preço premium.",
        desenvolvimento: "Site que trabalha por você — o lead chega pronto, no seu WhatsApp.",
        automacao: "Rotinas que rodam sozinhas: gatilhos, WhatsApp e sistemas conversando — ninguém apertando botão.",
      },
      cta: "Começar um projeto",
    },
    diag: {
      label: "Diagnóstico",
      lead: "Quanto está vazando por mês?",
      intro:
        "Quatro perguntas e uma estimativa defensável do custo do seu problema — antes de falar de preço ou de tecnologia. Primeiro o tamanho da dor, depois a solução.",
      evidence:
        "Dois números para guardar: quem responde a um cliente em 5 minutos tem 21× mais chance de qualificá-lo do que quem demora 30 — estudo de resposta a leads do MIT/InsideSales. E a média das empresas demora 42 horas para responder um lead — Harvard Business Review. Um sistema existe pra você ficar do lado certo desses números.",
      steps: { pain: "A dor", driver: "O driver", base: "O porte", urgency: "A urgência" },
      painQ: "Onde dói mais hoje?",
      painHint: "Escolha o principal.",
      pains: [
        {
          id: "marketplace",
          t: "O marketplace fica com a comissão",
          d: "iFood, Mercado Livre, Rappi — comissão em cada venda, e o cliente é deles.",
        },
        {
          id: "excel",
          t: "Vivo de planilha e papel",
          d: "Estoque, pedido e caixa no Excel — ou na cabeça de alguém.",
        },
        {
          id: "curiosos",
          t: "Muita mensagem de curioso, pouca venda",
          d: "Horas do dia gastas respondendo quem nunca compra — e o cliente de verdade espera.",
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
        marketplace: { q: "Que fatia das suas vendas passa por marketplace?", opts: [["0.20", "Até 20%"], ["0.35", "20–50%"], ["0.60", "Mais de 50%"]] },
        excel: { q: "Quantos pedidos ou lançamentos por semana passam pela mão de alguém?", opts: [["25", "Até 50"], ["125", "50–200"], ["600", "200–1.000"], ["1500", "Mais de 1.000"]] },
        curiosos: { q: "Quantas conversas por semana não viram venda?", opts: [["5", "Até 10"], ["20", "10–30"], ["65", "30–100"], ["150", "Mais de 100"]] },
        pessoa: { q: "Se essa pessoa sair amanhã, o que para?", opts: [["atendimento", "O atendimento"], ["processo", "O processo inteiro"], ["documentado", "Nada — está documentado"]] },
        cego: { q: "Com que frequência você define preço ou compra sem número na frente?", opts: [["sempre", "Quase sempre"], ["asvezes", "Às vezes"], ["quase_nunca", "Quase nunca"]] },
      },
      baseQ: {
        marketplace: { q: "Faturamento mensal aproximado?", hint: "Faixas — ninguém precisa de número exato aqui.", opts: [["8000", "Até R$ 10 mil"], ["20000", "R$ 10–30 mil"], ["60000", "R$ 30–100 mil"], ["180000", "Mais de R$ 100 mil"]] },
        excel: { q: "Quanto custa um erro desses, aproximadamente?", hint: "Estimativa sua — a literatura mede a taxa de erro, não o real.", opts: [["25", "Até R$ 50"], ["75", "R$ 50–100"], ["150", "R$ 100–200"]] },
        curiosos: { q: "Quanto custa a hora dessa pessoa?", hint: "Custo-hora cheio, em faixas.", opts: [["10", "Até R$ 20/h"], ["30", "R$ 20–40/h"], ["60", "R$ 40–80/h"]] },
        pessoa: { q: "Salário mensal aproximado dessa pessoa?", hint: "Faixas.", opts: [["1500", "Até R$ 2 mil"], ["3500", "R$ 2–5 mil"], ["7500", "R$ 5–10 mil"], ["14000", "Mais de R$ 10 mil"]] },
        cego: { q: "Faturamento mensal aproximado?", hint: "A margem entra como média setorial — e o resultado avisa isso.", opts: [["8000", "Até R$ 10 mil"], ["20000", "R$ 10–30 mil"], ["60000", "R$ 30–100 mil"], ["180000", "Mais de R$ 100 mil"]] },
      },
      urgencyQ: "Quando você quer resolver?",
      urgencies: [
        { id: "now", t: "Já está sangrando", d: "Cada mês de atraso custa dinheiro de verdade." },
        { id: "months", t: "Nos próximos meses", d: "Está no plano — mas não pode empurrar pra sempre." },
        { id: "later", t: "Planejando o ano que vem", d: "Quero entender o tamanho antes." },
      ],
      result: {
        label: "Seu vazamento estimado",
        range: "piso conservador",
        to: "a",
        perMonth: "por mês",
        perYear: "por ano",
        delayCost: "Cada mês de atraso custa pelo menos",
        natureLabel: "Estimativa de modelo — não é resultado medido",
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
        reading: "É o preço de manter as coisas como estão — não um orçamento, um vazamento.",
        zeroReading: "Zero. Se nada para quando a pessoa sai, você não tem essa dor — e o número acabou de dizer isso. Um instrumento que vendesse medo mostraria um número aqui; este mostra o que a conta dá. Se as outras dores derem mais que zero, é lá que está o seu dinheiro.",
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
      role: "Direção, design e desenvolvimento",
      name: "Queijos da Serra",
      sector: "Artisanal cheese production",
      year: "2024",
      media: { dir: "queijos-serra", shots: 3, video: true },
      summary:
        "Lot-level inventory with FEFO priority and tiered expiry alerts, for a product that spoils.",
      problem:
        "A cheese producer tracking lots on paper and in memory. With a perishable product the cost of losing track is not an inconvenience — it is stock thrown away, and the loss is usually discovered only once the batch is already past date.",
      process:
        "Modelled the inventory around the lot rather than the product: each entry carries its own code, expiry date, quantity, unit cost and physical location — display case or cold room. The dashboard came after the data model, not before it, so every number on it is derived rather than typed in.",
      decisions:
        "Chose FEFO — first expired, first out — over FIFO as the ordering rule. For perishable goods the arrival order is irrelevant; what matters is what dies first. Expiry alerts are tiered by urgency (under 3 days, 4 to 7, 8 to 14, 15 to 30) so the owner sees priority instead of a flat list. Added an audit trail, because for food knowing who moved what is a traceability requirement, not a nicety.",
      impact:
        "Stock left paper and became queryable by lot. Product near expiry surfaces on its own instead of being found after the fact.",
    },
    {
      slug: "roda-agro",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
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
        "Five pricing tiers instead of one price, each tied to a physical zone with its own characteristics — external grass, external paved, interior under structure, premium interior. That mirrors how the fair actually sells: position is the product. Payment terms and included promotion are stated on the page, because in this market the negotiation always reaches them anyway.",
      impact:
        "Availability is visible instead of asked for, and the spot a buyer picks is the spot the system holds.",
    },
    {
      slug: "paulo-henrique",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
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
        "Made the calculators do real work instead of decorating. A visitor who has measured something has already started, and that is a better first step than a contact form. Kept the refusal to over-promise in the copy — method, not magic — because in a market full of shortcuts, declining to sell one is the differentiator.",
      impact:
        "One address where the method, the results and the way to start finally sit together.",
    },
    {
      slug: "motormoura",
      practice: "gestao",
      role: "Direção, design e desenvolvimento",
      name: "MotorMoura",
      sector: "Auto parts distribution",
      year: "2026",
      summary:
        "A B2B catalogue with a real database and an admin panel the owner runs without me.",
      problem:
        "A parts distributor whose entire catalogue lived in the owner's head and in loose spreadsheets. Every price request went through one person, and that person became the bottleneck for the whole operation.",
      process:
        "Modelled the catalogue as real entities — product, category, brand, image — instead of flat rows. Built the admin panel first, so the client could load real data while the storefront was still being designed.",
      decisions:
        "Chose an owner-operated admin over a service contract: the client registers products, categories and images without touching me. The data model allows a product to carry multiple brands and applications — batteries, generators, stationary engines — which is how the parts business actually works.",
      impact:
        "The catalogue left the owner's head and became something the team can query. Registration no longer routes through one person.",
      media: { dir: "motormoura", shots: 3, video: false },
      link: "https://motormouraequipamentos.com.br",
    },
    {
      slug: "1000-pecas",
      practice: "gestao",
      role: "Direção, design e desenvolvimento",
      name: "1000 Peças Truck Center",
      sector: "Heavy vehicle parts",
      year: "2026",
      summary: "Digital presence and catalogue structure for a heavy parts operation.",
      problem:
        "A truck parts operation with no digital surface at all — customers found it by phone and word of mouth, and the inventory had no queryable form.",
      process:
        "Built the public presence and the catalogue structure together, so the storefront and the data model were designed against each other rather than one being retrofitted onto the other.",
      decisions:
        "Kept the first release deliberately narrow: presence and catalogue structure, no checkout — and no prices on the page. Heavy parts sell through a quote conversation, and forcing a cart or exposing a price would have fought the actual sales process.",
      impact:
        "The operation has a public surface and a catalogue that can grow without a rebuild.",
      media: { dir: "1000-pecas", shots: 3, video: true },
    },
    {
      slug: "rota-forte",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
      name: "Rota Fort",
      sector: "Munck and crane rental",
      year: "2026",
      summary: "Institutional site with an equipment catalogue — the quote starts on WhatsApp.",
      problem:
        "A munck and crane rental living on the phone and word of mouth. Availability and price were answered from memory, and every enquiry reached the owner unprepared.",
      process:
        "Built the site around the fleet as a catalogue — each machine with its capacity and reach — with one route per page: quote on WhatsApp, with the equipment already named in the message.",
      decisions:
        "Availability and price stay off the page on purpose. Rental is a conversation about weight, height and date — a stale 'available now' would lie more than it sells. The page routes the enquiry; the conversation closes it.",
      impact:
        "The enquiry arrives already informed — which machine, which job — and the answer is one message instead of phone tag.",
      media: { dir: "rota-forte", shots: 3, video: true },
    },
    {
      slug: "miranda-faria",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "This site",
      sector: "Miranda Faria",
      year: "2026",
      summary:
        "The brand, the design system, the motion, the shader and the code — the most direct example of what I ship. Every image below is a capture of the running site, not a mockup.",
      problem:
        "I needed a portfolio that demonstrated the claim rather than asserting it: if I say I do brand, product and data as one, the site itself has to be the proof.",
      process:
        "Brand first — palette, type, the geological strata motif — then a token system, then the code. The hero is a hand-written WebGL shader: a liquid metal M with no video, no image sequence, no library — raw GLSL computed per frame. The homepage went through a long sequence of failed approaches (a 65-frame scroll sequence, manual vectorisation) before the direction settled on procedural motion with no external asset.",
      decisions:
        "The diagnosis engine — three questions that quantify the visitor's leak before any talk of price — is real arithmetic running in the page, not a form. The technology section carries a 60fps flow-field in raw Canvas 2D with zero animation dependencies, and an FPS counter measured in your browser rather than promised on a slide. Documented every abandoned path in the repository. Real /en and /pt routes over a hash toggle. No contact form: a direct link converts better than a field.",
      impact:
        "The site is the case. Shader, canvas, motion system, two languages, the diagnostic engine and every line of CSS — designed, built and deployed by one person, in weeks, not quarters.",
      media: { dir: "miranda-faria", shots: 5, video: true },
    },
    {
      slug: "motormoura-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "MotorMoura — Identity",
      sector: "Auto parts distribution",
      year: "2026",
      summary: "Complete brand kit: logo, manual, cards, seals and print material.",
      problem:
        "A B2B parts distributor whose materials were made ad hoc — a logo in one style, a flyer in another, and no rule to hold either.",
      process:
        "Built the identity as a system: logotype with controlled variations — positive, white, monochrome, isolated icon — usage manual, business cards, email signature, seals and WhatsApp stickers.",
      decisions:
        "The kit was organised by use: identity, sales deck, go-to-market visuals, print kit, and complementary material. A distributor does not need art; it needs rules that survive any printer.",
      impact:
        "The team produces material inside the brand without a designer on call.",
      media: { dir: "motormoura-marca", shots: 3, video: false },
    },
    {
      slug: "1000-pecas-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "1000 Peças — Identity",
      sector: "Heavy vehicle parts",
      year: "2026",
      summary: "Brand, signage, uniform and social for a certified dismantler.",
      problem:
        "A certified heavy-vehicle dismantler with the credibility of paperwork and the visual presence of any corner shop.",
      process:
        "Identity applied where the customer actually looks: the facade, the uniform, and the social feeds — one system from the street to the screen.",
      decisions:
        "Made certification the axis of the identity: in a market full of scrap, the paper that proves it is a design asset.",
      impact:
        "The yard transmits trust before the first conversation.",
      media: { dir: "1000-pecas-marca", shots: 3, video: false },
    },
    {
      slug: "roda-agro-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "Roda de Agronegócios — Identity",
      sector: "Events — agribusiness",
      year: "2026",
      summary: "Identity for the 22nd edition: seal, system and a promo kit every exhibitor applies.",
      problem:
        "A regional fair in its 22nd edition with exhibitors promoting their presence in any which way — each one inventing their own art, none of it recognisably the same event.",
      process:
        "Edition seal in gear, palette and type set, then the piece that carries it all: a promo kit in two ratios where the exhibitor drops their own logo into a reserved area. The brand governs the system; the exhibitor keeps their content.",
      decisions:
        "The kit is a template, not a finished art: the dashed area says whose message it is, and everything around it stays the event's. Two ratios — post and story — cover the whole feed.",
      impact:
        "The edition's social campaign ran on this system: 79.6 thousand views in the period, over 200 new followers — one visual language across every exhibitor's post.",
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
        "Travelers who want a tailored itinerary don't fit shelf packages — and the agency lived entirely inside WhatsApp, with no storefront that showed its way of traveling.",
      process:
        "An institutional site presenting domestic and international destinations, handing the trip over through a planning form or a direct conversation.",
      decisions:
        "The site sells curation, not packages: every destination reads as a proposed experience, and price is never the door — the conversation is.",
      impact:
        "The agency gained a storefront of its own: the client arrives already fluent in the travel style, and the next step is a conversation, not a catalogue.",
    },
    {
      slug: "advogados-lco",
      practice: "desenvolvimento",
      role: "Studio project · with Thales Machado Souza",
      name: "LCO Advogados",
      sector: "Corporate law boutique",
      year: "2026",
      media: { dir: "advogados-lco", shots: 3, video: false },
      link: "https://advogadoslco.com.br",
      summary:
        "A corporate-law boutique — corporate, tax and wealth structuring — in a site that builds trust before the first conversation.",
      problem:
        "A client's legal structure is not sold off a price table: it takes authority, clear practice areas and a direct path to the partner in charge.",
      process:
        "Institutional site with explicit practice areas and three intake channels: WhatsApp, e-mail and a scheduling form.",
      decisions:
        "Boutique sobriety over the generic law-firm template: few sections, direct copy, and the CTA is a conversation with the lawyer — not a faceless form.",
      impact:
        "Qualified contact started arriving: whoever reaches out already knows the practice area they need and who they will talk to.",
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
        "An SMB owner who does not know the company's real result does not hire consulting from a service description — he hires when someone names his pain.",
      process:
        "A capture landing page with one clear offer: a free diagnosis, direct WhatsApp, and the promise of finding the real economic result.",
      decisions:
        "One page, one offer, one step. No service menu: the invitation is the diagnosis, and the relationship starts there.",
      impact:
        "Sales conversations began arriving pre-qualified: whoever enters through the diagnosis has already qualified themselves.",
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
        "An institutional portal positioning the practice — M&A, foreign trade, B2B expansion — and capturing counterparties through a form.",
      decisions:
        "The register of an international firm, not a startup landing: content hierarchy, proof of network, and a clear invitation to counterparties.",
      impact:
        "The site does the pre-commercial work: it filters, explains and routes whoever fits before the first meeting.",
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
        "Produtor de queijo controlando lote no papel e na memória. Com produto perecível, perder o controle não é transtorno — é mercadoria no lixo, e a perda quase sempre só aparece quando o lote já venceu.",
      process:
        "Modelei o estoque em torno do lote, não do produto: cada entrada carrega código próprio, validade, quantidade, custo unitário e localização física — expositor ou câmara fria. O painel veio depois do modelo de dados, não antes, então todo número nele é calculado e não digitado.",
      decisions:
        "Escolhi FEFO — primeiro a vencer, primeiro a sair — em vez de FIFO como regra de ordenação. Em perecível a ordem de chegada não importa; o que importa é o que morre primeiro. Os alertas de validade são escalonados por urgência (menos de 3 dias, 4 a 7, 8 a 14, 15 a 30), para o dono ver prioridade em vez de uma lista chapada. Incluí trilha de auditoria: em alimento, saber quem movimentou o quê é exigência de rastreabilidade, não luxo.",
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
        "Construí a planta como dado, não como imagem: cada estande é um registro com cota, posição e status. O mapa público lê esse estado, então a disponibilidade é resposta do sistema e não memória de pessoa.",
      decisions:
        "Cinco faixas de cota em vez de preço único, cada uma amarrada a uma zona física com características próprias — área externa em grama, externa asfaltada, interna sob estrutura, interna premium. É assim que a feira vende de fato: a posição é o produto. Condições de pagamento e divulgação incluída ficam na página, porque nesse mercado a negociação chega nelas de qualquer jeito.",
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
        "Fiz as calculadoras trabalharem de verdade, em vez de decorarem. Quem mediu alguma coisa já começou, e isso é um primeiro passo melhor que um formulário de contato. Mantive na copy a recusa de prometer demais — método, não mágica — porque num mercado cheio de atalho, não vender um é o diferencial.",
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
        "Catálogo B2B com banco de dados de verdade e painel que o dono opera sozinho.",
      problem:
        "Distribuidora de peças com o catálogo inteiro na cabeça do dono e em planilhas soltas. Todo pedido de preço passava por uma pessoa só, e essa pessoa virou o gargalo da operação inteira.",
      process:
        "Modelei o catálogo como entidades de verdade — produto, categoria, marca, imagem — em vez de linhas soltas. Construí o painel administrativo primeiro, para o cliente já ir carregando dado real enquanto a vitrine ainda estava sendo desenhada.",
      decisions:
        "Escolhi painel operado pelo dono em vez de contrato de manutenção: o cliente cadastra produto, categoria e imagem sem me acionar. O modelo de dados permite um produto carregar várias marcas e aplicações — baterias, geradores, motores estacionários —, que é como o negócio de peça funciona de fato.",
      impact:
        "O catálogo saiu da cabeça do dono e virou algo que a equipe consulta. O cadastro não passa mais por uma pessoa só.",
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
      summary: "Presença digital e estrutura de catálogo para operação de peças pesadas.",
      problem:
        "Operação de peças de caminhão sem nenhuma superfície digital — o cliente achava por telefone e indicação, e o estoque não tinha forma consultável.",
      process:
        "Construí a presença pública e a estrutura de catálogo juntas, para a vitrine e o modelo de dados serem desenhados um contra o outro, em vez de um ser encaixado no outro depois.",
      decisions:
        "Mantive a primeira entrega deliberadamente estreita: presença e estrutura de catálogo, sem carrinho — e sem preço na página. Peça pesada se vende por conversa de orçamento, e forçar checkout ou expor preço ali brigaria com o processo real de venda.",
      impact:
        "A operação tem superfície pública e um catálogo que cresce sem precisar refazer.",
      media: { dir: "1000-pecas", shots: 3, video: true },
    },
    {
      slug: "rota-forte",
      practice: "desenvolvimento",
      role: "Direção, design e desenvolvimento",
      name: "Rota Fort",
      sector: "Locação de munck e guindaste",
      year: "2026",
      summary: "Site institucional com catálogo de equipamentos — o orçamento começa no WhatsApp.",
      problem:
        "Locadora de munck e guindaste vivendo de telefone e indicação. Disponibilidade e preço eram respondidos de memória, e cada pedido chegava pro dono sem contexto.",
      process:
        "Construí o site em volta da frota como catálogo — cada máquina com capacidade e alcance — com um único caminho por página: orçamento no WhatsApp, com o equipamento já citado na mensagem.",
      decisions:
        "Disponibilidade e preço ficam fora da página de propósito. Locação é uma conversa sobre peso, altura e data — um 'disponível agora' velho mentiria mais do que venderia. A página encaminha o pedido; a conversa fecha.",
      impact:
        "O pedido chega já informado — qual máquina, qual serviço — e a resposta é uma mensagem em vez de pingue-pongue de telefone.",
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
        "A marca, o design system, o movimento, o shader e o código — o exemplo mais direto do que eu entrego. Cada imagem abaixo é captura do site rodando, não mockup.",
      problem:
        "Eu precisava de um portfólio que demonstrasse a afirmação em vez de declará-la: se eu digo que faço marca, produto e dado como uma coisa só, o site tem que ser a prova.",
      process:
        "Marca primeiro — paleta, tipografia, o motivo de estratos geológicos — depois o sistema de tokens, depois o código. A hero é um shader WebGL escrito à mão: um M de metal líquido sem vídeo, sem sequência de imagens, sem biblioteca — GLSL puro, calculado quadro a quadro. A home passou por uma sequência longa de caminhos que falharam (sequência de 65 quadros, vetorização manual) antes da direção assentar em movimento procedural, sem asset externo.",
      decisions:
        "O motor de diagnóstico — três perguntas que quantificam o vazamento do visitante antes de qualquer conversa sobre preço — é aritmética real rodando na página, não formulário. A aba Tecnologia carrega um campo de fluxo a 60fps em Canvas 2D puro, zero dependências de animação, com contador de FPS medido no seu navegador em vez de prometido no slide. Cada caminho abandonado está documentado no repositório. Rotas reais /en e /pt em vez de toggle por hash. Sem formulário de contato: link direto converte mais que campo para preencher.",
      impact:
        "O site é o case. Shader, canvas, sistema de movimento, dois idiomas, o motor de diagnóstico e cada linha de CSS — desenhado, construído e publicado por uma pessoa, em semanas, não em trimestres.",
      media: { dir: "miranda-faria", shots: 5, video: true },
    },
    {
      slug: "motormoura-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "MotorMoura — Identidade",
      sector: "Distribuidora de autopeças",
      year: "2026",
      summary: "Brand kit completo: logo, manual, cartões, selos e material de impressão.",
      problem:
        "Uma distribuidora B2B cujo material era feito solto — um logo num estilo, um flyer noutro, e nenhuma regra segurando nenhum.",
      process:
        "A identidade foi construída como sistema: logotipo com variações controladas — positiva, branca, monocromática, ícone isolado — manual de uso, cartões de visita, assinatura de e-mail, selos e figurinhas de WhatsApp.",
      decisions:
        "O kit foi organizado por uso: identidade, sales deck, kit visual de go-to-market, impressão e materiais complementares. Distribuidora não precisa de arte; precisa de regras que sobrevivam a qualquer gráfica.",
      impact:
        "O time produz material dentro da marca sem designer de plantão.",
      media: { dir: "motormoura-marca", shots: 3, video: false },
    },
    {
      slug: "1000-pecas-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "1000 Peças — Identidade",
      sector: "Desmanche de caminhões",
      year: "2026",
      summary: "Marca, faixada, uniforme e redes sociais para um desmanche certificado.",
      problem:
        "Um desmanche de caminhões certificado, com a credibilidade do papel timbrado e a presença visual de qualquer oficina de esquina.",
      process:
        "Identidade aplicada onde o cliente realmente olha: a faixada, o uniforme e as redes — um sistema só, da rua à tela.",
      decisions:
        "A certificação virou o eixo da identidade: num mercado cheio de sucata, o papel que prova é ativo de design.",
      impact:
        "O pátio transmite confiança antes da primeira conversa.",
      media: { dir: "1000-pecas-marca", shots: 3, video: false },
    },
    {
      slug: "roda-agro-marca",
      practice: "design",
      role: "Direção, design e desenvolvimento",
      name: "Roda de Agronegócios — Identidade",
      sector: "Eventos — agronegócio",
      year: "2026",
      summary: "Identidade da 22ª edição: selo, sistema e um kit que cada expositor aplica.",
      problem:
        "Uma feira regional na 22ª edição com expositores divulgando presença cada um por si — cada um inventando a própria arte, nada disso reconhecível como o mesmo evento.",
      process:
        "Selo da edição em engrenagem, paleta e tipografia definidas, e a peça que carrega tudo: um kit de divulgação em duas proporções em que o expositor solta a própria logo numa área reservada. A marca governa o sistema; o conteúdo é do expositor.",
      decisions:
        "O kit é template, não arte fechada: a área pontilhada diz de quem é a mensagem, e tudo ao redor permanece da feira. Duas proporções — post e story — cobrem o feed inteiro.",
      impact:
        "A campanha social da edição rodou nesse sistema: 79,6 mil visualizações no período e mais de 200 novos seguidores — uma linguagem visual única em cada post de expositor.",
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
        "Quem quer roteiro personalizado não cabe em pacote de prateleira — e a agência vivia só dentro do WhatsApp, sem vitrine que mostrasse o jeito dela de viajar.",
      process:
        "Institucional que apresenta destinos nacionais e internacionais e entrega o roteiro por formulário de planejamento ou conversa direta.",
      decisions:
        "O site vende curadoria, não pacote: cada destino aparece como proposta de experiência, e o preço nunca é a porta de entrada — a conversa é.",
      impact:
        "A agência ganhou vitrine própria: o cliente chega já entendendo o estilo de viagem, e o próximo passo é uma conversa, não um catálogo.",
    },
    {
      slug: "advogados-lco",
      practice: "desenvolvimento",
      role: "Projeto do escritório · com Thales Machado Souza",
      name: "LCO Advogados",
      sector: "Advocacia empresarial",
      year: "2026",
      media: { dir: "advogados-lco", shots: 3, video: false },
      link: "https://advogadoslco.com.br",
      summary:
        "Boutique jurídica de advocacia empresarial — societário, tributário e patrimonial — em um site que constrói confiança antes da primeira conversa.",
      problem:
        "A estrutura jurídica do cliente não se vende por tabela de preço: precisa de autoridade, clareza de áreas de atuação e um caminho direto até o sócio responsável.",
      process:
        "Institucional com as áreas explicitadas e captação em três canais: WhatsApp, e-mail e formulário de agendamento.",
      decisions:
        "Sobriedade de boutique em vez do template genérico de escritório: poucas seções, texto direto, e o CTA é a conversa com o advogado — não um formulário sem rosto.",
      impact:
        "O escritório passou a receber contato qualificado: quem chega já sabe a área que precisa e com quem vai falar.",
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
        "O dono de PME que não sabe o resultado real do próprio negócio não contrata consultoria por descrição de serviço — contrata quando alguém nomeia a dor dele.",
      process:
        "Landing de captação com uma oferta clara: diagnóstico gratuito, WhatsApp direto e a promessa de apurar o resultado econômico real.",
      decisions:
        "Uma página, uma oferta, um passo. Sem menu de serviços: o convite é o diagnóstico, e a relação começa nele.",
      impact:
        "A conversa de vendas passou a chegar pronta: quem entra pelo diagnóstico já se qualificou sozinho.",
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
        "Portal institucional que posiciona a atuação — fusões e aquisições, comércio exterior, expansão B2B — e captura contrapartes por formulário.",
      decisions:
        "Registro de empresa internacional em vez de landing de startup: hierarquia de conteúdo, prova de rede e um convite claro a contrapartes.",
      impact:
        "O site faz o trabalho pré-comercial: filtra, explica e encaminha quem tem fit antes da primeira reunião.",
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
      lead: "Software the owner runs, not me.",
      intro:
        "The order lands on WhatsApp. One person copies it to a notebook, another forgets to write it down, a third one writes it twice. At month's end, someone recounts the same pile to find out how much the company sold — and the number still disagrees with the next person's. I turn that operation into a system: catalogue, inventory, orders and dashboards on a real database, entered and run by whoever owns the business. First version live in weeks; from then on, the system learns what the business asks of it — not the other way around.",
      artAlt: "A grid of recorded cells where a decision is born and propagates on its own",
      artLabel: "MANAGEMENT — THE SYSTEM, LIVE",
      artHint: "Each dot is a recorded fact. Tap a cell: the decision propagates on its own.",
      thesis: {
        label: "MANAGEMENT — THE THESIS",
        title: "A spreadsheet is memory. A system is decision.",
        desc:
          "Every company with a process runs on memory today: whoever remembers, handles it — and whoever takes a vacation, freezes the operation. The spreadsheet is the past written down; the system is the present deciding on its own: the order that doesn't depend on who read the message, the stock that warns before it runs out, the number nobody reassembles by month's end. The difference between the two is the difference between operating and reacting — and between a business that depends on people and a business that works.",
      },
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Catalogue and inventory",
          d: "Products, categories, brands and photos modelled as real entities — not spreadsheet rows. One-tap search, filters a salesperson actually understands, edits the owner makes alone. Inventory stops being that notebook and starts warning you before it runs out.",
        },
        {
          t: "Ordering and workflow",
          d: "The order that stops dying inside a message thread: each one is born with status, history and an owner. Nobody resends screenshots, nobody asks whether it shipped — the system answers before the question exists.",
        },
        {
          t: "Dashboards and data",
          d: "Sales, stock and margin on one screen that updates itself. The monthly report stops being someone's afternoon watching the month go by — the panel is born ready, every day.",
        },
        {
          t: "Ownership",
          d: "The client registers, edits and publishes without calling me. The data is theirs, the access is theirs, the password is theirs. I step out of the operation and the system keeps running — that is the goal, not the risk.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura and 1000 Peças: catalogues a customer can browse and a quote flow that runs without a phone call.",
        "Queijos da Serra: lot-level inventory with FEFO ordering and expiry-tiered alerts — the expiry warns before it becomes a loss.",
        "The monthly report replaced by a panel that updates itself — a closing that took an afternoon now takes a minute.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "Brand and interface, made fast without looking fast.",
      intro:
        "Identity, design system and the applied pieces. AI generates the first drafts — imagery and code — and every piece passes through my hands before it ships. That is the difference between leverage and a shortcut.",
      artAlt: "Translucent planes composing, some still finding position",
      gen: {
        label: "GENERATIVE ART — AI",
        title: "Anyone can generate. Choosing is the work.",
        desc:
          "AI generates dozens of directions in hours. That is not the design — it is raw material. The work is taste, judgement and direction, turning a forest of options into one identity. Every piece on this page — the copper particles, the entrance on the street, the motion of this site — was generated and directed here, by the same hand that signs the project.",
        capA: "Copper particles — identity in motion",
        capB: "Office entrance — generative study",
        capLayers: "Disorder finding order — the method, in one shot",
        capSeam: "The copper seam — what runs under every project",
      },
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Identity",
          d: "Logotype, palette, typography and the applied pieces. Decided once, documented, and then held to across every surface.",
        },
        {
          t: "Design system",
          d: "Tokens, a fluid type scale, spacing and motion rules. Not a style guide PDF — the actual variables the code reads.",
        },
        {
          t: "AI-assisted exploration",
          d: "Dozens of directions generated in hours instead of days. Anyone can generate; the selection is the work, and the selection is mine.",
        },
        {
          t: "Design that ships",
          d: "It arrives as running code, not as a file handed to someone else to interpret. Nothing is lost in translation because there is no translation.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura: complete identity — logo, manual, business cards, seals and print kit.",
        "1000 Peças: brand, signage, uniform and social, from one identity system.",
        "Roda de Agronegócios: identity for the 22nd edition — central seal, invitation and promotional pieces.",
        "This site: identity, motion and code by the same hand you would hire.",
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
        "Institutional site, landing page or WhatsApp-first storefront — the front door of the business, built for the shortest path to conversation. Every section closes on a next step; the visitor leaves the page straight into the chat, with the message already addressed. A change requested in the morning ships the same day. Days of project, not quarters.",
      artAlt: "Dots wandering the page, turning to copper and leaving through the conversation",
      artLabel: "DEVELOPMENT — THE CONVERSATION",
      artHint: "Each dot is a visitor; copper is the one who converts. Lead them with your cursor.",
      thesis: {
        label: "DEVELOPMENT — THE THESIS",
        title: "A website isn't a shop window. It's the first salesperson.",
        desc:
          "The visitor decides in seconds whether to ask or give up — and the lead answered first buys more: replying within five minutes multiplies by 21 the chance of qualifying the conversation. So the whole page is built to end in conversation: every section closes on a next step, and the message arrives with context — where they came from, what they saw, what they want. Presence that doesn't generate conversation is just cost; a site that does is the company's first salesperson.",
      },
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Institutional site",
          d: "The business presented properly: what it does, for whom, and why it charges what it charges. Copy written to sell — not to fill a layout — and not one sentence that smells of template.",
        },
        {
          t: "WhatsApp-first pages",
          d: "The next step always one tap away: the message arrives with context — what the visitor saw, what they wanted. Quote, booking, order: the conversation starts already informed, and the salesperson answers in minutes.",
        },
        {
          t: "Capture and presentation",
          d: "Galleries, catalogues and calculators that make the visitor do something measurable before leaving — because a visit that leaves no trace doesn't exist for any analysis.",
        },
        {
          t: "Hosting and upkeep",
          d: "Fast, hosted, domain in the client's name. Changes ship in hours when the business asks — and the site keeps working every day, no day off, no salary.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "Rota Fort: a page whose only job is to route the right enquiry to WhatsApp — and it does.",
        "Paulo Henrique: a presentation site with a performance lab the visitor actually uses.",
        "1000 Peças: an institutional catalogue that routes quotes to the chat without exposing price — the sales strategy becomes interface.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    automacao: {
      slug: "automacao",
      label: "Automation",
      lead: "The repetitive work leaves human hands.",
      intro:
        "A client asks for a price at 11 pm and nobody answers. The order lands in one channel, gets copied into another, typed twice — and the second copy comes out wrong. The product record is a salesperson's free text, and now nobody finds anything. I connect the dots: service that answers instantly, data that flows on its own between system, sheet and messaging, routines that run overnight with nobody pressing a button. Automation is not fewer people — it is the same people deciding only what matters. And it runs through everything I deliver: the management system warns the owner on its own, the website forwards the lead with full context, the design serves the same state to machine and human.",
      artAlt: "A stream where loose information enters and structured data comes out",
      artLabel: "AUTOMATION — THE TRIGGER, LIVE",
      artHint: "Click to fire: the message becomes reply, record and routine —",
      thesis: {
        label: "AUTOMATION — THE THESIS",
        title: "Every manual copy is an error waiting to happen.",
        desc:
          "Each time data passes from one hand to another, the operation pays a tax: time, error, rework. Automation cuts that tax — the message becomes a record, the record becomes a charge, the report assembles itself. What is left of the day becomes decision.",
      },
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Service that answers on its own",
          d: "WhatsApp and Instagram connected to the system: frequent questions answered on the spot, quotes forwarded with full context, and the lead arrives as a record — not as a screenshot lost in a group chat.",
        },
        {
          t: "Integration between systems",
          d: "The form feeds the sheet, the sheet talks to the panel, the order is born in one place and shows up in the other. No double typing, no 'let me check here'.",
        },
        {
          t: "Routines that run by themselves",
          d: "Weekly report on Monday morning, low-stock warning, backups and syncs outside business hours. Repetitive work has a schedule — and it is not yours.",
        },
        {
          t: "AI where text becomes data",
          d: "Loose description in, structured record out: brand, model, year, category — read by AI, checked by a human. Years of messy archives become a searchable catalogue.",
        },
      ],
      proofLabel: "Proof in the field",
      proofs: [
        "MotorMoura: the dealer's free text — a road train described in three words — becomes a structured record read by AI: brand, model, year, power. On the same record, the system estimates which parts that equipment is likely to buy.",
        "Automation integrated with every other solution: in management, the low-stock alert is born on its own; on the website, the form delivers the lead ready; on WhatsApp, the first answer arrives before the coffee gets cold.",
      ],
      casesLabel: "Where it shows up",
      cta: "Tell me what is still manual.",
    },
  },

  pt: {
    automacao: {
      slug: "automacao",
      label: "Automação",
      lead: "O trabalho repetitivo sai da mão humana.",
      intro:
        "O cliente pergunta o preço às 23h e ninguém responde. O pedido chega num canal, é copiado no outro, digita-se duas vezes — e a segunda sai errada. A ficha do produto é o texto solto do vendedor, e ninguém acha mais nada. Eu conecto os pontos: atendimento que responde na hora, dado que flui sozinho entre sistema, planilha e mensagem, rotina que roda de madrugada sem ninguém apertar botão. Automação não é menos gente — é a mesma gente cuidando só do que decide. E ela atravessa tudo o que eu entrego: o sistema de gestão avisa o dono sozinho, o site encaminha o lead com o contexto pronto, o design serve o mesmo estado pra máquina e pra pessoa.",
      artAlt: "Uma mensagem chega e o gatilho a transforma sozinho em resposta, cadastro e rotina",
      artLabel: "AUTOMAÇÃO — O DISPARO, AO VIVO",
      artHint: "Clique para disparar: a mensagem vira resposta, cadastro e rotina —",
      thesis: {
        label: "AUTOMAÇÃO — A TESE",
        title: "Toda cópia manual é um erro esperando acontecer.",
        desc:
          "Cada vez que um dado passa de uma mão pra outra, a operação paga imposto: tempo, erro, retrabalho. Automação corta esse imposto — a mensagem vira cadastro, o cadastro vira cobrança, o relatório se monta sozinho. O que sobra do dia vira decisão.",
      },
      deliverablesLabel: "O que eu entrego",
      deliverables: [
        {
          t: "Atendimento que responde sozinho",
          d: "WhatsApp e Instagram conectados ao sistema: pergunta frequente respondida na hora, orçamento encaminhado com o contexto pronto, e o lead chega cadastrado — não como print perdido no grupo.",
        },
        {
          t: "Integração entre sistemas",
          d: "O formulário alimenta a planilha, a planilha conversa com o painel, o pedido nasce num lugar e aparece no outro. Sem digitação dupla, sem 'deixa eu conferir aqui'.",
        },
        {
          t: "Rotinas que rodam sozinhas",
          d: "Relatório semanal na segunda de manhã, aviso de estoque no limite, backup e sincronização fora do horário. O trabalho repetitivo tem hora marcada — e não é a sua.",
        },
        {
          t: "IA onde o texto vira dado",
          d: "Descrição solta entra, ficha estruturada sai: marca, modelo, ano, categoria — lido por IA, conferido por gente. O acervo bagunçado de anos vira catálogo pesquisável.",
        },
      ],
      proofLabel: "Prova em campo",
      proofs: [
        "MotorMoura: o texto livre do lojista — uma carreta descrita em três palavras — vira ficha estruturada lida por IA: marca, modelo, ano, potência. Na mesma ficha, o sistema estima as peças que aquele equipamento tende a comprar.",
        "Automação integrada às outras soluções: na gestão, o alerta de estoque nasce sozinho; no site, o formulário entrega o lead pronto; no WhatsApp, a primeira resposta chega antes do café esfriar.",
      ],
      casesLabel: "Onde isso aparece",
      cta: "Me diz o que ainda é manual.",
    },
    gestao: {
      slug: "gestao",
      label: "Sistemas & Gestão",
      lead: "Sistema que o dono opera, não eu.",
      intro:
        "O pedido chega no WhatsApp. Uma pessoa copia pro caderno, outra esquece de anotar, uma terceira anota duas vezes. No fim do mês, alguém reconta a mesma pilha pra descobrir quanto a empresa vendeu — e o número ainda sai diferente do outro. Eu viro essa operação em sistema: catálogo, estoque, pedido e painel sobre um banco de dados de verdade, cadastrado e operado por quem é dono do negócio. Primeira versão rodando em semanas; depois, o sistema aprende o que a empresa pede — não o contrário.",
      artAlt: "Uma grade de células anotadas onde uma decisão nasce e se propaga sozinha",
      artLabel: "GESTÃO — O SISTEMA AO VIVO",
      artHint: "Cada ponto é um dado anotado. Toque numa célula: a decisão se propaga sozinha.",
      thesis: {
        label: "GESTÃO — A TESE",
        title: "Planilha é memória. Sistema é decisão.",
        desc:
          "Toda empresa com processo roda hoje na memória de quem atende: quem lembra, resolve — e quem tira férias, trava a operação. A planilha é o passado anotado; o sistema é o presente decidindo sozinho: o pedido que não depende de quem leu a mensagem, o estoque que avisa antes de faltar, o número que ninguém precisa remontar no fim do mês. A diferença entre os dois é a diferença entre operar e reagir — e entre um negócio que depende de gente e um negócio que funciona.",
      },
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Catálogo e estoque",
          d: "Produtos, categorias, marcas e fotos modelados como entidades de verdade — não como linhas de planilha. Busca em um toque, filtro que o vendedor entende, edição que o dono faz sozinho. O estoque deixa de ser aquele caderno e passa a avisar antes de faltar.",
        },
        {
          t: "Pedidos e fluxo",
          d: "O pedido que deixa de morrer dentro de uma conversa: cada um nasce com status, histórico e dono. Ninguém reenvia print, ninguém pergunta se já saiu — o sistema responde antes de pergunta existir.",
        },
        {
          t: "Painéis e dados",
          d: "Venda, estoque e margem numa tela que atualiza sozinha. O relatório mensal deixa de ser uma tarde de alguém vendo o mês passar — o painel já nasce pronto, todos os dias.",
        },
        {
          t: "Propriedade",
          d: "O cliente cadastra, edita e publica sem me ligar. Os dados são dele, o acesso é dele, a senha é dele. Eu saio da operação e o sistema continua rodando — isso é o objetivo, não o risco.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "MotorMoura e 1000 Peças: catálogos que o cliente navega e um fluxo de orçamento que roda sem telefonema.",
        "Queijos da Serra: estoque por lote com ordenação FEFO e alertas escalonados por validade — o vencimento avisa antes de virar prejuízo.",
        "O relatório mensal substituído por um painel que atualiza sozinho — fechamento que era tarde virou minuto.",
      ],
      casesLabel: "Feitos assim",
      cta: "Começar um projeto",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "Marca e interface, rápido sem parecer apressado.",
      intro:
        "Identidade, design system e as peças de aplicação. A IA gera os primeiros rascunhos — imagem e código — e cada peça passa pela minha mão antes de sair. É essa a diferença entre alavanca e atalho.",
      artAlt: "Planos translúcidos se compondo, alguns ainda assentando",
      gen: {
        label: "ARTE GENERATIVA — IA",
        title: "Qualquer um gera. Escolher é o trabalho.",
        desc:
          "A IA gera dezenas de direções em horas. Isso não é o design — é a matéria-prima. O trabalho é o gosto, o critério e a direção que transformam uma floresta de opções em uma identidade. Cada peça desta página — as partículas de cobre, a entrada na rua, o movimento do site — foi gerada e dirigida aqui, pela mesma mão que assina o projeto.",
        capA: "Partículas de cobre — identidade em movimento",
        capB: "Entrada do escritório — estudo generativo",
        capLayers: "Desordem encontrando ordem — o método em um plano",
        capSeam: "O veio de cobre — o que corre por baixo de cada projeto",
      },
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Identidade",
          d: "Logotipo, paleta, tipografia e as peças de aplicação. Decidido uma vez, documentado, e sustentado em toda superfície depois.",
        },
        {
          t: "Design system",
          d: "Tokens, escala tipográfica fluida, espaçamento e regras de movimento. Não é PDF de manual — são as variáveis que o código lê.",
        },
        {
          t: "Exploração com IA",
          d: "Dezenas de direções geradas em horas, não em dias. Qualquer um gera; escolher é o trabalho, e a escolha é minha.",
        },
        {
          t: "Design que vira código",
          d: "Chega funcionando, não como arquivo para outra pessoa interpretar. Nada se perde na tradução porque não existe tradução.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "MotorMoura: identidade completa — logo, manual, cartões, selos e kit de impressão.",
        "1000 Peças: marca, faixada, uniforme e social, de um sistema de identidade só.",
        "Roda de Agronegócios: identidade da 22ª edição — selo central, convite e peças de divulgação.",
        "Este site: identidade, movimento e código pela mesma mão que você contrataria.",
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
        "Site institucional, landing page ou vitrine WhatsApp-first — a porta de entrada do negócio, construída pro caminho mais curto até a conversa. Cada seção fecha num próximo passo; o visitante sai da página direto no chat, com a mensagem já endereçada. A mudança pedida de manhã sobe no mesmo dia. Dias de projeto, não trimestres.",
      artAlt: "Pontos que vagam pela página, convertem em cobre e saem pela conversa",
      artLabel: "DESENVOLVIMENTO — A CONVERSA",
      artHint: "Cada ponto é um visitante; o cobre é quem converte. Conduza-os com o cursor.",
      thesis: {
        label: "DESENVOLVIMENTO — A TESE",
        title: "Um site não é vitrine. É o primeiro vendedor.",
        desc:
          "O visitante decide em segundos se pergunta ou desiste — e o lead atendido primeiro compra mais: responder em cinco minutos multiplica por 21 a chance de qualificar a conversa. Por isso a página inteira é construída para terminar em conversa: cada seção fecha num próximo passo, e a mensagem chega com contexto — de onde veio, o que viu, o que quer. Presença que não gera conversa é só custo; site que gera é o primeiro vendedor da empresa.",
      },
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Site institucional",
          d: "O negócio apresentado direito: o que faz, pra quem, e por que cobra o que cobra. Texto escrito pra vender — não pra preencher layout — e nenhuma frase com cheiro de template.",
        },
        {
          t: "Páginas WhatsApp-first",
          d: "O próximo passo sempre a um toque: a mensagem chega com contexto — o que o visitante viu, o que ele queria. Orçamento, agendamento, pedido: a conversa começa já informada, e o vendedor responde em minutos.",
        },
        {
          t: "Captura e apresentação",
          d: "Galerias, catálogos e calculadoras que fazem o visitante fazer algo mensurável antes de ir embora — porque visita que não deixa rastro não existe pra análise nenhuma.",
        },
        {
          t: "Hospedagem e manutenção",
          d: "Rápido, hospedado, domínio no nome do cliente. Mudança sobe em horas quando o negócio pede — e o site segue trabalhando todos os dias, sem folga, sem salário.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "Rota Fort: uma página cujo único trabalho é levar o orçamento certo pro WhatsApp — e ela leva.",
        "Paulo Henrique: site de apresentação com um laboratório de performance que o visitante usa de verdade.",
        "1000 Peças: catálogo institucional que leva o orçamento pro chat sem expor preço — a estratégia comercial vira interface.",
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
        d: "O diagnóstico é gratuito — e é onde o resultado se decide: o preço que a marca precisa sustentar, o cliente que precisa reconhecê-la, a superfície onde ela vai viver.",
      },
      {
        t: "Direções, não promessas",
        d: "Dezenas de estudos generativos em horas, não em semanas. Você escolhe com o material na mesa — e nenhuma direção chega até você sem ter passado pela minha mão primeiro.",
      },
      {
        t: "Um sistema, não um logo",
        d: "Símbolo, tipografia, cor e regras de uso — o conjunto que faz qualquer peça sair certa, do cartão à fachada, sem depender de quem desenhou.",
      },
      {
        t: "Entregue viva",
        d: "Impresso, social e web, com os arquivos organizados por uso. A identidade chega funcionando em toda parte — não em PDF.",
      },
    ],
  },
  en: {
    label: "How it runs",
    steps: [
      {
        t: "Understand before drawing",
        d: "The diagnosis is free — and it is where the outcome is decided: the price the brand must sustain, the client who must recognise it, the surface where it will live.",
      },
      {
        t: "Directions, not promises",
        d: "Dozens of generative studies in hours, not weeks. You choose with the work on the table — and no direction reaches you without having passed through my hands first.",
      },
      {
        t: "A system, not a logo",
        d: "Symbol, type, colour and usage rules — the set that makes any piece come out right, from card to facade, without depending on who drew it.",
      },
      {
        t: "Delivered alive",
        d: "Print, social and web, with files organised by use. The identity arrives working everywhere — not as a PDF.",
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