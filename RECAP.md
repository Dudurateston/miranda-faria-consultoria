# RECAP — Miranda Faria, do zero até a passagem para o Claude Code

Recapitulação narrativa de toda a sessão. Serve para qualquer pessoa
(ou IA) entender COMO chegamos nas decisões finais, não só QUAIS são
elas. Para o estado final puro, ver `CLAUDE.md` e `DECISIONS.md`.

---

## Fase 0 — Quem é quem, e organização do negócio

Eduardo Miranda Faria é o prestador de serviço (agência solo,
ex-U.AI). Dois clientes distintos precisam ficar sempre claros:

- **Eduardo (cliente)** — dono da 1000 Peças Truck Center e da
  ROTAFORT. Homônimo do prestador, pessoa diferente.
- **Livio** — dono da MotorMoura, catálogo B2B de autopeças em Base44.

Sessão começou organizando prioridades (P0: entrega do Eduardo-cliente
+ marca própria; P2: MotorMoura) e um hub de operação no Notion
(páginas de cliente, banco de Entregas, calendário).

---

## Fase 1 — Nascimento da marca "Miranda Faria"

A U.AI foi retirada — sócio saiu, nome não podia mais ser usado.
Decisão de ir por **marca pessoal** em vez de nome inventado (evita
repetir o risco de "nome preso a sociedade que pode acabar").

Testado e descartado antes de fechar: Lume, Cerne, Prumo (todos
ocupados por outras empresas de mesmo ramo). Fechado: **Miranda
Faria — Consultoria & Tecnologia**, assinado pelo sobrenome duplo
(resolve também a ambiguidade com o cliente Eduardo).

**Identidade visual v1 (fechada e nunca mudou depois):**
- Grafite `#1A1A18`, branco-osso `#F5F1EA`, cobre queimado `#B5502E`
  (destaque único, escolhido após pesquisa que descartou roxo por ser
  clichê visual de IA em 2026), cinza-pedra `#8A8578`
- Playfair Display (títulos) + Inter (corpo) + JetBrains Mono (labels)

**A saga do logotipo — muitas direções testadas:**
1. Coluna grega estilizada → descartada (clichê de banco/advocacia)
2. Letra "M" com linhas de blueprint arquitetônico → base do conceito
3. Oito direções alternativas geradas no Lovart (carta celeste,
   junta/encaixe, prumo, alicerce, arco, ponto de origem...) — pesquisa
   de cor e semiótica feita antes de fechar
4. **M de planos geométricos translúcidos sobrepostos** — a direção
   vencedora, ainda hoje a logo principal
5. Variante "M sólido" (geométrico, chapado) — para usos pequenos
   (favicon, ícone)
6. Tentativa de reformular como "corte geológico em estratos" —
   REJEITADA pelo cliente ("não gostei dessa logo")
7. Voltou-se ao M de planos translúcidos como definitivo

**Sub-marca "Cunho"** (linha de design/IA) foi proposta e depois
abandonada quando o site pivotou para não ter sub-marcas separadas.

---

## Fase 2 — Auditoria do portfólio existente (Base44)

Levantamento de 28 apps na conta Base44 do cliente. Identificado
padrão de especialidade não percebido antes: autopeças, pneus,
transporte (MotorMoura, 1000 Peças, Forte Pneus, Rota Forte).

**Cases selecionados para o site (rank A do cliente):**
MotorMoura, HUB de Vendas, DJ Jotavê, 1000 Peças + ROTAFORT (Eduardo
cliente). Depois consolidado para: MotorMoura, 1000 Peças, Rota Forte
Logística, DJ Jotavê, **+ o próprio site como 5º case**.

Decisão de segurança: **nunca linkar direto para os apps Base44** dos
clientes (URLs feias, projetos incompletos) — sempre print/vídeo.

---

## Fase 3 — Primeira versão do site (Base44) — ficou vazia demais

Primeiro brief de site foi escrito como lista de **proibições** ("sem
sombra, sem gradiente...") em vez de decisões positivas. Resultado:
Base44 obedeceu literalmente e entregou algo genérico e vazio.

**Correção:** brief reescrito estudando o código real de outro projeto
do cliente (site do DJ Jotavê) que já usava Lenis + GSAP +
ScrollTrigger bem. Dali saiu o sistema de:
- Tokens de design com escala tipográfica fluida (`clamp()`)
- `ValueBackground` (fundo que interpola cor conforme scroll)
- Cursor de cobre customizado
- Ticker de setores, réguas que se desenham (`MfRule`)

---

## Fase 4 — A saga da Hero (a parte mais longa e mais cara da sessão)

Sequência completa de tentativas, cada uma resolvendo um problema e
criando outro:

1. **Sequência de 65 quadros JPEG** extraídos de um vídeo gerado no
   Lovart, com scroll-scrub em `<canvas>`. Funcionou tecnicamente
   (após corrigir loops de rAF concorrentes entre Lenis/GSAP/lerp
   manual), mas ficou **pixelada** (quadros de 1000px ampliados em
   telas grandes) e **travada** (decode síncrono de 65 imagens).
   Pesquisa técnica trouxe soluções (ImageBitmap, resolução maior,
   WebP, dwell no final) mas a raiz do problema — depender de imagem
   raster em sequência — nunca foi resolvida de verdade.
2. Tentativa de hospedar os quadros: passou por Google Drive (não
   serve imagem crua), depois por upload direto no Base44 com hashes
   de nome imprevisíveis, exigindo manifest de URLs.
3. **Redesenho manual em SVG vetorial** (6 polígonos) — tecnicamente
   perfeito (leve, nítido, sem dependência), mas o cliente rejeitou:
   "não é nem próximo do original". A vetorização automática do PNG
   original também falhou (perdeu toda a transparência, virou ~260
   formas opacas chapadas).
4. **Revelação por máscara** sobre a imagem PNG original — funcionou,
   ficou fiel à arte, mas o cliente achou "sem graça, pouco
   impactante".
5. **Shader de metal líquido** (`@paper-design/shaders-react`,
   `LiquidMetal`) usando a logo como máscara — a ideia certa
   conceitualmente, mas quebrou: o shader precisa ler pixels via
   canvas (`crossOrigin="anonymous"`), e a imagem estava hospedada num
   **app Base44 diferente** do app do site, sem CORS liberado.
   Resultado visível: "um quadrado de metal líquido, mais nada" — o
   shader caiu no fallback sem máscara.
6. Nesse ponto, decisão de **pausar tentativas de código direto** e
   duas coisas em paralelo: (a) reverter a hero para a versão estável
   (máscara) para o site não ficar quebrado, e (b) escrever um brief
   consolidado para levar a exploração visual ao **Claude Design**.
7. Antes de migrar, foram exploradas mais direções conceituais em
   texto e protótipos interativos no chat (tipografia cinética, grid
   suíço, estratos com parallax, cartões 3D com tilt, paralaxe
   magnético) — a família de **estratos + paralaxe magnético + cards
   3D** foi validada com demos funcionais.
8. Cliente então pediu algo com **"vida própria"** — motion autônomo,
   não apenas reativo a mouse/scroll. Isso gerou a pesquisa mais
   recente (ver `research/RESEARCH.md`), que
   trouxe a direção de **sistemas generativos vivos** (partículas,
   reaction-diffusion, flow fields) como resposta correta — ainda não
   implementada.

**Lição central, documentada no CLAUDE.md:** qualquer efeito que
precise LER pixels de uma imagem (shader, canvas, getImageData) exige
a imagem no MESMO domínio do app, com CORS correto — ou não depender
de imagem externa, gerando a forma proceduralmente.

---

## Fase 5 — Pivô estratégico: de PME local para mercado internacional

Ponto de virada na sessão. Até aqui, todo o site (copy, pesquisa de
UX, escolha de divisor de seção) tinha sido pensado para **PME do
interior de Minas Gerais** (dono de oficina, autopeças, agro) como
público-alvo, incluindo uma pesquisa extensa de semiótica que
descartou o motivo "estalactite/estalagmite" como divisor por risco de
leitura como ameaça a esse público leigo.

O cliente então corrigiu: quer vender **para fora do Brasil**, usar o
site como **portfólio de candidatura a vagas/projetos internacionais**
em inglês. Isso invalidou parte do raciocínio anterior (o "teste do
leigo em 5 segundos" não se aplica a recrutador/cliente sofisticado) e
disparou nova pesquisa de posicionamento.

**Resultado:** título profissional **"Design Engineer & Creative
Technologist"**, com o argumento de fuso horário (UTC-3, sobreposição
com EUA) como vantagem nearshore, e o enquadramento de "IA como
alavanca dirigida por julgamento" (não atalho) para não soar como
raso perante mercado internacional cético.

---

## Fase 6 — Arquitetura, idioma e conteúdo

- **Bilíngue sem trava por IP** — decisão técnica: `navigator.language`
  decide o padrão, toggle sempre visível, escolha persistida em
  `localStorage`, rotas reais `/en` e `/pt` (não hash) para SEO.
  `LanguageProvider.jsx` já escrito.
- **Estrutura de páginas** oscilou entre multipágina completa (Design/
  Sistemas/Gestão separados) → simplificada para scroll único (baseado
  em referências tipo rauno.me) → **corrigida de novo pelo cliente**
  para "site de verdade", não landing page: Home-resumo + abas
  profundas independentes.
- **Copy completo** escrito seção por seção em `arquitetura-copy-final.md`
  — mas esse documento já está PARCIALMENTE desatualizado pela
  decisão seguinte.
- **Formulário de contato removido por completo.** CTA de contato é
  sempre link direto: WhatsApp na versão PT, Calendly
  (`calendly.com/edumirandamf`) ou equivalente na versão EN. Isso
  contradiz a seção de Contact do documento de copy anterior, que
  ainda tinha formulário — precisa correção.
- **Diagnóstico interativo** ("Raio-X de Sistema") proposto para
  substituir formulário como ferramenta de engajamento e geração de
  lead qualificado — ainda não implementado, detalhado na pesquisa
  mais recente.

---

## Fase 7 — Elementos de design testados e validados via demo interativa

Ao longo da sessão, vários conceitos foram prototipados como widgets
interativos no chat antes de qualquer código ir para produção:

- **Estratos animados** (faixas horizontais escalonadas, cada uma com
  atraso e tom diferente) — aprovado, virou base do `MfRule.jsx`
- **Paralaxe magnético** (imagem inteira segue o cursor, sem separar
  camadas — evita o problema de CORS) — aprovado
- **Cartões em camada 3D** (tilt ao mouse) — aprovado como sistema
  para grade de serviços/cases
- **Farol de cobre pulsante** — aprovado, mas **restrito a um único
  lugar** (rodapé), não espalhado
- **Relógio de fuso ao vivo** — proposto, **rejeitado** pelo cliente
  ("não seria tão interessante assim")
- **Máquina de escrever + blueprint** — avaliado e descartado como
  hero principal (clichê de portfólio de dev, tela escura contraria a
  identidade clara); o conceito de "linhas de blueprint se desenhando"
  pode voltar como detalhe pontual, não como abertura inteira

Depois desses, o cliente pediu explicitamente **elementos vivos e
autônomos** (que se movem sozinhos, não reagem a input) — isso ainda
não foi prototipado em código, só pesquisado.

---

## Fase 8 — Decisão de mudar para Claude Code

Depois de um dia inteiro de iteração — boa parte dele gasto
resolvendo problemas técnicos de hospedagem/CORS dentro do ambiente
Base44 (incluindo um bug de ambiente onde `npm install` falhava por
`cwd` incorreto) — o cliente decidiu migrar a implementação para
Claude Code, que trabalha em repositório de código real em vez do
editor do Base44.

Documentos preparados para essa transição: `CLAUDE.md` (contexto
persistente), este `RECAP.md`, `DECISIONS.md`, `ASSETS.md`, e a pasta
`research/` com as pesquisas técnicas condensadas.

**Nota de arquitetura:** Claude Code não acessa o editor do Base44
diretamente — ele trabalha em arquivos locais via git. Duas rotas
possíveis: exportar o código atual do Base44 para GitHub (se o plano
permitir) e clonar localmente, ou começar um repositório novo e
migrar/publicar depois. Não foi decidido qual das duas — fica como
primeira decisão a tomar na nova sessão.

---

## O que NÃO foi resolvido até o fim desta sessão

- Hero final ainda não está implementada (revertida para versão
  estável de máscara enquanto a exploração visual acontece em outro
  lugar)
- Elementos vivos/autônomos (partículas, reaction-diffusion) — só
  pesquisados, não codados
- Diagnóstico interativo "Raio-X de Sistema" — só conceituado
- Foto real do Eduardo para a seção About — não existe ainda
- Métricas reais de cada case (MotorMoura, 1000 Peças, Rota Forte,
  DJ Jotavê) — placeholders no documento de copy
- E-mail definitivo do domínio, link do LinkedIn/CV confirmados
- Onde a imagem da logo vai morar definitivamente (hoje depende de um
  app Base44 diferente do app do site — dependência frágil)
- Domínio próprio registrado e publicação final
