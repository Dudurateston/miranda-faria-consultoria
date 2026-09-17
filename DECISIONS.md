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

## Decisões do brief de ajustes (16/09/2026) — sobrepõem itens acima onde conflitam

| Item | Decisão |
|---|---|
| Identidade — corte | Nível 2 REVISTO (16/09, veto do Eduardo): MUDANÇA DE COR NÃO — já tentado antes e ficou péssimo; paleta e rampa osso→escuro permanecem. Levers de identidade: TIPOGRAFIA (Space Grotesk substitui a didone nos títulos), motion (Etapa 4) e copy. Mono promovida a voz de conteúdo |
| Cores | Paleta-base (grafite/osso/cobre) MANTIDA; muda o tratamento. Troca total de paleta só se o site ainda ler errado após a Etapa 4 |
| Precificação | SAI do site (PT e EN). DECISIONS anterior de âncora R$ 1.000 revogada |
| Automação | Vira solução de peso, MAS sem alegação sem prova: prova inicial = normalização por IA do MotorMoura (demonstrável). Cases de WhatsApp/Instagram só quando houver demonstração coletada |
| Aba Tecnologia | Contador de FPS REMOVIDO (código e copy). Substituto: normalização por IA do MotorMoura ao vivo (opção A do Eduardo) — Etapa 4 |
| Links ao vivo | REABERTO: domínio próprio linka (decisão antiga "nunca" revogada). 4 sites aprovados no portão 8.4 + Instagram Roda Agro. Cases sem domínio próprio seguem só print/vídeo |
| Atribuição | Todo case ganha campo `papel`. 4 sites novos = "Projeto do escritório · com Thales Machado Souza"; resto = "Direção, design e desenvolvimento" |
| Números | 3 níveis rotulados (Resultado/Escopo/Operação). Nível 1 só Roda Agro — SÓ números e dados, sem prints de painel (decisão do Eduardo 16/09). Estudo MIT (21x) sai |
| E-mail | contato@mirandafaria.com.br → edumirandamf@gmail.com (ainda não há e-mail institucional) |
| Filtro /work | APROVADO: por setor e vertical, estado na URL, PT e EN |
| Foto no Sobre | ADIADA — fallback tipográfico é decisão de design, não buraco |
| x-default | /pt (público neutro do negócio é o Brasil) |
| © rodapé | © 2026 (atualizado na Etapa 2; revisar anualmente) |

## Rodada 16/09 (fim do dia) — Miranda Faria Copy

- **REVERSÃO (16/09)**: preços e métricas MIT/R\$ fora do /servicos e do FAQ — escopo define preço, sem tabela. Métrica "18 sistemas em produção" no lugar.
- **REVERSÃO (16/09)**: cases com domínio próprio voltam a ter LINK ao vivo (portão 8.4 de qualidade primeiro). Aprovados: MotorMoura, LCO, Sevalho, VAF. Uai Sô Travel reprovou no mobile (overflow 40px) → case com prints, sem link.
- DJ Jotavê removido DE NOVO (reintroduzido indevidamente pelo checkout de commit antigo).
- `role` (papel) em todos os 14 cases; projetos do escritório marcados "com Thales Machado Souza".
- Filtro por setor e solução no /work, estado na URL (?setor=&solucao=), aria-pressed, empty state.
- **HERO — A REDE VIVA (nova)**: sem vídeo, sem logo M, sem telemetria. Rede generativa: 4 nós-mãe (gestão/desenvolvimento/design/automação) + satélites (projetos), fios se desenham, pulsos de cobre correm como sinal. GSAP dirige a montagem (expo.out); anime.js revela o título letra a letra. Canvas 2D, IO pause, reduced-motion estático. Videos hero_loop*.mp4 removidos do pacote (-4,2MB).
- animejs@3.2.2 adicionado como dependência.

## Hero v3.1 (16/09 noite) — A Rede Viva 3D refinada

- Fios retos → **arcos curvos** (bezier sutilmente pra fora do centro).
- **Poeira de fundo** 260 pts (140 mobile) girando em contra-rotação — profundidade.
- **Fade por profundidade**: nós perto nítidos, longe esmaecem (opacidade por z em câmera).
- **Modo foco**: hover num nó acende os arcos conectados em cobre (0.55) e apaga o resto (0.05); nós vizinhos ficam, os outros esmaecem (0.14). Giro automático pausa durante hover/drag.
- **Fly-to**: clique faz a câmera mergulhar (baseZ→2.0, power3.in) antes de navegar.
- Glow aditivo: halos de sprite nos hubs de cobre + pulsos com blending aditivo.
- **Scroll reage**: câmera recua (z+1.3) e desce (y-0.8) conforme a hero sai da tela.
- netHint na copy PT/EN ("Arraste para girar · clique nos nós").

## Transições de página estilo spence (16/09 noite)

- **TransitionCurtain** (novo, LangShell): clique em link interno → cortina grafite sobre (scaleY power3.inOut, 0.45s) com M centrado e filete de cobre na borda → rota troca por baixo → cortina sai por baixo (expo.inOut). Back/forward ganha só a revelação. Reduced-motion: navegação seca. Scroll travado durante o cover, liberado no reveal.
- Nav: underline cobre que desliza da esquerda (scaleX expo) no hover; ativo fica cravado.
- Nav é oculto no topo POR DESIGN (aparece após scroll) — não é bug.

## Rodada v3.2 — hierarquia, intro, transições variadas, Automação integrada (16/09 noite II)

- **Hero**: hubs de serviços MAIORES (0.115), 12 satélites de cases MENORES (0.035, os 12 melhores cases), 5 octaedros wireframe discretos (não interativos, rotação lenta), respiração mais viva (±0.06). Posições determinísticas → sair/voltar da Home nunca perde posição (validado 3 ciclos).
- **Intro repaginada**: M nasce girando + nome letra a letra + filete de cobre + linha das 4 soluções (Gestão · Desenvolvimento · Design · Automação). ~2.3s, 1x/sessão.
- **Transições em 3 variantes que se alternam** (padrão fixo, não aleatório): 1. wipe COBRE sólido; 2. cortina grafite + filete cobre; 3. 6 colunas grafite escalonadas. M em todas.
- **Automação integrada à Home**: era a 4ª solução perdida (grid tinha só 3 cards). Agora 4º card com loop "sistemas blueprint construindo" do Drive + copy própria ("rotinas que rodam sozinhas...").
- **Numeração de seções 01–04** estilo spence (Sobre 01 · Serviços 02 · Tecnologia 03 · Insights 04).
- **Easter egg**: 3 cliques no M da hero (e menu mobile) abrem a animação do logo grande — mesmo comportamento do rodapé. M do nav fica de fora (clique ali = ir pra Home, sem ambiguidade).
- Drive 'identidade Miranda Faria/videos e gifs' mapeado: 22 vídeos/GIFs de marca prontos (coluna geológica, blueprint, lead veio cobre...).

## Rodada v3.3 — densificação estilo spence + mobile pra valer (16/09 noite III)

- **Serviços viram LINHAS estilo spence** (substituíram os 4 cards): scroll reveal em cascata, hover apaga as irmãs e ressalta a atual, preview em vídeo à direita (150px, opacity 0.35→0.9). 4 elementos DISTINTOS: Gestão=corte, Desenvolvimento=lead_veio_cobre (recodificado 4K HEVC→246MB? não: 246KB H264), Design=celeste, Automação=blueprint. CTA direto de WhatsApp embaixo (sem atrito).
- **Seção Trabalho (03) nova na Home**: 6 cases destaque (Rota Fort, 1000 Peças, MotorMoura, Uai Sô, Sevalho, VAF) em linhas editoriais com hover dim, "leia o caso" cobre. Numeração Home agora 01–05.
- **Submenu no nav (desktop)**: hover em "Serviços" abre painel com as 4 soluções (número cobre + nome didone + descrição), M gigante translúcido de marca d'água, entrada em cascata. Menu mobile ganha as 4 soluções numeradas.
- **Burger fixo no mobile**: movido pra fora do header — sempre visível no topo da Home (antes ficava preso à nav que só aparece após 72% da tela).
- **Vídeo "Hero design IA partículas cobre" do Eduardo (Drive, 4K HEVC) → CTA final**: recodificado 1080p H264 4.3MB, fundo mascarado radial (opacity 0.22 desktop / 0.13 mobile) atrás do M animado — mensagem nova: convite, não abertura.
- **Malha animada** de fundo na Home (2 grids diagonais, drift 46s, quase imperceptível) — sair do minimalismo seco sem sujar.
- **Métricas simétricas**: grid 3 colunas iguais com filetes.
- **Egg sem seleção de texto**: user-select none nos elementos interativos (3 cliques no M não selecionam mais nada).
- **Intro mobile**: wordmark 1.05rem/0.18em, role 8px, M 42px — cabe em 390px (136px medidos).
- **Sats 3D maiores no touch** (0.05 vs 0.035).
- **"Rota Forte"→"Rota Fort"** em 4 pontos da copy (regra da marca, sem E).
- hero_loop.mp4 antigo: recuperado do git mas NÃO usado (descansando; Eduardo liberou uso se fizer sentido).

## Rodada v3.4 — TEMA CLARO + separação Serviços/Trabalhos (16/09 noite IV)

- **O site virou CLARO**: osso (#F5F1EA) de fundo, tinta escura de texto, cobre de acento — como o sistema de tokens nasceu ([data-theme="dark"] removido da Home e hero; --mf-graphite/--mf-rule remapeados pra osso/hairline). Canvas 3D da hero: poeira, satélites e octaedros agora em tinta escura sobre osso; título da hero tinta (era osso-sobre-osso — bug de contraste que o Eduardo viu nos prints). Bookends escuros INTENCIONAIS: CTA final (partículas de cobre) + rodapé.
- **Contraste**: texto ghost agora rgba(26,26,24,0.72) sobre osso — WCAG ok.
- **Separação Services/Projects (padrão referência)**: nav agora tem Serviços E Trabalhos como entradas irmãs. Ambos com submenu de painel claro + MÍDIA VIVA que troca no hover: Serviços mostra os vídeos das 4 soluções; Trabalhos mostra os vídeos REAIS dos 4 cases (rota-forte, 1000-pecas, miranda-faria, queijos-serra). Legenda numerada em mono em cima do vídeo.
- **Menu mobile claro** (osso) com Trabalhos + 4 soluções numeradas com thumbs de vídeo.

## Rodada v3.5 — CICLOS DE QUALIDADE (16/09 noite V)

Ciclo 1 (auditoria WCAG + correções): CTA da hero estava sem fundo (osso-sobre-osso, invisível) → virou botão cobre sólido #B5502E. Links "Ver a solução/Ler o case" 4,49:1 → cobre-texto #A6481F (AA ✔). Bug CRÍTICO de deploy: `background:#141414)` com parêntese solto no rodapé invalidava o CSS → rodapé caiu pro osso com texto osso; corrigido. Label LGPD no banner → cobre-claro legível.
Ciclo 2 (personalidade spence-grade): TICKER entre Trabalho e Tecnologia — faixa mono com as 4 soluções separadas por M de cobre em Instrument Serif, rolagem infinita 26s (respeita reduced-motion). WORDMARK GIGANTE no rodapé — "MIRANDA FARIA." em display clamp(3.2rem,12.5vw,10.5rem), osso a 8% com ponto final em cobre-claro. Lições do ciclo: copy[lang].practices é objeto — usar PRACTICE_SLUGS+getPractice; Home.jsx não tinha lang no escopo (import useLang de @/lib/i18n).
Ciclo 3 (acabamento): barra de progresso de leitura — fio de cobre 2px fixo no topo (MfProgress, rAF, scaleX por scroll). M da nav ganhou hover vivo (scale 1.09 + rotate -6°, 450ms expo). Validação final: CTA cobre ✔, ticker animando ✔, progress scaleX dinâmico ✔, M hover ✔, rodapé escuro+wordmark ✔, EN/work/about vivos ✔, mobile 0 overflow ✔, 0 erros JS em tudo.

## Rodada v3.6 — CICLOS 4-6 (16/09 noite VI)

Ciclo 4 (micro-interações + fix de hover): hover do CTA da hero aplicava tint translúcido sobre o novo fundo sólido (texto osso sumiria no hover) → base terracota #A6481F (AA 5,23:1), hover #8F3E1F profundo com lift. Setas "Ver a solução / Ler o case" ganham slide translateX(6px) no hover da linha — bug corrigido no caminho: patch gerou `.srow__go` sem prefixo mf- (CSS morto, achado via debug de matched rules).
Ciclo 5 (varredura das páginas não auditadas no claro): case individual (/work/rota-forte) tinta-sobre-osso ✔, contato ✔, MobileWhatsAppBar auto-adaptado ✔, chips do filtro já tinham hover ✔, cards do /work já deslizam no hover com nome em cobre ✔, navegação "próximo case" no rodapé de cada case já existia (padrão spence) ✔.
Ciclo 6 (fechamento AA total): ticker pausa no hover. Auditoria WCAG completa (6 rotas, PT+EN): ÚNICA falha restante era o CTA 4,49:1 → corrigido. Resultado final: 0 falhas AA, 0 erros JS, 0 overflow em desktop+mobile, PT+EN.

## Rodada v3.7 — CICLOS 7-9 (16/09 noite VII)

Ciclo 7 (paridade de rotas): 13 cases × 2 idiomas testados um a um — todos vivos (o t=0 do rota-forte era cold-start do primeiro load, re-check ok). Form de contato aceitava submit VAZIO (nenhum campo required) → nome, e-mail e mensagem viraram obrigatórios com aria-required. Nota: 404 de rota digitada direto na URL é o 404 do hosting Base44 (não controlável); o PageNotFound estilizado cobre navegação interna.
Ciclo 8 (acessibilidade de interação): tab order correto (skip-link → nav brand → links, todos com :focus-visible). Reduced-motion CONFIRMADO no ticker (animationName none — atenção: animationPlayState reporta "running" mesmo sem animação, usar animationName pra validar).
Ciclo 9: ticker já é aria-hidden pra leitores de tela ✔. Tudo verde.

## Rodada v3.8 — CICLOS 10-11 (16/09 noite VIII)

Ciclo 10 (performance): cta_particles.mp4 (4,2MB) e automacao_loop.mp4 (2,2MB) eram baixados de cara na Home — AutoVideo não tinha gating, autoplay dispara download mesmo fora da tela. AutoVideo virou LAZY: src só entra quando o elemento se aproxima da viewport (IntersectionObserver rootMargin 300px, descarrega observer após). HomeCta e HomeSobre tinham <video> crus → convertidos. LCP desktop 2,3s ✔, 0 warnings de console ✔. Efeito: +6,4MB fora do load inicial; cta_particles carrega só ao rolar perto do CTA ✔.
Ciclo 11 (touch targets): regra do Eduardo (alvos ≥44px) estava violada em 12 elementos mobile: CTA "Começar um projeto" (h=20), links do rodapé (h=28) e botões do banner LGPD (h=26 — crítico). Min-height 44px + inline-flex aplicado em .mf-srows__direct a, .mf-foot__link, .mf-consent__* (lição: aplicar no ELEMENTO INTERATIVO, não no wrapper — o primeiro patch caiu no span pai e o link continuou 26px).
Final: 0 alvos <40px, 0 erros JS, 0 overflow desktop+mobile.

## Rodada v3.9 — CICLO 12-13 (16/09 noite IX)

Ciclo 12 (preload inteligente): AutoVideo ganhou prop preloadOffset (rootMargin configurável); o vídeo do CTA usa 1600px — dispara o download ~1,5 telas antes de chegar, confirmado com CTA a 900px da viewport ainda fora da tela. Zero espera perceptível ao rolar.
Ciclo 13 (varredura EN completa — 6 rotas): PT estava verde mas as rotas EN nunca tinham passado pela auditoria AA com o submenu aberto. Achados: (1) números do submenu nav (01-04) a 3,44 em 10px → tinta 0,66 agora ~4,6; (2) BUG REAL nos demos do /how-i-work: HUDs do MotionCurves/FrameTimeGraph ("easing · 0 libs", "measuring", "drag → load") a 1,06 — quase invisíveis. Causa: painel do demo é TINTA #16130f, o HUD herdou cor de texto clara-tema. Fix: HUD osso 85% (≈7,4:1). Lição: o scanner de contraste precisa tratar painéis escuros embutidos em páginas claras — eff() resolve o fundo, mas o texto tem que acompanhar.
Final: /pt e /en 100% verdes nas 6+4 rotas testadas, 0 erros, 0 overflow, preload confirmado.

## Rodada v3.10 — CICLO 14 (16/09 noite X) — NAVBAR COMPLETA

Denúncia do Eduardo: "NavBar funcionando toda errada e não está com todo o conteúdo". Diagnóstico confirmado em 2 frentes: (1) dropdown Trabalhos hardcoded em 4 slugs (rota-forte/1000-pecas/miranda-faria/queijos-serra) — 10 dos 14 cases invisíveis; (2) menu mobile sem o link Sobre e sem NENHUM case listado. Fix: projects = cases[lang] (portfólio completo nos 2 idiomas); dropdown com coluna compacta (max-height 62vh + scroll fino — em 1440 cabe sem rolar, painel 511px dentro da viewport); mídia com fallback — cases com video.mp4 mostram vídeo (6), os outros 8 mostram 01.webp (campo media.video da copy decide); menu mobile ganhou Sobre + grid 2 colunas com os 14 cases (nome + ano, alvos 44px, coluna única ≤560px). Strip de rótulos do topo mobile com h:0 era display:none por design (burger-only) — falso alarme. Nav desktop: geometria e hovers verificados item a item (Sobre x:404... Contato x:1261, todos dentro da viewport).

## Rodada v3.11 — CICLO 15 (16/09 noite XI) — NAV COM 5 SUBMENUS + PONTE DE HOVER

Pedido do Eduardo: submenus com resumo e mídia TAMBÉM nos itens que não tinham (Sobre, Tecnologia, Diagnóstico) e deixar o mouse entrar no painel sem ele fechar. Fix duplo: (1) extras = 3 novos drops com 2 rows de resumo cada (Sobre: quem faz/trajetória; Tecnologia: método/MotionCurves; Diagnóstico: 40s/para quem — PT e EN) + mídia no painel (lead_loop/corte/celeste) — TODOS os 5 itens da nav agora abrem submenu com contexto; Tecnologia e Diagnóstico ancoram o painel à direita (não vaza em 1024px, verificado item a item); (2) BUG da zona morta: o painel ficava a 10px do rótulo e atravessar o vão com o mouse fechava o dropdown — ponte .mf-nav__drop::after de 12px elimina o vão; testado com mouse REAL (steps=8) descendo do rótulo ao centro do painel nos 5 drops: todos continuam abertos. EN ok (conteúdo por idioma), mobile intacto (24 itens, 0 ov, 0 erros).

## Rodada v3.12 — CICLO 16 (17/09 manhã) — HERO Y + SCROLL + POOL DE VÍDEOS + CASES

Quatro frentes (sub-agentes + trabalho direto), tudo validado com Playwright:
1. HERO EIXO Y: sensibilidade vertical era 33% menor que a horizontal (0.00028 vs 0.00042) e o clamp assimétrico acumulava velocidade na parede ("sticky wall") — igualada a 0.00042, clamp simétrico ±0.6 rad com vel.x=0 no limite. HUD de affordance no desktop (canto inferior direito, chip osso/cobre, JetBrains mono): aparece após 2s parado, some no primeiro mousemove; PT "passe o mouse · arraste os nós" / EN "hover · drag the nodes". Resposta medida: drag Y 5585 vs X 7187 (mesma ordem, antes era muito menor).
2. SCROLL DO SUBMENU TRABALHOS: Lenis (SmoothScroll.jsx) sequestrava o wheel global — a lista não rolava e a página rolava por trás. Fix: data-lenis-prevent nos 3 painéis + overscroll-behavior:contain + scrollbar webkit 6px. Medido: scrollTop 0→463 (fim da lista), window.scrollY 0→0, painel aberto.
3. POOL DE VÍDEOS COM LIMITE: inventário revelou corte.mp4 6x, celeste 5x, lead_loop 4x, automacao 3x. Registro NAV_MEDIA + VIDEO_USE_LIMIT em src/lib/site.js; linter scripts/check-video-usage.mjs embutido no prebuild (aborta deploy se estourar). 7 vídeos NOVOS produzidos de fontes 4K inéditas do Drive (recortes 960x540, 138-365KB) e subidos na pasta do Drive como "Nova navbar nv_*.mp4": nv_sistemas (Gestão), nv_placa (Desenvolvimento), nv_design (Design), nv_autom (Automação), nv_sobre (Sobre), nv_tech (Tecnologia), nv_diag (Diagnóstico). NavBar 100% exclusiva por slot; cards da HomeServicos usam os mesmos nv_* (2 usos, dentro do limite); corte fica só HowIWork+Servicos (2), celeste só HomeInsights (1).
4. CASES DE DESIGN + LIMPEZA: motormoura-marca 01 (vertical, decepada) → hero_institucional 16:9; 1000-pecas-marca 01+03 (quadradas, 44% decepadas) → mp_fachada_premium + mp_versao7 em 16:9; roda-agro-marca ganhou 3º shot (wa6, shots 2→3 na copy PT+EN); 4 capturas mobile (uaiso/lco/sevalho/vaf) reenquadradas em moldura 16:9 sobre fundo osso; miranda-faria 05 (panoramic 1600x408) em canvas 16:9. Removidos 24 PNGs legados (~11MB). Tudo 1600x900 webp + @800.

## Rodada v3.13 — CICLO 17 (17/09) — RELOCATION DE VÍDEOS + PERFORMANCE 10x

1. CARDS DA HOME VOLTAM AOS VÍDEOS ORIGINAIS (pedido do Eduardo): gestao=corte, dev=lead_loop, design=celeste, automacao=automacao_loop. Os nv_* reocupam lugares temáticos: HowIWork→nv_tech (dolly 3D), Servicos faixa→nv_sistemas (camadas), HomeInsights→nv_diag (gráficos), About faixa→nv_placa (placa da marca). SECTION_MEDIA em site.js centraliza esses usos; limites atualizados (antigos 1 uso, nv_* 1-2).
2. PERFORMANCE HOME: 5.48MB → 0.55MB de load inicial (10x). (a) NavBar só baixa vídeo quando o painel abre (src condicional em extras/serviços/trabalhos; painel fechado = 0 bytes — antes baixava ~1.9MB em toda visita); (b) reel "quem somos" do Supabase (3.26MB remoto) → art/sobre_reel.mp4 LOCAL 179KB (18x, segmento diferente do nv_sobre pra não repetir imagem); (c) cta_particles 4.25MB→1.28MB (960x540 CRF27); (d) m-logo-hero.webp 292KB→34KB (LCP mobile). NOTA: nav oculta na primeira tela da home é BY DESIGN (revealAfterHero, aparece ao rolar 72% da viewport) — não é bug.
3. VALIDADO: hovers abrem painéis e cada um baixa só o seu nv_* exclusivo; nv_diag carrega na seção insights; cards com vídeos antigos; /servicos nv_sistemas, /about nv_placa, /how-i-work nv_tech; 0 erros JS; lint de vídeos verde no prebuild.
