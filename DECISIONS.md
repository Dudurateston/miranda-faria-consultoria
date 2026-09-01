# DECISIONS — Estado final de cada decisão

Referência rápida, sem narrativa. Para o "porquê" de cada uma, ver
`RECAP.md`. Se algo aqui conflitar com `arquitetura-copy-final.md`,
**este arquivo vence** — é o mais recente.

## Identidade

| Item | Decisão |
|---|---|
| Nome da marca | Miranda Faria |
| Nome completo do prestador | Eduardo Miranda Faria |
| Descritor | Design Engineer & Creative Technologist (EN) / Consultoria & Tecnologia (PT) |
| Cor grafite | `#1A1A18` |
| Cor branco-osso | `#F5F1EA` |
| Cor cobre (único acento) | `#B5502E` |
| Cor cinza-pedra | `#8A8578` |
| Fonte títulos | Playfair Display |
| Fonte corpo | Inter |
| Fonte labels | JetBrains Mono |
| Logo principal | M de planos translúcidos sobrepostos (imagem gerada por IA, ver `ASSETS.md`) |
| Logo secundária | M sólido/geométrico — só para favicon/ícone/avatar/tamanhos pequenos |
| Motivo visual central | Estratos/camadas geológicas (profundidade: superfície→sistema→dados→base) |

## Público e posicionamento

| Item | Decisão |
|---|---|
| Público-alvo | Clientes internacionais de projeto remoto + recrutadores/vagas no exterior |
| Público local (PT) | Secundário — WhatsApp como canal, não o foco principal |
| Idioma padrão do site | Inglês |
| Localização como argumento | Brasil (UTC-3) — sobreposição total com horário dos EUA, parcial com Europa |
| Enquadramento de uso de IA | Alavanca dirigida por julgamento humano — nunca "atalho" ou "feito por IA" como título |

## Arquitetura

| Item | Decisão |
|---|---|
| Modelo de site | Home-resumo + abas profundas independentes (NÃO scroll único, NÃO hub raso) |
| Rotas | `/`, `/work`, `/work/:slug`, `/how-i-work`, `/about`, `/contact` |
| Idioma técnico | `navigator.language` decide padrão; toggle manual; persistido em `localStorage`; SEM trava por IP |
| Rotas de idioma | `/en` e `/pt` reais (não hash), com `hreflang` |
| Formulário de contato | **REMOVIDO. Não existe em nenhuma página.** |
| CTA de contato PT | Link direto para WhatsApp |
| CTA de contato EN | Calendly (`calendly.com/edumirandamf`) ou equivalente de agendamento |
| Ferramenta de engajamento | "Raio-X de Sistema" — diagnóstico interativo (substitui formulário), ainda não implementado |
| Cases no site | MotorMoura, 1000 Peças, Rota Forte Logística, DJ Jotavê, + o próprio site como 5º case |
| Framework de case | Problem → Process → Decisions → Impact |
| Link externo em case | NUNCA — só print/vídeo, nunca link para o app Base44 do cliente |

## Decisoes da sessao de 01/09/2026 (sobrepoem tudo abaixo)

Esta sessao reverteu decisoes fechadas. Onde houver conflito com as
tabelas seguintes, **esta secao vence**.

| Item | Decisao |
|---|---|
| Fase `claude/redesign-identity-and-pages` | **REJEITADA pelo cliente, integralmente.** "Praticamente tudo": as informacoes, o excesso de abas, e nenhum efeito prendeu a atencao — os que havia atrapalharam. Nao reconstruir o testemunho de sondagem (`CoreSample`), o trilho na borda, as assinaturas por pagina (`PracticeSignature`, `HandoffDiagram`) nem o acordeao da home. O branch fica como registro do que nao funciona |
| Navegacao | **4 itens, nao 7.** As tres verticais (Systems/Design/Business) vivem num submenu sob "What I do" / "O que eu faco". Abre no clique, nunca so no hover — metade das visitas chega por toque |
| Interacao com mouse e toque | **QUERIDA, e isso reverte a regra anterior.** O que morreu foi o CLICHE — paralaxe magnetico e tilt 3D em hover — nao a interatividade. Elemento vivo agora deve ser autonomo **e** responder a ponteiro e dedo |
| O que "vivo" quer dizer | Algo que atravessa a tela de vez em quando, em intervalo aleatorio; video que comeca a tocar em determinado ponto; resposta a mouse e toque. Nao basta mover sozinho |
| Abertura da home | Abre com uma **pergunta** que gera curiosidade — e com a identidade na MESMA primeira tela. Nunca mais uma abertura que cobra scroll para dizer quem assina o site |
| Altura da abertura | Media 4,8 telas; agora 2,0. Teto: nunca passar de ~2 telas |
| Texto em opacidade parcial | **PROIBIDO em qualquer lugar.** O contraste medido le `color` calculada e nao enxerga `opacity` herdada: texto fantasma passa na auditoria e some para quem le. Texto ou esta inteiro na tela, ou saiu dela por transform. Verificado por `npm run verify` |
| Um sistema de animacao por elemento | GSAP e a animacao CSS dirigida por scroll estavam ambos animando os mesmos itens. Ficou so o CSS. O que ja esta na primeira tela nao anima |
| Plataforma na copy | **Nunca citar pelo nome.** Dizer "auxilio de IA", com a ressalva de que modelo, estados e casos de borda continuam decisao humana |
| Hierarquia de informacao | Perseguir o padrao "layer-cake" (o olho pula de titulo em titulo) em vez do padrao F, que e sintoma de pagina mal estruturada |

## Motion e elementos de design

| Item | Decisão |
|---|---|
| Direção atual | Elementos VIVOS e autônomos (movimento contínuo, sem depender de interação) — não apenas reativos a mouse/scroll |
| Rejeitado | Sequência de vídeo/imagem pesada; shader dependente de imagem externa sem CORS; relógio de fuso ao vivo; motivo de estalactite/estalagmite; máquina de escrever como hero principal |
| Aprovado (mas pode ser substituído pelos elementos vivos) | Estratos animados como divisor; paralaxe magnético (imagem inteira, não separada em camadas); cartões 3D com tilt |
| Farol de cobre pulsante | Mantido, mas restrito a UM único lugar (rodapé) — não espalhar |
| Regra de segurança de qualquer efeito novo | Nunca depender de imagem hospedada fora do domínio do próprio app; pausar fora da viewport; respeitar `prefers-reduced-motion`; 1 elemento pesado por página, não vários |

## Stack técnico

| Item | Decisão |
|---|---|
| Framework | React + Vite |
| Ambiente de implementação atual | Migrando de Base44 (editor no-code) para Claude Code (repositório local) |
| Scroll suave | Lenis (se mantido — sincronizar em loop único com GSAP, nunca dois rAF concorrentes) |
| Animação de scroll complexa | GSAP + ScrollTrigger |
| Animação simples/nativa | Preferir CSS/View Transitions API/scroll-driven animations onde suficiente |
| Elementos vivos (partículas, reaction-diffusion) | WebGL/Three.js/React Three Fiber, conforme necessário |

## Pendências reais (bloqueiam publicação final)

Ver lista completa e priorizada em `RECAP.md`, seção final. Resumo:
foto real, métricas reais dos 4 cases, e-mail definitivo do domínio,
LinkedIn/CV confirmados, hospedagem definitiva da imagem da logo
(dentro do próprio app, não em app externo), domínio registrado.
