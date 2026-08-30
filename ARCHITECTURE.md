# ARCHITECTURE — o site Miranda Faria

Documento de arquitetura e estratégia. Escrito antes da construção, para
a construção ter critério. Se conflitar com `DECISIONS.md`, DECISIONS
vence — este documento explica o *porquê* e o *como*, não redecide o
*quê*.

---

## 0. A restrição que define tudo o resto

Apple e Samsung constroem seus sites em cima de **fotografia de produto
de classe mundial**. Tire a imagem do apple.com e sobra uma página de
texto centralizado. Oitenta por cento do impacto daqueles sites é mídia
que custou muito dinheiro para existir.

Hoje nós temos **zero mídia**. As molduras vazias nas páginas de case do
build atual são a prova literal disso.

Isso não é um detalhe de produção — é a restrição arquitetural central.
Ela determina que o impacto deste site **não pode vir de fotografia**.
Tem que vir de três coisas:

1. **Tipografia** em escala e com espaço para respirar
2. **Movimento** — coreografia de scroll e elementos autônomos
3. **Geometria gerada** — o motivo de estratos, proceduralmente

Isso não é consolo. É exatamente o que a identidade editorial e
arquitetônica já pedia, e é o único caminho honesto enquanto não houver
imagem. Uma moldura vazia prometendo foto é pior do que uma página que
nunca prometeu foto.

**Consequência prática:** ou produzimos a mídia (ver §8), ou o design
para de reservar espaço para ela. Não existe terceira opção que não seja
publicar um site com buracos.

---

## 1. O produto

**O produto não é um site. É prova de capacidade.**

O site é o quinto case do portfólio e o único que o visitante
*experimenta* em vez de ler. Se ele for bom, a afirmação central — "faço
marca, produto e dados como uma coisa só" — está provada antes do
primeiro parágrafo. Se for genérico, nenhum texto resgata.

Daí sai o critério de decisão para todas as escolhas seguintes:

> Cada elemento ou aumenta a evidência de capacidade, ou é ruído.

---

## 2. Quem somos — e o risco do posicionamento

**Design Engineer & Creative Technologist.** Uma pessoa cobrindo marca,
produto e dados, com IA como alavanca dirigida por julgamento.

**O risco:** em 2026, "solo + IA" carrega uma leitura negativa
disponível — barato, genérico, feito por máquina. O mercado internacional
está saturado de portfólio gerado por IA. A afirmação precisa de
antídoto, e o antídoto **não é texto**. Ninguém acredita em quem escreve
"uso IA com critério"; acredita em quem demonstra critério.

Antídotos que funcionam:

- **Especificidade em vez de adjetivo.** "O modelo permite um produto
  carregar várias marcas e aplicações, que é como o negócio de peça
  funciona" prova mais que "sistema robusto e escalável".
- **Mostrar as decisões, incluindo as descartadas.** Portfólio que mostra
  o caminho abandonado sinaliza julgamento. Portfólio que só mostra o
  resultado final sinaliza sorte. O `RECAP.md` deste repositório é, em si,
  material de portfólio.
- **O próprio site rodando bem.** Performance é sinal caro e não
  falsificável. Um site de design engineer que engasga se auto-refuta.

---

## 3. As duas audiências

O site atende dois públicos com trabalhos mentais diferentes. Ignorar
essa diferença produz um site que não serve nenhum dos dois.

### Recrutador / hiring manager
- **Tempo:** 30 a 60 segundos, escaneando.
- **Trabalho mental:** descartar rápido. Está procurando motivo para dizer não.
- **Quer:** evidência, tecnologias nomeadas, escopo real do que a pessoa fez sozinha.
- **Odeia:** adjetivo sem prova, ter que caçar informação, portfólio que esconde o "o quê" atrás do "como me sinto".

### Cliente internacional de projeto remoto
- **Tempo:** mais, mas com mais ceticismo.
- **Trabalho mental:** avaliação de risco. Está tentando não errar na contratação.
- **Quer:** já resolveu um problema como o meu? o que acontece se ele sumir? como é trabalhar com ele?
- **Odeia:** opacidade de processo, promessa sem mecanismo.

**O que compartilham:** pouco tempo, ceticismo alto, e a mesma primeira
pergunta silenciosa — *isso é real?*

### Princípios de persuasão aplicáveis

- **Sinalização custosa.** O site precisa parecer caro porque é essa a
  prova. O meio é a mensagem, literalmente.
- **Especificidade vence superlativo.** Número concreto persuade mais
  que qualificador. Isso torna as métricas reais dos cases (§8) uma
  pendência de persuasão, não de completude.
- **Fluência de processamento.** O minimalismo da Apple funciona porque
  facilidade de leitura é *sentida* como qualidade. Menos elementos por
  tela produz percepção de mais qualidade — não só de mais elegância.
- **Efeito de isolamento (Von Restorff).** Um acento, usado raramente, é
  lembrado. Cobre espalhado vira ruído; cobre em três lugares vira
  assinatura. É por isso que o fundo cor de cobre estava errado.
- **Regra do pico e fim.** A abertura e a última tela carregam peso
  desproporcional na memória. Investir movimento e cuidado ali, não
  distribuído por igual.
- **Aversão à perda (para o cliente).** Enquadrar pelo que está quebrando
  hoje, não pelo que seria bonito ter. A copy PT já faz isso.

---

## 4. O que Apple e Samsung realmente fazem

Analisado para separar o que é replicável do que depende de orçamento
que não temos.

### Apple
- **Uma ideia por viewport.** Nunca duas. A tela inteira serve a uma frase.
- **Scroll como dispositivo narrativo,** não como rolagem. A página conta em etapas.
- **Movimento lento.** Durações longas, easing suave. Pressa parece barato.
- **Tipografia enorme** faz o trabalho pesado.
- **Nada compete por atenção.** O que não é o assunto, desaparece.

### Samsung
- **Campos de cor mais ousados,** mais densidade por tela.
- **Números e especificações mostrados com orgulho.**
- **Movimento mais agressivo,** mais simultaneidade.

### O que pegar
A **contenção da Apple** somada à **disposição da Samsung de mostrar
especificação**. Para portfólio técnico, esconder o número é perder o
argumento — o recrutador veio ver o número.

### O que não pegar
- A **dependência de fotografia** — não temos (§0).
- A **densidade da Samsung** — briga com a identidade editorial fechada.

---

## 5. Arquitetura de informação — o trabalho de cada página

Cada aba é uma experiência completa, não continuação visual da Home
(`DECISIONS.md`).

| Rota | Trabalho | Público primário |
|---|---|---|
| `/` | Responder em 40 segundos: quem, o quê, prova, próximo passo | Escaneador |
| `/systems` | Sites e sistemas no Base44 — a disciplina em profundidade | Cliente |
| `/design` | Design com Lovart e IA — como a marca nasce | Ambos |
| `/business` | Gestão, BI e IA para negócios | Cliente |
| `/work` | Evidência. Índice de **todos** os projetos, transversal às três verticais | Ambos |
| `/work/:slug` | Profundidade: Problema → Processo → **Decisões** → Resultado | Avaliador |
| `/how-i-work` | Redução de risco: as quatro camadas + o enquadramento da IA | Cliente |
| `/about` | Confiança: a pessoa por trás | Ambos |
| `/contact` | Conversão. Link direto, sem formulário | Ambos |

**As três verticais e o `/work` convivem.** Cada vertical aprofunda uma
disciplina e fecha com os cases dela, filtrados pelo campo `practice`;
o `/work` continua listando todos, para quem quer varrer rápido. As três
compartilham a mesma página (`src/pages/Practice.jsx`), dirigida pelo
slug — variam em conteúdo e assinatura visual, não em estrutura.

**A navegação tem seis itens** (Systems · Design · Business · Work ·
About · Contact) e é o limite. `/how-i-work` saiu do topo e vive no
rodapé — acrescentar um sétimo item quebra a nav no desktop e vira
faixa rolável longa demais no celular.

O bloco **Decisões** é o que separa isto de portfólio comum. É onde o
julgamento fica visível.

---

## 6. Sistema visual

Identidade fechada (`CLAUDE.md`), não redesenhar. O que este documento
define é *como aplicar*.

### Regra de cor
**Contraste por valor, não por saturação.** O cobre `#B5502E` é o único
acento e **nunca vira campo de fundo** — vive em texto de destaque,
traços finos e no ponteiro. O fundo se resolve no eixo neutro.

### A rampa de profundidade
A página desce continuamente da superfície à camada funda —
`--depth-top` → `--depth-bottom` em `tokens.css`.

**Recomendação para a ponta funda: `#2A2621`** — grafite quente. Preto
puro (`#1A1A18`) é frio e industrial; `#2A2621` tem marrom dentro, o que
o deixa sóbrio sem ficar duro, e faz o cobre-claro brilhar por cima.

Alternativas, se a recomendação não agradar:
- `#3B332A` — umbra profunda. Mais quente, mais terroso.
- `#4A4439` — pedra escura. Mais suave, menos contraste.

Trocar `--depth-bottom` muda a descida inteira do site num lugar só.

### O motivo dos estratos
Deve aparecer variando a implementação, nunca repetindo idêntico:

| Onde | Implementação | Estado |
|---|---|---|
| Fundo da página | Rampa contínua de valor | Feito |
| Divisor de seção | `MfRule` — faixas que se desenham | Feito |
| Conteúdo | As quatro camadas de `/how-i-work` | Feito |
| Assinatura de vertical | `ArtSlot` — estrato procedural em SVG, trocado pela arte quando ela carrega | Feito |
| Hero | Partículas sedimentando, procedural | A fazer |
| Transição de página | Campo de fluxo / Flip | A fazer |

---

## 7. Sistema de movimento — quatro níveis

Separar os níveis evita o erro de tratar tudo como "animação" e acabar
com efeito demais.

1. **Ambiente** — roda sozinho, não reage a nada. A rampa de fundo; a
   hero viva. É o que dá sensação de sistema vivo em vez de página.
2. **Entrada** — elementos aparecem ao entrar na viewport. `Reveal`,
   `LineReveal`, stagger. Já existe.
3. **Coreografia** — o scroll dirige a narrativa: pin, revelação em
   etapas, progressão. **É o que mais falta hoje.**
4. **Transição** — entre páginas, sem corte. `Flip` para elemento
   compartilhado entre `/work` e `/work/:slug`.

### Orçamento
- **Um** elemento pesado por página, nunca dois simultâneos.
- Pausar fora da viewport (`IntersectionObserver`).
- `prefers-reduced-motion` com fallback estático, sempre.
- Um único `requestAnimationFrame` — Lenis sincronizado no `gsap.ticker`,
  nunca dois loops concorrentes.

---

## 8. O que precisamos conseguir

### Bloqueante
- **Trazer os assets da logo para dentro do repositório.** Hoje o M
  translúcido e 26+ quadros vivem em `base44.app/api/apps/69d13abf…`,
  um app diferente deste site. Foi essa dependência que quebrou o shader
  por CORS. **Qualquer efeito que leia pixels depende disso.** O app
  sequer aparece na lista de apps da conta — se for apagado, a logo
  quebra em definitivo.

### Produzir
- **Capturas dos 5 sistemas:** screenshot em alta resolução + captura de
  tela em movimento (10–15s, sem áudio, sem cursor). Sem isso as páginas
  de case ficam com moldura vazia (§0).
- **Retrato do Eduardo.** Até existir, o fallback tipográfico "EMF".
- **Fontes auto-hospedadas.** Hoje dependem do Google Fonts — auto-hospedar
  remove um terceiro e melhora o LCP.

### Levantar
- **Métricas reais por case.** Hoje o campo `impact` tem resultado
  qualitativo, sem número. É pendência de *persuasão* (§3).
- URL real do LinkedIn; e-mail definitivo do domínio.
- Domínio próprio registrado.

### Técnico — já resolvido, não precisa pesquisar de novo
- **GSAP é 100% gratuito desde maio/2025** (Webflow adquiriu a GreenSock).
  `SplitText`, `ScrollSmoother`, `Flip`, `DrawSVG`, `MorphSVG` e
  `Observer` já estão instalados em `gsap@3.15`. O `LineReveal.jsx` feito
  à mão pode ser substituído pelo `SplitText` oficial.
- `three` instalado para a hero generativa.
- `lenis`, `framer-motion`, `@tanstack/react-query`, shadcn/ui completo.

### Pesquisar
- Orçamento de performance alvo (LCP, INP) e medição em dispositivo real.
- Referências de coreografia — sem copiar; a assinatura tem que ser própria.

---

## 9. Riscos

| Risco | Gravidade | Mitigação |
|---|---|---|
| **Falta de mídia** | Alta | §0 — ou produzir, ou parar de reservar espaço |
| **Ceticismo com IA** | Alta | Especificidade e artesanato visível (§2) |
| **Assets fora do domínio** | Alta | Trazer para o repo antes de qualquer efeito com pixels |
| **Orçamento de performance** | Média | Um elemento pesado por página; um único rAF |
| **Escopo infinito** | Média | Definir o mínimo publicável e publicar |

---

## 10. Sequência de execução

**Fase 0 — desbloquear.** Assets da logo para dentro do repositório.

**Fase 1 — coreografia.** Pin, revelação em etapas, transição entre
páginas com `Flip`. É o que mais muda a percepção de site caro, e a
estrutura de rotas já está pronta para receber.

**Fase 2 — hero viva.** Partículas procedurais formando o motivo de
estratos. Sem imagem externa, sem CORS.

**Fase 3 — mídia dos cases.** Depende de produzir as capturas.

**Fase 4 — publicação.** Métricas reais, domínio, fontes auto-hospedadas,
medição de performance.

---

## 11. O mínimo publicável

Para não cair no risco de escopo infinito, o site é publicável quando:

- As seis páginas existem nos dois idiomas — **feito**
- Nenhuma moldura vazia visível — depende da Fase 3, ou de remover as molduras
- Coreografia de scroll na Home e nas páginas de case — Fase 1
- Assets servidos do próprio domínio — Fase 0
- LCP abaixo de 2,5s em 4G simulado
- Contato funcionando nos dois idiomas — **feito**

Tudo além disso é melhoria, não bloqueio.
