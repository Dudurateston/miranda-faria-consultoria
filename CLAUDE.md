# CLAUDE.md — Contexto do projeto Miranda Faria

Este arquivo é lido automaticamente pelo Claude Code no início de cada
sessão. Contém tudo que já foi decidido — não redecidir do zero.

## Quem é o cliente

Eduardo Miranda Faria, brasileiro (Piumhi/MG). Constrói sistemas web, BI,
automação e identidade visual, sozinho, usando IA como parte do método.
Site pessoal para atrair clientes internacionais de projeto remoto E
recrutadores/vagas no exterior.

**Título profissional:** Design Engineer & Creative Technologist
**Uma linha:** I design and build complete web systems — brand, product
and data as one — solo, using an orchestrated AI workflow.
**Vantagem de localização:** Based in Brazil (UTC-3) — full working-day
overlap with US hours, partial with Europe.

## Identidade visual — FECHADA, não redesenhar

- Grafite `#1A1A18` · Branco-osso `#F5F1EA` · Cobre queimado `#B5502E`
  (único acento, usar com moderação) · Cinza-pedra `#8A8578`
- Tipografia: Playfair Display (serifada, títulos, versalete, tracking
  largo) + Inter (corpo) + JetBrains Mono (labels, caixa alta)
- Tom: editorial, minimalista, referência de escritório de arquitetura.
  Nunca estética de startup/SaaS genérico. Sem gradiente raso, sem ícone
  colorido, sem emoji, sem card com borda pesada.

Tudo isso já está implementado em `src/styles/tokens.css` (`--ink`,
`--bone`, `--copper`, `--stone`, `--font-display`, `--font-body`,
`--font-mono`). Use os tokens, não hardcode os valores.

## Motivo visual central: ESTRATOS / CAMADAS GEOLÓGICAS

Metáfora de marca: profundidade revelada — superfície → sistema → dados
→ base/fundação. Isso é o fio condutor do site inteiro, não só da hero.
Deve aparecer como: fundo generativo, divisor entre seções, textura de
card, transição entre páginas — sempre variando a implementação, nunca
repetindo o efeito idêntico duas vezes.

**Rejeitado e não retomar:** motivos pontiagudos (estalactite/estalagmite
— risco de leitura como ameaça, validado por pesquisa de UX). Referência
literal a agro/interior/regional (público agora é internacional).

## O logotipo — restrição técnica crítica

Monograma "M" de planos geométricos translúcidos sobrepostos, GERADO
POR IA (Lovart). É uma imagem raster, não um vetor limpo.

- Vetorização automática **falhou**: perdeu a transparência, virou
  manchas opacas chapadas. Não tentar de novo sem supervisão manual forte.
- Existe versão com fundo transparente (alpha real) e versão com fundo
  bege sólido.
- Existe uma versão secundária "M sólido" — geométrico, chapado, sem
  transparência — para favicon/ícone/avatar/tamanhos pequenos.
- **NÃO redesenhar a logo tentando imitar o original em vetor à mão** —
  já foi tentado, ficou "geométrico demais, longe do original", e o
  cliente rejeitou.

## Histórico técnico — erros já cometidos, não repetir

1. **Sequência de 65 quadros de vídeo/imagem para hero com scroll-scrub**
   → travou, pixelou, pesado (~2MB+), dependência frágil de hospedagem
   externa. Abandonado.
2. **Shader de metal líquido (`@paper-design/shaders-react`,
   `LiquidMetal`) usando a logo como máscara de imagem remota** →
   quebrou por **CORS**: o componente precisa `crossOrigin="anonymous"`
   para ler pixels da imagem via canvas, e a imagem estava hospedada em
   domínio/app diferente do app do site, sem cabeçalho CORS liberado.
   Resultado: shader caiu no fallback e preencheu um quadrado inteiro
   sem usar a máscara. **Lição: qualquer efeito que precise LER pixels
   de uma imagem (getImageData, canvas, WebGL textura) exige a imagem
   no MESMO domínio/origem do app, com CORS correto — ou gerar a forma
   proceduralmente em vez de depender de imagem externa.**
3. **PNG em 8K para hero** → peso excessivo, descartado antes de testar.
4. **Bug de ambiente Base44:** comandos `npm install` falhavam com erro
   "Tracker idealTree already exists" porque o `cwd` do terminal
   apontava para `/` (raiz) em vez de `/app`. Corrigido prefixando
   `cd /app && <comando>`. Não deve ocorrer no Claude Code (cwd correto
   por padrão), mas registrar caso apareça em ambiente similar.
5. **Efeitos puramente reativos ao cursor (parallax magnético, tilt 3D
   em hover, ponto pulsante) foram considerados "batidos" e
   insuficientes pelo cliente.** A direção atual é ELEMENTOS VIVOS E
   AUTÔNOMOS — que se movem sozinhos, sem depender de interação — não
   apenas mais reatividade a mouse/scroll.

## Direção criativa atual — elementos vivos/autônomos

Buscar sistemas que evoluem em tempo real por conta própria (referência:
UntilLabs/basement.studio, "living particle system", Codrops dez/2025).
Ideias já aprovadas conceitualmente, em ordem de prioridade sugerida:

1. **Sedimentação de partículas** — sistema de partículas (fBm + curl
   noise) formando o wordmark/motivo de camadas, respirando
   continuamente, nunca parado. WebGL/Three.js/R3F. Sem imagem externa
   (gera a forma proceduralmente ou usa texto como referência de forma).
2. **Núcleo de estratos** — reaction-diffusion (Gray-Scott) na paleta da
   marca, confinado a uma faixa, simulando organismo/sedimentação.
3. **Campo de fluxo geológico** — flow field de ruído Perlin como
   textura de transição entre páginas.
4. **Estratos que se acomodam** — física leve (matter.js/Verlet) em
   cards de projeto assentando ao revelar a seção.
5. **Testemunho de sondagem (core sample)** — coluna vertical animada
   mostrando métricas/KPIs por camada, na seção de BI/dados.

**Regras de segurança de qualquer elemento novo:**
- Nunca depender de imagem hospedada fora do domínio do app.
- Pausar quando fora da viewport (IntersectionObserver).
- Respeitar `prefers-reduced-motion` com fallback estático.
- Cap de partículas/resolução em mobile; medir FPS antes de aprovar.
- UM elemento "vivo" pesado por página, não vários simultâneos.

## Arquitetura do site — ALVO

Home-resumo + abas profundas independentes (não scroll único, não hub
raso). Nav, paleta, tipografia e grid ficam fixos entre páginas; cada
página ganha no máximo 1–2 "assinaturas" visuais próprias (ex.: um
fundo generativo diferente por aba).

```
/                  Home — resume tudo para quem só visita uma página
/systems           Sites e sistemas no Base44
/design            Design com Lovart e IA
/business          Gestão, BI e IA para negócios
/work              Índice de TODOS os projetos (transversal às três verticais)
/work/:slug        Case individual (Problema → Processo → Decisões → Resultado)
/how-i-work        Quatro camadas narrativas + como a IA é usada (fora da nav, no rodapé)
/about             Quem sou (foto ainda pendente — usar fallback tipográfico "EMF")
/contact           Contato
```

As três verticais compartilham `src/pages/Practice.jsx`, dirigida pelo
slug. Cada case declara sua vertical no campo `practice` em `copy.js`.
**Nunca renderizar moldura vazia esperando imagem** — use `ArtSlot`,
que desenha um estrato procedural e só troca pela arte depois que ela
confirma carregamento.

Texto completo de cada página, seção por seção, está em
`arquitetura-copy-final.md` — use como fonte da verdade do conteúdo,
mas ele precisa ser ATUALIZADO nos pontos abaixo antes de implementar.

## Estado REAL do repositório hoje — leia antes de assumir qualquer coisa

A fundação do alvo já está construída. O que falta é o acabamento de
alto impacto. Verificado no código:

| Decisão | Estado |
|---|---|
| Rotas de conteúdo | **Feito.** `/:lang`, `/:lang/work`, `/:lang/work/:slug`, `/:lang/how-i-work`, `/:lang/about`, `/:lang/contact` (`src/App.jsx`) |
| Idioma | **Feito.** EN padrão, rotas reais `/en` e `/pt`, `hreflang` por rota, `navigator.language` + `localStorage`, sem trava por IP (`src/lib/i18n.jsx`) |
| Formulário de contato | **Removido.** `ContactForm.jsx` e `sections/Conversar.jsx` apagados. CTA é link direto: WhatsApp no PT, Calendly no EN |
| Conteúdo | **Feito.** Tudo em `src/content/copy.js`. EN e PT não são traduções: EN vende para o mercado internacional, PT para o cliente nacional |
| Arte generativa | **Feito.** Gerada na Lovart, servida de `public/art` — abertura, três assinaturas de vertical, moldura de case, texturas, OG e favicon. `scripts/optimize-art.mjs` recorta o fundo, redimensiona e converte para WebP; os originais ficam em `assets-source/` |
| Hero | **Feito.** `LivingHero.jsx` — sedimentação de partículas em Canvas 2D, procedural, sem imagem externa. Pausa fora da viewport, respeita `prefers-reduced-motion` com quadro estático, teto de partículas por área de tela |
| Mídia dos cases | **Parcial.** Queijos Santana, Roda de Agronegócios e Paulo Henrique têm print e vídeo reais (`public/work/`, via `scripts/optimize-work.mjs`). Os cinco cases antigos ainda usam a moldura |
| Contraste | **Auditado.** 336 medições em 7 páginas × 6 posições de scroll, todas passando em WCAG AA. **O cobre reprova como texto pequeno** (4,49:1 sobre osso) — é traço e marca, nunca rótulo ou número. A rampa tem faixa cega entre 0,45 e 0,80: seções só descansam em ≤0,35 ou ≥0,85. Regras medidas e documentadas em `tokens.css` |
| Lançamento | **Feito.** `robots.txt`, `sitemap.xml` (gerado no build, nunca desatualiza), `manifest.json`, canonical por rota, OG card |
| Favicon | **Feito.** Era o logo do Base44; agora é o M sólido da marca |
| Coreografia de scroll | **Feito.** `src/styles/motion.css` — animações dirigidas pelo scroll em CSS nativo (`animation-timeline: view()`), no thread do compositor. Entrada em etapas, hero que recua ao sair, mídia de case que assenta, barra de progresso |
| Transição entre páginas | **Feito.** View Transitions API via `TransitionLink.jsx`. Nav e rodapé nomeados ficam parados; o conteúdo afunda e emerge. Degrada para navegação normal sem suporte |
| Hospedagem da logo | **Pendente.** Aponta para outro app Base44 — ver abaixo |

**Páginas em `src/pages/`:** `Home` (resumo), `Work` (índice),
`WorkCase` (Problema → Processo → Decisões → Resultado), `HowIWork`
(as quatro camadas + o bloco sobre IA), `About`, `Contact`. O shell
comum é `components/layout/SiteLayout.jsx` (nav + rodapé + `hreflang`).

**Título por página:** cada página chama `usePageTitle`. O `<title>`
não pode ser definido no `SiteLayout` — efeito de filho roda antes de
efeito de pai, então o layout sobrescreveria o da página.

**Código morto acumulado** — presente no repo, importado por ninguém:
`LiquidMarkHero.jsx`, `ScrollScrubHero.jsx`, `heroFrames.js`,
`lib/hero-frames.js`, `BrandAssembly.jsx`, `TopBar.jsx` (substituído
por `layout/SiteNav.jsx`) e as seções PT antigas `sections/Tese.jsx`,
`OndeDoi.jsx`, `Frentes.jsx`, `Trabalhos.jsx`, `ComoFunciona.jsx`,
`Sobre.jsx`, `Hero.jsx`. **Atenção antes de apagar as seções:** a copy
de `Frentes` (4 frentes de serviço) e de `ComoFunciona` (4 passos) NÃO
foi portada para `copy.js` — apagar perde esse texto. A dependência
`@paper-design/shaders-react` continua no `package.json` mesmo com o
shader morto. A entidade `base44/entities/Contato.jsonc` continua de pé:
o formulário saiu, mas apagar a entidade destruiria os contatos já
recebidos.

**A dependência externa da logo foi RESOLVIDA.** Os assets vieram para
`assets-source/` e são servidos de `public/`, no próprio domínio — o que
libera qualquer efeito futuro que precise ler pixels. O texto abaixo fica
como registro do que era o problema.

**Era assim:** Não é um PNG
solto: são o M translúcido *e* 26+ quadros da sequência antiga, todos em
`base44.app/api/apps/69d13abf1923f13a0fcdbf60/...` — um app Base44
diferente deste site. É exatamente a causa do erro de CORS do item 2 do
histórico técnico. Resolver isso (trazer os assets para dentro do repo)
é pré-requisito de qualquer efeito novo que leia pixels.

**Já instalado e disponível:** `gsap` + `@gsap/react`, `lenis`, `three`,
`framer-motion`, `react-router-dom`, `@tanstack/react-query`, shadcn/ui
completo em `src/components/ui/`. Não precisa instalar esses de novo.

## Mudanças de decisão MAIS RECENTES (sobrepõem o documento de copy anterior)

- **SEM formulário de contato, em lugar nenhum do site.** Removido por
  decisão do cliente, e já removido do código.
- **CTA de contato = sempre um link direto**, nunca campo para
  preencher:
  - Versão PT: link direto para WhatsApp
  - Versão EN (internacional): Calendly (`calendly.com/edumirandamf`)
    ou método equivalente de agendamento — não WhatsApp como primário
- **Diagnóstico interativo no lugar do formulário como ferramenta de
  engajamento:** "Raio-X de Sistema" — 5–7 perguntas sobre a operação
  do visitante, resposta visual em camadas de estrato preenchendo,
  score final com CTA de agendar conversa. Ver a seção correspondente
  em `research/RESEARCH.md` para detalhamento completo.
- **Cada aba deve funcionar como experiência independente e completa**,
  não apenas uma continuação visual da Home.

## Idioma

Bilíngue EN (padrão)/PT, sem trava por IP — decisão por
`navigator.language` + toggle manual persistido em `localStorage`. Não
usar geolocalização por IP (quebra para VPN/viagem e prejudica SEO).
Rotas reais `/en` e `/pt` (não hash) para indexação correta com
`hreflang`.

## Stack técnico

React + Vite. Preferir CSS nativo e View Transitions API/scroll-driven
animations onde suficiente (leve, sem dependência); reservar
GSAP+ScrollTrigger para coreografia de scroll complexa; WebGL/R3F só
para os elementos vivos que exigem (partículas, reaction-diffusion).
Lenis para smooth scroll, se mantido — sincronizar em um único
`requestAnimationFrame`/`gsap.ticker`, nunca dois loops concorrentes.

## Documentos deste repositório (ler antes de codar)

- `DECISIONS.md` — estado final de cada decisão, em tabela. Se conflitar
  com qualquer outro documento, **DECISIONS.md vence**.
- `RECAP.md` — a história completa: todo caminho tentado e por que foi
  abandonado. Consultar antes de propor qualquer direção visual, para
  não ressuscitar algo já rejeitado.
- `ASSETS.md` — links, contatos, apps Base44, hospedagem das imagens.
  *(ainda não commitado)*
- `arquitetura-copy-final.md` — copy completo por página e seção. Ver as
  ressalvas de "mudanças mais recentes" acima, que sobrepõem partes dele
  — especialmente a seção de Contact, que ainda tinha formulário.
  *(ainda não commitado)*
- `research/RESEARCH.md` — as sete pesquisas técnicas condensadas ao que
  é acionável. **Aviso: a pesquisa de semiótica sobre "o que o leigo
  entende" não vale mais** — foi feita quando o público era PME local, e
  o público mudou para mercado internacional. Não aplicar.
  *(ainda não commitado)*

Para convenções de Base44/CLI, workflow de `base44 dev` e publicação,
ver `AGENTS.md` e `README.md`.

## Como trabalhar comigo (Eduardo)

- Já tivemos uma sessão longa e cansativa tentando resolver a hero por
  tentativa e erro. Não repita esse padrão — teste hipóteses técnicas
  (CORS, performance, compatibilidade) ANTES de apresentar como pronto.
- Prefiro ver algo funcionando de verdade a uma descrição bonita do que
  vai funcionar.
- Seja direto sobre trade-offs e riscos técnicos antes de implementar,
  não depois.
