/**
 * Fonte da verdade do conteudo, por idioma.
 *
 * EN e PT NAO sao traducoes um do outro, e isso e proposital
 * (DECISIONS.md): o publico do EN e cliente internacional de projeto
 * remoto e recrutador no exterior; o publico do PT e PME local, com o
 * WhatsApp como canal. As duas versoes vendem coisas diferentes com a
 * mesma identidade.
 *
 * TODO(metricas): os campos `impact` de cada case estao com o resultado
 * qualitativo real, sem numero. As metricas reais sao pendencia aberta
 * no RECAP.md — preencher antes de publicar.
 */

export const CASE_SLUGS = [
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
    },
    work: {
      label: "Work",
      lead: "Systems in the field.",
      intro:
        "Five projects, each shipped end to end — brand, interface, data model and deployment. Screens and recordings only: client systems are not linked publicly.",
      viewCase: "Read the case",
      sections: {
        problem: "Problem",
        process: "Process",
        decisions: "Decisions",
        impact: "Impact",
      },
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
    },
    contact: {
      label: "Contact",
      lead: "Tell me where it's stuck.",
      body: "The fastest path is a short call. Bring the problem, not a spec — figuring out what to build is part of the work.",
      primary: "Book a call",
      secondary: "Send an email",
      response: "I answer the same day.",
    },
    footer: {
      tagline: "Miranda Faria · Design Engineer & Creative Technologist",
      privacy: "Privacy",
      linkedin: "LinkedIn",
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
      about: "Quem faz",
      contact: "Conversar",
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
    },
    work: {
      label: "Trabalhos",
      lead: "Projetos em campo.",
      intro:
        "Cinco projetos entregues de ponta a ponta — marca, interface, banco de dados e publicação. Só imagem e vídeo: os sistemas dos clientes não são linkados publicamente.",
      viewCase: "Ler o case",
      sections: {
        problem: "Problema",
        process: "Processo",
        decisions: "Decisões",
        impact: "Resultado",
      },
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
    },
    contact: {
      label: "Conversar",
      lead: "Me conta onde está travando.",
      body: "O caminho mais rápido é uma conversa curta. Traga o problema, não a especificação — descobrir o que construir faz parte do trabalho.",
      primary: "Chamar no WhatsApp",
      secondary: "Mandar e-mail",
      response: "Respondo no mesmo dia.",
    },
    footer: {
      tagline: "Miranda Faria · Consultoria & Tecnologia · Brasil",
      privacy: "Política de Privacidade",
      linkedin: "LinkedIn",
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
        "Catalogues, inventory, ordering and admin panels, built on a real database with an interface the client operates without calling me. Shipped on Base44, which is why the unit of delivery is weeks instead of months.",
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
        "Catálogo, estoque, cadastro e pedidos, com banco de dados de verdade e um painel que o cliente usa sem me chamar. Construído no Base44, e é por isso que a entrega se mede em semanas, não em meses.",
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
