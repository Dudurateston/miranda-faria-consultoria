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
  "dj-jotave",
  "miranda-faria",
];

export const copy = {
  en: {
    meta: {
      title: "Miranda Faria — Design Engineer & Creative Technologist",
      description:
        "I design and build complete web systems — brand, product and data as one — solo, using an orchestrated AI workflow.",
      skip: "Skip to content",
      pages: {
        home: "Complete web systems — brand, product and data as one — built solo, shipped fast.",
        work: "Management systems, websites and identity delivered end to end — parts, logistics, agribusiness, retail and the arts.",
        servicos: "Three solutions, one operating principle: management systems, websites and design.",
        about: "Design engineer working across brand, product and data — technology applied to a business that actually exists.",
        how: "How a project runs here: diagnosis first, demo in the first week, delivery in the owner's hands.",
        insights: "Three questions and an estimate of what the problem costs — before any talk of price.",
        contact: "Bring the problem, not a spec. Same-day response, straight from who builds it.",
        practice: "Management systems, websites and identity — one hand from diagnosis to delivery.",
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
      toggle: "Ver em português",
    },
    home: {
      wordmark: "Miranda Faria",
      role: "Design Engineer & Creative Technologist",
      scrollHint: "Scroll",
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
      sobrePreview: { label: "About", cta: "Learn more" },
      techPreview: {
        label: "Technology",
        lead: "A lean stack, driven by method.",
        stack: ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "Figma", "AI / LLMs", "Automation"],
        cta: "Learn more",
      },
      insightsPreview: {
        label: "Diagnosis",
        lead: "What does it cost to leave it unsolved?",
        intro:
          "Three questions and an estimate of what the problem drains per month — the same diagnosis I run in a first conversation, in forty seconds.",
        cta: "Run the diagnosis",
      },
      finalCta: { lead: "Let's talk.", cta: "Message on WhatsApp" },
    },
    work: {
      label: "Work",
      lead: "Systems in the field.",
      intro:
        "Eight projects, each shipped end to end — brand, interface, data model and deployment. Screens and recordings only: client systems are never linked publicly.",
      viewCase: "Read the case",
      sections: {
        problem: "Problem",
        process: "Process",
        decisions: "Decisions",
        impact: "Impact",
      },
      factsSector: "Sector",
      factsYear: "Year",
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
          "React / Next.js — interface and application",
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
          "Nothing below is video, GIF or slide: three panels computing right now, in your browser, with zero animation libraries. If it holds 60 frames per second, it's because the math holds — measured, not promised.",
        items: [
          {
            tag: "01",
            name: "Vector field",
            hint: "Move your cursor over the field.",
            caption:
              "Hundreds of particles in a flow field that reacts to your cursor. Raw Canvas 2D — no Three.js, no GSAP, zero dependencies. The FPS in the corner is measured in your browser.",
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
        "I'm a design engineer working across brand, product and data. I build complete web systems on my own — the identity, the interface, the database behind it and the deployment.",
        "Most of my work so far has been for operations with real inventory, real customers on the phone and real deadlines: parts distributors, logistics, retail. The kind of business where a broken system is not an abstraction.",
        "I work solo, from brief to delivery — with AI as leverage through the build: it accelerates the code and the visual work; architecture, hierarchy and what gets cut stay mine to decide. Genuinely custom, without an agency's overhead. Everything that leaves here passes through my hands before it reaches you.",
      ],
      location: "Based in Brazil (UTC−3) — full working-day overlap with US hours, partial with Europe.",
      facadeCaption: "Generative brand art — AI",
      trajectoryLabel: "Trajectory",
      trajectory: "Eight complete systems delivered across parts distribution, logistics, agribusiness, commerce and the arts — brand, interface, data model and deployment, end to end. Along the way: sites that sell in the silence of WhatsApp, inventories that correct themselves, identities printed on paper — and the app my own sales network runs on so no lead gets lost.",
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
    footer: {
      tagline: "Miranda Faria · Design Engineer & Creative Technologist",
      privacy: "Privacy",
      linkedin: "LinkedIn",
      sellers: "Sales reps' app",
    },
    servicos: {
      label: "Services",
      lead: "Three solutions, one operating principle.",
      intro:
        "Systems, design and business intelligence — each shippable alone, designed to work as one.",
      metricsLabel: "In numbers",
      metrics: [
        { n: "8+", d: "projects delivered across sites and systems" },
        { n: "24h", d: "to respond — straight from who builds it" },
        { n: "3", d: "disciplines that combine: system, design and data" },
        { n: "100%", d: "tailor-made, from briefing to delivery" },
      ],
      bandLayers: ["Surface", "System", "Data", "Foundation"],
      bandStat:
        "About half of new US businesses never reach year five. It is rarely the market that runs out — it is the structure underneath.",
      bandSource: "U.S. Bureau of Labor Statistics",
      verticalsLabel: "The solutions",
      faq: [
        {
          q: "How much does it cost?",
          a: "It depends on the leak — which is why the diagnosis exists. First I size what the delay, the app fee or the lost sale costs per month; the proposal arrives as a fraction of that annual saving. In an operation losing R$ 4,000/mo, a ~R$ 15k solution pays for itself in three months and gives back R$ 33k in the first year. An institutional site and a system sit in different ranges — the diagnosis tells which one is yours, with no surprises along the way.",
        },
        {
          q: "How long until it's ready?",
          a: "A system: weeks, not months. An institutional site: even less. The first navigable demo ships in the first week — you watch your problem being solved before paying for the whole project.",
        },
        {
          q: "And after delivery?",
          a: "The system is yours, in your name. If you want, maintenance and evolution stay with me — no lock-in, no strings.",
        },
      ],
      faqLabel: "What they ask before closing",
      seeVertical: "See the solution",
      cards: {
        gestao: "The order that dies in a chat thread — in a system you own.",
        design: "Brand and interface that justify the premium.",
        desenvolvimento: "A site that works the lead for you — it arrives ready, in your WhatsApp.",
      },
      cta: "Start a project",
    },
    diag: {
      label: "Diagnosis",
      lead: "How much leaks out every month?",
      intro:
        "Three questions and an estimate of what the problem costs — before any talk of price or technology. That is how I work: size the pain first, prescribe second.",
      evidence:
        "Two numbers worth keeping: answering a customer within 5 minutes makes you 21× more likely to qualify them than taking 30 — MIT/InsideSales. And the average company takes 42 hours to answer a lead — Harvard Business Review. A system exists to keep you on the right side of those numbers.",
      meta: "An estimate from market averages. The real diagnosis happens in the conversation.",
      steps: { pain: "The pain", revenue: "The size", urgency: "The urgency" },
      painQ: "Where does it hurt most today?",
      painHint: "Pick the main one.",
      pains: [
        {
          id: "marketplace",
          t: "I depend on a marketplace",
          d: "iFood, Rappi, Instagram — the middleman takes a cut of every sale and owns the customer.",
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
      revenueQ: "Approximate monthly revenue?",
      revenueHint: "Ranges — no exact number needed here.",
      revenues: ["Up to $10k", "$10–30k", "$30–100k", "$100k+"],
      urgencyQ: "When do you want this solved?",
      urgencies: [
        { id: "now", t: "It's bleeding now", d: "Every month of delay costs real money." },
        { id: "months", t: "In the next few months", d: "Planned — but it can't slide forever." },
        { id: "later", t: "Planning for next year", d: "I want the size of it first." },
      ],
      result: {
        label: "Your estimated leak",
        perMonth: "per month",
        perYear: "per year",
        delayCost: "Every month of delay costs about",
        solutionLabel: "What fixes it",
        solutionSee: "See the solution",
        cta: "Message on WhatsApp with the diagnosis ready",
        restart: "Run it again",
        perDay: "per business day",
        recoveryLabel: "Recoverable",
        recoveryNote:
          "Operations like this usually recover a good part of that within the first quarter — the rest is profit that was being left on the table.",
        reading: "This is the price of leaving things as they are — not a quote, a leak.",
        copyCta: "Copy result",
        copied: "Copied",
        back: "Back",
        howLabel: "How we estimated",
        pricingNote:
          "How the proposal arrives: as a fraction of the annual saving the diagnosis points to — never as a number in a vacuum. Price is born from context, not from a rate card.",
        how: "Each pain maps to a market average: marketplace fees of 15–30% of revenue, hours lost to manual operation and unqualified inquiries — about a quarter of a business's week drains into repetitive tasks (Smartsheet) —, or the margin left on the table when decisions run on gut feel. The ranges are deliberately conservative: ~30% of the activities in most operations are automatable (McKinsey), and the estimate only counts what the basics recover. The honest number comes from the conversation.",
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
        servicos: "Três soluções, um princípio de operação: sistemas de gestão, sites e design.",
        about: "Design engineer entre marca, produto e dados — tecnologia aplicada a negócio que existe de verdade.",
        how: "Como um projeto corre por aqui: diagnóstico primeiro, demo na primeira semana, entrega na mão do dono.",
        insights: "Três perguntas e uma estimativa do custo do seu problema — antes de falar de preço ou tecnologia.",
        contact: "Traga o problema, não a especificação. Resposta no mesmo dia, direto com quem executa.",
        practice: "Sistemas de gestão, sites e identidade — uma mão só do diagnóstico à entrega.",
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
      toggle: "View in English",
    },
    home: {
      wordmark: "Miranda Faria",
      role: "Consultoria & Tecnologia",
      scrollHint: "Role",
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
      sobrePreview: { label: "Sobre", cta: "Saiba mais" },
      techPreview: {
        label: "Tecnologia",
        lead: "Stack enxuto, dirigido por método.",
        stack: ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "Figma", "IA / LLMs", "Automações"],
        cta: "Saiba mais",
      },
      insightsPreview: {
        label: "Diagnóstico",
        lead: "Quanto custa não resolver?",
        intro:
          "Três perguntas e uma estimativa do que o problema drena por mês — o mesmo diagnóstico que eu faria numa primeira conversa, em quarenta segundos.",
        cta: "Fazer o diagnóstico",
      },
      finalCta: { lead: "Vamos conversar.", cta: "Chamar no WhatsApp" },
    },
    work: {
      label: "Trabalhos",
      lead: "Projetos em campo.",
      intro:
        "Oito projetos entregues de ponta a ponta — marca, interface, banco de dados e publicação. Só imagem e vídeo: os sistemas dos clientes nunca são linkados publicamente.",
      viewCase: "Ler o case",
      sections: {
        problem: "Problema",
        process: "Processo",
        decisions: "Decisões",
        impact: "Resultado",
      },
      factsSector: "Setor",
      factsYear: "Ano",
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
          "React / Next.js — interface e aplicação",
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
          "Nada abaixo é vídeo, GIF ou slide: são três painéis calculando neste instante, no seu navegador, sem nenhuma biblioteca de animação. Se está segurando 60 quadros por segundo, é porque a matemática aguenta — medida, não prometida.",
        items: [
          {
            tag: "01",
            name: "Campo vetorial",
            hint: "Passe o cursor sobre o campo.",
            caption:
              "Centenas de partículas num campo de fluxo que reage ao seu cursor. Canvas 2D puro — sem Three.js, sem GSAP, zero dependências. O FPS do canto é medido no seu navegador.",
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
        "Sou Eduardo Miranda Faria. Trabalho com tecnologia aplicada a negócio real — o tipo que tem estoque, cliente ligando e prazo apertado.",
        "Atendo empresas em todo o Brasil: distribuidoras, oficinas, transportadoras, comércio e prestadores de serviço. Gente que já faturou o suficiente para saber que planilha solta não escala mais.",
        "Trabalho sozinho, do briefing à entrega — com IA como alavanca em todo o processo: ela acelera o código e a criação visual; arquitetura, hierarquia e o que fica de fora continuam sendo decisão minha. Sob medida de verdade, sem o custo de uma agência. Tudo que sai daqui passa pela minha mão antes de chegar na sua.",
      ],
      location: "Atendimento remoto para todo o Brasil.",
      facadeCaption: "Arte generativa de marca — IA",
      trajectoryLabel: "Trajetória",
      trajectory: "Oito sistemas completos entregues em distribuição de peças, logística, agronegócio, comércio e arte — marca, interface, modelo de dados e publicação, de ponta a ponta. No caminho, sites que vendem no silêncio do WhatsApp, estoques que se corrigem sozinhos, identidades impressas em papel — e o aplicativo que a minha própria rede de vendas usa para não perder um lead.",
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
    footer: {
      tagline: "Miranda Faria · Consultoria & Tecnologia · Brasil",
      privacy: "Política de Privacidade",
      linkedin: "LinkedIn",
      sellers: "App dos vendedores",
    },
    servicos: {
      label: "Serviços",
      lead: "Três soluções, um princípio de operação.",
      intro:
        "Sistemas, design e gestão — cada um entrega sozinho, todos desenhados para funcionar como um só.",
      metricsLabel: "Em números",
      metrics: [
        { n: "8+", d: "projetos entregues entre sites e sistemas" },
        { n: "24h", d: "para resposta — direto com quem executa" },
        { n: "3", d: "frentes que se combinam: sistema, design e dados" },
        { n: "100%", d: "sob medida, do briefing à entrega" },
      ],
      bandLayers: ["Superfície", "Sistema", "Dados", "Fundação"],
      bandStat:
        "6 em cada 10 empresas brasileiras não chegam ao quinto ano. Quase nunca falta mercado — falta estrutura por baixo.",
      bandSource: "IBGE · SEBRAE",
      verticalsLabel: "As soluções",
      faq: [
        {
          q: "Quanto custa?",
          a: "Depende do vazamento — e é por isso que o diagnóstico existe. Primeiro eu numero o que a demora, a taxa de app ou a venda perdida custam por mês; a proposta chega como fração dessa economia anual. Numa operação que perde R$ 4.000/mês, uma solução de cerca de R$ 15 mil se paga em três meses e devolve R$ 33 mil no primeiro ano. Site institucional e sistema têm faixas diferentes — o diagnóstico diz qual é o seu, sem surpresa no meio.",
        },
        {
          q: "Em quanto tempo fica pronto?",
          a: "Sistema: semanas, não meses. Site institucional: menos ainda. A primeira demo navegável sai na primeira semana — você vê o seu problema sendo resolvido antes de pagar o projeto inteiro.",
        },
        {
          q: "E depois da entrega?",
          a: "O sistema é seu, no seu nome. Se quiser, manutenção e evolução continuam comigo — sem fidelidade, sem amarração.",
        },
      ],
      faqLabel: "O que perguntam antes de fechar",
      seeVertical: "Ver a solução",
      cards: {
        gestao: "O pedido que hoje morre na conversa — num sistema que é seu.",
        design: "Marca e interface que sustentam o preço premium.",
        desenvolvimento: "Site que trabalha por você — o lead chega pronto, no seu WhatsApp.",
      },
      cta: "Começar um projeto",
    },
    diag: {
      label: "Diagnóstico",
      lead: "Quanto está vazando por mês?",
      intro:
        "Três perguntas e uma estimativa do custo do seu problema — antes de falar de preço ou de tecnologia. É assim que eu trabalho: primeiro o tamanho da dor, depois a solução.",
      evidence:
        "Dois números para guardar: quem responde a um cliente em 5 minutos tem 21× mais chance de qualificá-lo do que quem demora 30 — MIT/InsideSales. E a média das empresas demora 42 horas para responder um lead — Harvard Business Review. Um sistema existe pra você ficar do lado certo desses números.",
      meta: "Estimativa a partir de médias de mercado. O diagnóstico de verdade acontece na conversa.",
      steps: { pain: "A dor", revenue: "O porte", urgency: "A urgência" },
      painQ: "Onde dói mais hoje?",
      painHint: "Escolha o principal.",
      pains: [
        {
          id: "marketplace",
          t: "Dependo de marketplace",
          d: "iFood, Rappi, Instagram — o meio fica com comissão em cada venda e com o cliente.",
        },
        {
          id: "excel",
          t: "Vivo de planilha e papel",
          d: "Estoque, pedido e caixa no Excel — ou na cabeça de alguém.",
        },
        {
          id: "curiosos",
          t: "Muita mensagem de curioso, pouca venda",
          d: "Horas do dia gastas respondendo mensagem de quem nunca compra — e o cliente de verdade espera.",
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
      revenueQ: "Faturamento mensal aproximado?",
      revenueHint: "Faixas — ninguém precisa de número exato aqui.",
      revenues: ["Até R$ 10 mil", "R$ 10–30 mil", "R$ 30–100 mil", "Mais de R$ 100 mil"],
      urgencyQ: "Quando você quer resolver?",
      urgencies: [
        { id: "now", t: "Já está sangrando", d: "Cada mês de atraso custa dinheiro de verdade." },
        { id: "months", t: "Nos próximos meses", d: "Está no plano — mas não pode empurrar pra sempre." },
        { id: "later", t: "Planejando o ano que vem", d: "Quero entender o tamanho antes." },
      ],
      result: {
        label: "Seu vazamento estimado",
        perMonth: "por mês",
        perYear: "por ano",
        delayCost: "Cada mês de atraso custa cerca de",
        solutionLabel: "O que resolve",
        solutionSee: "Ver a solução",
        cta: "Falar no WhatsApp com o diagnóstico pronto",
        restart: "Refazer o diagnóstico",
        perDay: "por dia útil",
        recoveryLabel: "Recuperável",
        recoveryNote:
          "Operações como essa costumam recuperar boa parte disso já no primeiro trimestre — o resto é lucro que ficava na mesa.",
        reading: "É o preço de manter as coisas como estão — não um orçamento, um vazamento.",
        copyCta: "Copiar resultado",
        copied: "Copiado",
        back: "Voltar",
        howLabel: "Como estimamos",
        pricingNote:
          "Como a proposta chega: como fração da economia anual que o diagnóstico apontar — nunca como número solto. O preço nasce do contexto, não da tabela.",
        how: "Cada dor mapeia uma média de mercado: comissões de 15–30% da receita no modelo marketplace, horas perdidas com operação manual e atendimento de curiosos — cerca de um quarto da semana de um negócio escorre em tarefas repetitivas (Smartsheet) —, ou a margem que fica na mesa quando a decisão é no chute. As faixas são deliberadamente conservadoras: ~30% das atividades da maioria das operações são automatizáveis (McKinsey), e a estimativa conta só o que o básico recupera. O número honesto sai da conversa.",
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
    },
    {
      slug: "1000-pecas",
      practice: "gestao",
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
      name: "Rota Forte",
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
      slug: "dj-jotave",
      practice: "desenvolvimento",
      name: "DJ Jotavê",
      sector: "Artist",
      year: "2025",
      summary: "Full presentation site: identity, schedule and promotional material.",
      problem:
        "An artist whose bookings ran entirely through social media DMs, with no single place a promoter could go to see the work, the schedule and the press material.",
      process:
        "Built identity and site together. This is the project where the scroll system — Lenis with GSAP ScrollTrigger on a single ticker — was first worked out; that system is the direct ancestor of the one running on this site.",
      decisions:
        "Chose scroll choreography over a static portfolio grid: for a performer, the site had to have a sense of motion and staging, not just be an archive.",
      impact:
        "One address for promoters, with the schedule and press material in the same place as the work.",
    },
    {
      slug: "miranda-faria",
      practice: "design",
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
      slug: "queijos-serra-loja",
      practice: "desenvolvimento",
      name: "Queijos da Serra — Loja",
      sector: "Artisanal cheese retail",
      year: "2024",
      summary: "A shop counter that now takes orders over WhatsApp — typed, ahead of time.",
      problem:
        "A cheese shop in a small Minas Gerais town selling only across the counter. No way to browse the case before visiting, and no way to order ahead for pickup.",
      process:
        "The shop's catalogue became a page, in the shop's own language. The order is assembled on WhatsApp and arrives as a ready message.",
      decisions:
        "WhatsApp instead of a shopping cart: no payment machinery to maintain, and the order lands in the channel the shop already answers. Pickup at the counter kept the operation local instead of inventing logistics.",
      impact:
        "The counter stopped being the only entrance — the order arrives typed, and the shop answers from the counter it already owns.",
    },
    {
      slug: "solarsat",
      practice: "desenvolvimento",
      name: "SOLARSAT",
      sector: "Technical services — antennas and solar cleaning",
      year: "2026",
      summary: "Local technical services with the quote one tap away.",
      problem:
        "A satellite antenna installation and photovoltaic panel cleaning business in Piumhi and region, living on word of mouth. The work was good; the findability was zero.",
      process:
        "A services page that says exactly what is done, where it is done, and what it costs to ask. The quote request goes to WhatsApp with the service already in the message.",
      decisions:
        "Wrote the region into the copy instead of a generic 'we serve your area' — local search is won by naming the territory. Kept the two services as equals rather than hiding the newer one.",
      impact:
        "The phone number stopped being a rumour: the site hands over the enquiry, pre-filled.",
    },
    {
      slug: "motormoura-marca",
      practice: "design",
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
  ],
  pt: [
    {
      slug: "queijos-serra",
      practice: "gestao",
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
    },
    {
      slug: "1000-pecas",
      practice: "gestao",
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
      name: "Rota Forte",
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
      slug: "dj-jotave",
      practice: "desenvolvimento",
      name: "DJ Jotavê",
      sector: "Artista",
      year: "2025",
      summary: "Site de apresentação completo: identidade, agenda e material de divulgação.",
      problem:
        "Artista com a agenda inteira rodando por DM de rede social, sem um lugar único onde o contratante visse o trabalho, a agenda e o material de imprensa.",
      process:
        "Identidade e site construídos juntos. É o projeto onde o sistema de scroll — Lenis com GSAP ScrollTrigger num ticker único — foi resolvido pela primeira vez; esse sistema é o ancestral direto do que roda neste site.",
      decisions:
        "Escolhi coreografia de scroll em vez de grade estática de portfólio: para quem se apresenta, o site precisava ter movimento e encenação, não ser só um arquivo.",
      impact:
        "Um endereço só para contratante, com agenda e material de imprensa no mesmo lugar do trabalho.",
    },
    {
      slug: "miranda-faria",
      practice: "design",
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
      slug: "queijos-serra-loja",
      practice: "desenvolvimento",
      name: "Queijos da Serra — Loja",
      sector: "Varejo de queijos artesanais",
      year: "2024",
      summary: "Um balcão que agora recebe pedido por WhatsApp — digitado, com antecedência.",
      problem:
        "Uma loja de queijos no interior de Minas vendendo só no balcão. Sem como ver o estoque antes de visitar, sem como encomendar com antecedência para retirar.",
      process:
        "O catálogo da loja virou página, na linguagem da própria loja. O pedido se monta no WhatsApp e chega como mensagem pronta.",
      decisions:
        "WhatsApp em vez de carrinho de compras: sem maquinário de pagamento pra manter, e o pedido cai no canal que a loja já atende. Retirada no balcão manteve a operação local — nenhuma logística inventada.",
      impact:
        "O balcão deixou de ser a única porta de entrada — o pedido chega digitado, e a loja responde do balcão que já tem.",
    },
    {
      slug: "solarsat",
      practice: "desenvolvimento",
      name: "SOLARSAT",
      sector: "Serviços técnicos — antenas e limpeza solar",
      year: "2026",
      summary: "Serviços técnicos locais com o orçamento a um toque de distância.",
      problem:
        "Instalação de antenas parabólicas e limpeza de painéis fotovoltaicos em Piumhi e região, vivendo de indicação boca a boca. O serviço era bom; a encontrabilidade, zero.",
      process:
        "Uma página de serviços que diz exatamente o que é feito, onde é feito, e quanto custa perguntar. O orçamento vai pro WhatsApp com o serviço já na mensagem.",
      decisions:
        "Escrevi a região na copy em vez de um genérico 'atendemos sua área' — busca local se ganha nomeando o território. Mantive os dois serviços como iguais, sem esconder o mais novo.",
      impact:
        "O telefone deixou de ser boato: o site entrega o pedido, pré-preenchido.",
    },
    {
      slug: "motormoura-marca",
      practice: "design",
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
export const PRACTICE_SLUGS = ["gestao", "desenvolvimento", "design"];

export const practices = {
  en: {
    gestao: {
      slug: "gestao",
      label: "Systems & Management",
      lead: "Software the owner runs, not me.",
      intro:
        "Catalogues, inventory, ordering, admin panels and the numbers behind them, on a real database with an interface the client operates without calling me. Delivery is measured in weeks, not months.",
      artAlt: "Blueprint linework resolving into built structure",
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Catalogue and inventory",
          d: "Products, categories, brands and images modelled as real entities, not spreadsheet rows. Searchable, filterable, and editable by the person who owns the business.",
        },
        {
          t: "Ordering and workflow",
          d: "Orders that stop dying inside a message thread. Status, history and a record of who did what, in one place.",
        },
        {
          t: "Dashboards and data",
          d: "Sales, stock and margin on one screen that updates itself. The monthly report stops being something someone assembles by hand.",
        },
        {
          t: "Ownership",
          d: "The client registers, edits and publishes without me — and hosting ends up in their name. I leave, the system keeps running.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura and 1000 Peças: catalogues a customer can browse and a quote flow that runs without a phone call.",
        "Queijos da Serra: lot-level inventory with FEFO ordering and expiry-tiered alerts.",
        "The monthly report replaced by a panel that updates itself.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "Brand and interface, made fast without looking fast.",
      intro:
        "Identity, design system and the applied pieces. AI generates the first drafts — Lovart for imagery, code for the system — and every piece passes through my hands before it ships. That is the difference between leverage and a shortcut.",
      artAlt: "Translucent planes composing, some still finding position",
      gen: {
        label: "GENERATIVE ART — AI",
        title: "Design of every kind",
        desc:
          "Identity in motion, image, film and space — all of it designed and directed here. The pieces below were generated and art-directed with AI: copper particles for a brand that moves, and the Miranda Faria sign as a study of the mark out in the street.",
        capA: "Copper particles — identity in motion",
        capB: "Miranda Faria sign — generative study",
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
          d: "Dozens of directions generated in hours instead of days. The generation is cheap; the selection is the work, and the selection is mine.",
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
        "DJ Jotavê: identity and presentation site for stage and promoters.",
        "This site: identity, motion and code by the same hand you would hire.",
      ],
      casesLabel: "Built this way",
      closingCta: { label: "See the case of this site", to: "work/miranda-faria" },
      cta: "Start a project",
    },
    desenvolvimento: {
      slug: "desenvolvimento",
      label: "Development",
      lead: "Sites that work the lead, not just present it.",
      intro:
        "Institutional sites, landing pages and WhatsApp-first storefronts. Structure to convert: the visitor arrives at the conversation instead of at a dead form. Launched in days, not quarters.",
      artAlt: "A geological core sample sectioned into layers of data",
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Institutional site",
          d: "The business presented properly: what it does, for whom, and why it charges what it charges. Real copy, no template smell.",
        },
        {
          t: "WhatsApp-first pages",
          d: "Pages built so the next step is a tap: the message arrives with context — what the visitor saw, what they want. Quote, booking, order — the conversation starts already informed.",
        },
        {
          t: "Capture and presentation",
          d: "Galleries, catalogues and calculators that make the visitor do something measurable before leaving.",
        },
        {
          t: "Hosting and upkeep",
          d: "Fast, hosted, domain in the client's name. Changes ship in hours when the business asks.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "Rota Forte: a page whose only job is to route the right enquiry to WhatsApp — and it does.",
        "Paulo Henrique: a presentation site with a performance lab the visitor actually uses.",
        "Queijos da Serra — Loja and SOLARSAT: storefronts where the order and the quote start on WhatsApp.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
  },

  pt: {
    gestao: {
      slug: "gestao",
      label: "Sistemas & Gestão",
      lead: "Sistema que o dono opera, não eu.",
      intro:
        "Catálogo, estoque, pedidos, painéis administrativos e os números por trás deles, sobre um banco de dados de verdade com interface que o cliente opera sem me ligar. Entrega medida em semanas, não meses.",
      artAlt: "Traço de planta baixa se resolvendo em estrutura construída",
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Catálogo e estoque",
          d: "Produtos, categorias, marcas e imagens modelados como entidades de verdade, não linhas de planilha. Buscáveis, filtráveis, editáveis por quem é dono do negócio.",
        },
        {
          t: "Pedidos e fluxo",
          d: "O pedido que deixa de morrer dentro de uma conversa. Status, histórico e registro de quem fez o quê, num lugar só.",
        },
        {
          t: "Painéis e dados",
          d: "Venda, estoque e margem numa tela que atualiza sozinha. O relatório mensal deixa de ser algo que alguém monta à mão.",
        },
        {
          t: "Propriedade",
          d: "O cliente cadastra, edita e publica sem mim — e a hospedagem fica no nome dele. Eu saio, o sistema continua rodando.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "MotorMoura e 1000 Peças: catálogos que o cliente navega e um fluxo de orçamento que roda sem telefonema.",
        "Queijos da Serra: estoque por lote com ordenação FEFO e alertas escalonados por validade.",
        "O relatório mensal substituído por um painel que atualiza sozinho.",
      ],
      casesLabel: "Feitos assim",
      cta: "Começar um projeto",
    },
    design: {
      slug: "design",
      label: "Design",
      lead: "Marca e interface, rápido sem parecer apressado.",
      intro:
        "Identidade, design system e as peças de aplicação. A IA gera os primeiros rascunhos — Lovart para imagem, código para o sistema — e cada peça passa pela minha mão antes de sair. É essa a diferença entre alavanca e atalho.",
      artAlt: "Planos translúcidos se compondo, alguns ainda assentando",
      gen: {
        label: "ARTE GENERATIVA — IA",
        title: "Design de todo tipo",
        desc:
          "Identidade em movimento, imagem, filme e espaço — tudo desenhado e dirigido aqui. As peças abaixo foram geradas e dirigidas com IA: partículas de cobre para uma marca que se move, e a placa Miranda Faria como estudo da marca na rua.",
        capA: "Partículas de cobre — identidade em movimento",
        capB: "Placa Miranda Faria — estudo generativo",
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
          d: "Dezenas de direções geradas em horas, não em dias. Gerar é barato; escolher é o trabalho, e a escolha é minha.",
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
        "DJ Jotavê: identidade e site de apresentação para palco e contratante.",
        "Este site: identidade, movimento e código pela mesma mão que você contrataria.",
      ],
      casesLabel: "Feitos assim",
      closingCta: { label: "Ver o case deste site", to: "work/miranda-faria" },
      cta: "Começar um projeto",
    },
    desenvolvimento: {
      slug: "desenvolvimento",
      label: "Desenvolvimento",
      lead: "Site que trabalha o lead, não só apresenta.",
      intro:
        "Sites institucionais, landing pages e vitrines WhatsApp-first. Estrutura para converter: o visitante chega na conversa em vez de chegar num formulário morto. No ar em dias, não em trimestres.",
      artAlt: "Um testemunho geológico seccionado em camadas de dados",
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Site institucional",
          d: "O negócio apresentado direito: o que faz, para quem, e por que cobra o que cobra. Texto de verdade, sem cheiro de template.",
        },
        {
          t: "Páginas WhatsApp-first",
          d: "Páginas feitas para o próximo passo ser um toque: a mensagem chega com contexto — o que o visitante viu, o que ele quer. Orçamento, agendamento, pedido — a conversa começa já informada.",
        },
        {
          t: "Captura e apresentação",
          d: "Galerias, catálogos e calculadoras que fazem o visitante fazer algo mensurável antes de ir embora.",
        },
        {
          t: "Hospedagem e manutenção",
          d: "Rápido, hospedado, domínio no nome do cliente. Mudança sobe em horas quando o negócio pede.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "Rota Forte: uma página cujo único trabalho é levar o orçamento certo pro WhatsApp — e ela leva.",
        "Paulo Henrique: site de apresentação com um laboratório de performance que o visitante usa de verdade.",
        "Queijos da Serra — Loja e SOLARSAT: vitrines em que o pedido e o orçamento começam no WhatsApp.",
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