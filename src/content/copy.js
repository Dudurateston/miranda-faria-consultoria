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
  "queijos-santana",
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
    },
    nav: {
      home: "Home",
      systems: "Systems",
      design: "Design",
      business: "Business",
      work: "Work",
      howIWork: "How I work",
      about: "About",
      services: "Services",
      technology: "Technology",
      insights: "Insights",
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
      insightsPreview: { cta: "See all insights" },
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
        "I work solo and ship fast, using an orchestrated AI workflow through the mechanical parts of the build. Everything that leaves here passes through my hands before it reaches you.",
      ],
      location: "Based in Brazil (UTC−3) — full working-day overlap with US hours, partial with Europe.",
      trajectoryLabel: "Trajectory",
      trajectory: "Eight complete systems shipped across parts distribution, logistics, agribusiness, retail and the arts — brand, interface, data model and deployment, end to end.",
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
        types: { systems: "Systems", design: "Design", business: "Business / consulting" },
        message: "Message",
        whatsapp: "Prefer to schedule a meeting over WhatsApp?",
        submit: "Send",
        sending: "Sending…",
        error: "Check the required fields.",
        errorServer: "Something failed on the way. Try again, or reach me on WhatsApp.",
        sent: "Received — I'll be in touch today.",
      },
    },
    footer: {
      tagline: "Miranda Faria · Design Engineer & Creative Technologist",
      privacy: "Privacy",
      linkedin: "LinkedIn",
    },
    servicos: {
      label: "Services",
      lead: "Three solutions, one operating principle.",
      intro:
        "Systems, design and business intelligence — each shippable alone, designed to work as one.",
      metricsLabel: "In numbers",
      metrics: [
        { n: "8+", d: "projects across sites and systems, end to end" },
        { n: "24h", d: "same-day response — straight from who builds it" },
        { n: "100%", d: "tailor-made — nothing ships from a template" },
        { n: "3", d: "solutions that combine into one system" },
      ],
      bandLayers: ["Surface", "System", "Data", "Foundation"],
      bandStat:
        "About half of new US businesses never reach year five. It is rarely the market that runs out — it is the structure underneath.",
      bandSource: "U.S. Bureau of Labor Statistics",
      verticalsLabel: "The solutions",
      seeVertical: "See the solution",
      cta: "Start a project",
    },
    insights: {
      label: "Insights",
      lead: "Notes from the work.",
      intro:
        "Short technical notes on how systems, design and data hold together — written from the field, not from a deck.",
      items: [
        {
          tag: "Data",
          t: "The data model comes before the dashboard",
          d: "A panel nobody trusts is a spreadsheet with better lighting. Before any chart, decide what is stored, what is derived and how the pieces relate — the dashboard is the last layer, not the first.",
        },
        {
          tag: "AI",
          t: "Leverage, not shortcut",
          d: "AI writes the mechanical code and drafts the first visual directions. It does not decide the architecture, the hierarchy or what gets cut. Generation is cheap; selection is the work.",
        },
        {
          tag: "Systems",
          t: "The owner is the second user",
          d: "A system the client cannot operate alone is a subscription disguised as a product. Every project ships with the admin in the client's hands and the infrastructure in their name.",
        },
        {
          tag: "Design",
          t: "Load time is the first impression",
          d: "Before any animation, the visitor judges the weight of the page. A site that opens slowly reads as carelessness — and no showcase fixes a broken first impression.",
        },
      ],
    },
  },

  pt: {
    meta: {
      title: "Miranda Faria — Consultoria & Tecnologia",
      description:
        "Sistemas sob medida, BI, automação e identidade visual para negócios que já não cabem mais na planilha.",
    },
    nav: {
      home: "Início",
      systems: "Sistemas",
      design: "Design",
      business: "Gestão",
      work: "Trabalhos",
      howIWork: "Como funciona",
      about: "Sobre",
      services: "Serviços",
      technology: "Tecnologia",
      insights: "Insights",
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
      insightsPreview: { cta: "Ver todos os insights" },
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
        "Trabalho sozinho e entrego rápido. Uso IA em boa parte do processo — na construção dos sistemas e na criação visual —, e é por isso que consigo fazer sob medida por um preço que agência não alcança. O que sai daqui passa pela minha mão antes de chegar em você.",
      ],
      location: "Atendimento remoto para todo o Brasil.",
      trajectoryLabel: "Trajetória",
      trajectory: "Oito sistemas completos entregues em distribuição de peças, logística, agronegócio, comércio e arte — marca, interface, modelo de dados e publicação, de ponta a ponta.",
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
        types: { systems: "Sistemas", design: "Design", business: "Gestão / consultoria" },
        message: "Mensagem",
        whatsapp: "Prefere agendar reunião por WhatsApp?",
        submit: "Enviar",
        sending: "Enviando…",
        error: "Confira os campos obrigatórios.",
        errorServer: "Algo falhou no caminho. Tente de novo, ou me chame no WhatsApp.",
        sent: "Recebido — retorno hoje.",
      },
    },
    footer: {
      tagline: "Miranda Faria · Consultoria & Tecnologia · Brasil",
      privacy: "Política de Privacidade",
      linkedin: "LinkedIn",
    },
    servicos: {
      label: "Serviços",
      lead: "Três soluções, um princípio de operação.",
      intro:
        "Sistemas, design e gestão — cada um entrega sozinho, todos desenhados para funcionar como um só.",
      metricsLabel: "Em números",
      metrics: [
        { n: "8+", d: "projetos entre sites e sistemas, de ponta a ponta" },
        { n: "24h", d: "resposta no mesmo dia — direto com quem executa" },
        { n: "100%", d: "sob medida — nenhum projeto sai de template" },
        { n: "3", d: "soluções que se combinam num sistema só" },
      ],
      bandLayers: ["Superfície", "Sistema", "Dados", "Fundação"],
      bandStat:
        "6 em cada 10 empresas brasileiras não chegam ao quinto ano. Quase nunca falta mercado — falta estrutura por baixo.",
      bandSource: "IBGE · SEBRAE",
      verticalsLabel: "As soluções",
      seeVertical: "Ver a solução",
      cta: "Começar um projeto",
    },
    insights: {
      label: "Insights",
      lead: "Notas do trabalho.",
      intro:
        "Notas curtas sobre como sistema, design e dado se sustentam juntos — escritas do campo, não do slide.",
      items: [
        {
          tag: "Dados",
          t: "O modelo de dados vem antes do painel",
          d: "Painel em que ninguém confia é planilha com iluminação melhor. Antes de qualquer gráfico: o que é guardado, o que é calculado e como as peças se relacionam — o painel é a última camada, não a primeira.",
        },
        {
          tag: "IA",
          t: "Alavanca, não atalho",
          d: "A IA escreve o código mecânico e rascunha as primeiras direções visuais. Ela não decide arquitetura, hierarquia, nem o que sai fora. Gerar é barato; escolher é o trabalho.",
        },
        {
          tag: "Sistemas",
          t: "O dono é o segundo usuário",
          d: "Sistema que o cliente não opera sozinho é assinatura disfarçada de produto. Todo projeto sai com o painel na mão do cliente e a infraestrutura no nome dele.",
        },
        {
          tag: "Design",
          t: "O carregamento é a primeira impressão",
          d: "Antes de qualquer animação, o visitante julga o peso da página. Site que abre devagar comunica descuido — e nenhuma vitrine conserta a primeira impressão furada.",
        },
      ],
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
      slug: "queijos-santana",
      practice: "business",
      name: "Queijos Santana",
      sector: "Artisanal cheese production",
      year: "2026",
      media: { dir: "queijos-santana", shots: 3, video: true },
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
      practice: "systems",
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
      practice: "design",
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
      practice: "systems",
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
        "Chose an owner-operated admin over a service contract: the client registers products, categories and images without touching me. The data model allows a product to carry multiple brands and applications, which is how the parts business actually works.",
      impact:
        "The catalogue left the owner's head and became something the team can query. Registration no longer routes through one person.",
    },
    {
      slug: "1000-pecas",
      practice: "systems",
      name: "1000 Peças Truck Center",
      sector: "Heavy vehicle parts",
      year: "2026",
      summary: "Digital presence and catalogue structure for a heavy parts operation.",
      problem:
        "A truck parts operation with no digital surface at all — customers found it by phone and word of mouth, and the inventory had no queryable form.",
      process:
        "Built the public presence and the catalogue structure together, so the storefront and the data model were designed against each other rather than one being retrofitted onto the other.",
      decisions:
        "Kept the first release deliberately narrow: presence and catalogue structure, no checkout. Heavy parts sell through a quote conversation, and forcing a cart onto that would have fought the actual sales process.",
      impact:
        "The operation has a public surface and a catalogue that can grow without a rebuild.",
    },
    {
      slug: "rota-forte",
      practice: "business",
      name: "Rota Forte Logística",
      sector: "Logistics and transport",
      year: "2026",
      summary: "Site and digital structure for a logistics operation.",
      problem:
        "A logistics operation that needed a credible public face for contract clients, and internal structure that did not depend on spreadsheets passed around by message.",
      process:
        "Designed the public site and the internal structure as one project, sharing a single visual system and a single data vocabulary.",
      decisions:
        "Prioritised legibility for contract clients over visual novelty — in logistics, the site is a trust document before it is a brochure.",
      impact:
        "A public face that matches the size of the operation, and structure that no longer lives in message threads.",
    },
    {
      slug: "dj-jotave",
      practice: "design",
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
        "The brand, the design system, the motion and the code — the most direct example of what I ship.",
      problem:
        "I needed a portfolio that demonstrated the claim rather than asserting it: if I say I do brand, product and data as one, the site itself has to be the proof.",
      process:
        "Brand first — palette, type, the geological strata motif — then a token system, then the code. The hero went through a long sequence of failed approaches (a 65-frame scroll sequence, manual vectorisation, a liquid-metal shader) before the direction settled on procedurally generated motion with no external image dependency.",
      decisions:
        "Documented every abandoned path in the repository rather than quietly deleting it, so the reasoning survives. Chose real /en and /pt routes over a hash toggle, for correct indexing. Removed the contact form entirely: a direct link converts better than a field.",
      impact:
        "The site is the case. Everything visible here was designed, built and deployed by one person.",
    },
  ],
  pt: [
    {
      slug: "queijos-santana",
      practice: "business",
      name: "Queijos Santana",
      sector: "Produção de queijo artesanal",
      year: "2026",
      media: { dir: "queijos-santana", shots: 3, video: true },
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
      practice: "systems",
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
      practice: "design",
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
      practice: "systems",
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
        "Escolhi painel operado pelo dono em vez de contrato de manutenção: o cliente cadastra produto, categoria e imagem sem me acionar. O modelo de dados permite um produto carregar várias marcas e aplicações, que é como o negócio de peça funciona de fato.",
      impact:
        "O catálogo saiu da cabeça do dono e virou algo que a equipe consulta. O cadastro não passa mais por uma pessoa só.",
    },
    {
      slug: "1000-pecas",
      practice: "systems",
      name: "1000 Peças Truck Center",
      sector: "Peças para caminhão",
      year: "2026",
      summary: "Presença digital e estrutura de catálogo para operação de peças pesadas.",
      problem:
        "Operação de peças de caminhão sem nenhuma superfície digital — o cliente achava por telefone e indicação, e o estoque não tinha forma consultável.",
      process:
        "Construí a presença pública e a estrutura de catálogo juntas, para a vitrine e o modelo de dados serem desenhados um contra o outro, em vez de um ser encaixado no outro depois.",
      decisions:
        "Mantive a primeira entrega deliberadamente estreita: presença e estrutura de catálogo, sem carrinho. Peça pesada se vende por conversa de orçamento, e forçar um checkout ali brigaria com o processo real de venda.",
      impact:
        "A operação tem superfície pública e um catálogo que cresce sem precisar refazer.",
    },
    {
      slug: "rota-forte",
      practice: "business",
      name: "Rota Forte Logística",
      sector: "Logística e transporte",
      year: "2026",
      summary: "Site e estrutura digital para operação de logística.",
      problem:
        "Operação de logística que precisava de uma cara pública crível para cliente de contrato, e de estrutura interna que não dependesse de planilha passando por mensagem.",
      process:
        "Desenhei o site público e a estrutura interna como um projeto só, com o mesmo sistema visual e o mesmo vocabulário de dados.",
      decisions:
        "Priorizei legibilidade para cliente de contrato em vez de novidade visual — em logística, o site é um documento de confiança antes de ser um folheto.",
      impact:
        "Uma cara pública do tamanho da operação, e estrutura que não mora mais em thread de mensagem.",
    },
    {
      slug: "dj-jotave",
      practice: "design",
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
        "A marca, o design system, o movimento e o código — o exemplo mais direto do que eu entrego.",
      problem:
        "Eu precisava de um portfólio que demonstrasse a afirmação em vez de declará-la: se eu digo que faço marca, produto e dado como uma coisa só, o site tem que ser a prova.",
      process:
        "Marca primeiro — paleta, tipografia, o motivo de estratos geológicos — depois o sistema de tokens, depois o código. A hero passou por uma sequência longa de caminhos que falharam (sequência de 65 quadros, vetorização manual, shader de metal líquido) antes da direção assentar em movimento gerado proceduralmente, sem depender de imagem externa.",
      decisions:
        "Documentei cada caminho abandonado no repositório em vez de apagar em silêncio, para o raciocínio sobreviver. Escolhi rotas reais /en e /pt em vez de toggle por hash, para indexar direito. Removi o formulário de contato por completo: link direto converte mais que campo para preencher.",
      impact:
        "O site é o case. Tudo que está visível aqui foi desenhado, construído e publicado por uma pessoa.",
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
export const PRACTICE_SLUGS = ["systems", "design", "business"];

export const practices = {
  en: {
    systems: {
      slug: "systems",
      label: "Systems",
      lead: "Software the owner runs, not me.",
      intro:
        "Catalogues, inventory, ordering and admin panels, built on a real database with an interface the client operates without calling me. Delivery is measured in weeks, not months.",
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
          t: "Admin panel",
          d: "The client registers, edits and publishes without me. No maintenance contract disguised as a feature.",
        },
        {
          t: "Ownership",
          d: "Hosting and infrastructure end up in the client's name. I leave, the system keeps running.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "MotorMoura and 1000 Peças: catalogues a customer can browse and a quote flow that runs without a phone call.",
        "Roda de Agronegócios: exhibition space sold straight from an interactive floor map.",
        "Queijos Santana: lot-level inventory with FEFO ordering the owner trusts.",
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
        "DJ Jotavê: full presentation site — identity, schedule and promotional material.",
        "Paulo Henrique: brand and interface built for an athlete's audience.",
        "This site: identity, motion and code by the same hand you would hire.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
    business: {
      slug: "business",
      label: "Business",
      lead: "Numbers that update themselves.",
      intro:
        "BI, dashboards and automation. Sales, inventory, margin and productivity on one screen that refreshes on its own, plus the flows that run without anyone pressing a button.",
      artAlt: "A geological core sample sectioned into layers of data",
      deliverablesLabel: "What I deliver",
      deliverables: [
        {
          t: "Dashboards",
          d: "Your numbers leave the manual spreadsheet and become a panel that updates itself. One screen, and a number the team actually trusts.",
        },
        {
          t: "Automation",
          d: "Flows that run unattended: qualification, scheduling, the report that arrives by email already built.",
        },
        {
          t: "AI in the operation",
          d: "Applied where it removes repetitive work with a verifiable result — not sprinkled on so the deck can say the word.",
        },
        {
          t: "The data model",
          d: "The layer underneath: what is stored, what is derived, and how the pieces relate. Where most reporting projects quietly break.",
        },
      ],
      proofLabel: "Proof, not promise",
      proofs: [
        "Queijos Santana: expiry-tiered alerts on lots, stock queryable in seconds.",
        "Rota Forte: quote requests flowing to WhatsApp instead of a phone tag.",
        "The monthly report replaced by a panel that updates itself.",
      ],
      casesLabel: "Built this way",
      cta: "Start a project",
    },
  },

  pt: {
    systems: {
      slug: "systems",
      label: "Sistemas",
      lead: "Sistema que o dono opera, não eu.",
      intro:
        "Catálogo, estoque, cadastro e pedidos, com banco de dados de verdade e um painel que o cliente usa sem me chamar. A entrega se mede em semanas, não em meses.",
      artAlt: "Linhas de prancha virando estrutura construída",
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Catálogo e estoque",
          d: "Produto, categoria, marca e imagem como entidades de verdade, não linhas de planilha. Consultável, filtrável e editável por quem é dono do negócio.",
        },
        {
          t: "Pedidos e fluxo",
          d: "O pedido para de morrer na conversa. Status, histórico e registro de quem fez o quê, num lugar só.",
        },
        {
          t: "Painel administrativo",
          d: "O cliente cadastra, edita e publica sem mim. Sem contrato de manutenção disfarçado de funcionalidade.",
        },
        {
          t: "Titularidade",
          d: "Hospedagem e infraestrutura ficam no seu nome. Eu saio, o sistema continua.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "MotorMoura e 1000 Peças: catálogo que o cliente navega e orçamento que corre sem telefonema.",
        "Roda de Agronegócios: espaço de feira vendido direto num mapa interativo.",
        "Queijos Santana: estoque por lote com FEFO em que o dono confia.",
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
        "DJ Jotavê: site de apresentação completo — identidade, agenda e material promocional.",
        "Paulo Henrique: marca e interface feitas para o público de um atleta.",
        "Este site: identidade, movimento e código pela mesma mão que você contratarias.",
      ],
      casesLabel: "Feitos assim",
      cta: "Começar um projeto",
    },
    business: {
      slug: "business",
      label: "Gestão",
      lead: "Número que se atualiza sozinho.",
      intro:
        "BI, painéis e automação. Venda, estoque, margem e produtividade numa tela só, que atualiza sozinha — mais os fluxos que rodam sem ninguém apertar botão.",
      artAlt: "Testemunho de sondagem seccionado em camadas de dado",
      deliverablesLabel: "O que entrego",
      deliverables: [
        {
          t: "Painéis",
          d: "Seus números saem da planilha manual e viram painel que atualiza sozinho. Uma tela, e um número em que a equipe confia de verdade.",
        },
        {
          t: "Automação",
          d: "Fluxos que rodam sem ninguém apertar botão: qualificação, agendamento, o relatório que chega pronto no e-mail.",
        },
        {
          t: "IA na operação",
          d: "Aplicada onde tira trabalho repetitivo com resultado verificável — não polvilhada por cima para a proposta poder citar a palavra.",
        },
        {
          t: "O modelo de dados",
          d: "A camada de baixo: o que é guardado, o que é calculado e como as peças se relacionam. Onde a maioria dos projetos de relatório quebra em silêncio.",
        },
      ],
      proofLabel: "Prova, não promessa",
      proofs: [
        "Queijos Santana: alertas de validade por lote, estoque consultável em segundos.",
        "Rota Forte: pedidos de orçamento chegando no WhatsApp em vez de telefone tocando.",
        "O relatório mensal substituído por um painel que se atualiza sozinho.",
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