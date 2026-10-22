# WIP_STATE — Miranda Faria (atualizado 21/10 ~18h40)

## PUBLICADO (oficial 6a74f6e6fbaa381e21a241b, mirandafaria.com.br + mirandafaria.base44.app)

- **Hash: b4ec513b3f09e7df0fb22bd58d7af4838a9f7d03** (branch fix/nav-flash-produtos, revisão Codex concluída: 8 arquivos líquidos, 3 commits, +241/−38 vs base 20126114)
- Bundles ao vivo: **index-CYyV2xk9.js** + **index-Cq7wEl0I.css** (confirmados em AMBOS os domínios)
- Deploy: `base44 site deploy --no-build -y` a partir do build verde de b4ec513, zero instrumentação no dist

### O que entrou nesta publicação
1. **Flash da navbar entre itens resolvido** — AutoVideo remonta com eager+poster (NavDropVideo); sem janela vazia a frio (poster confirmado antes/depois, luminância contínua)
2. **Apontador (P01) + Eightyfive (P02)** em 3 lugares, via lista compartilhada `getPortfolioProducts(lang)` (leads fiéis PT/EN; rotas monolíngues /pt/apontador e /en/eightyfive): drop Trabalhos (16 subitens, mídia M logo), Work (bloco PRODUTOS PRÓPRIOS/IN-HOUSE PRODUCTS), HomeTrabalho (2 linhas após os 6 cases); tags "Produto próprio · Miranda Faria"/"In-house product · Miranda Faria"; mídia do drop renderiza só com painel aberto (fechar→reabrir sem 404)
3. **FrameTimeGraph v3** (3ª rodada de rework, arquivo reescrito por inteiro): burn com deadline de relógio (performance.now() na condição; teto real 22ms/frame; sem calibração), range nativo escondido para teclado (aria-label PT/EN, foco na figure via :focus-within), reduced-motion com controle desabilitado e estado estático, limpeza por modalidade (blur/keyup=teclado; lostpointercapture=ponteiro; visibilitychange/saída de viewport=tudo). Provas: drag 60→41fps recupera 60; teclado 100% burns 3→22ms reais (41fps recupera; a 65% = 14,3ms dentro do orçamento 16,7ms = 60fps honesto); toque 60→43 recupera; blur com tecla presa recupera sem soltar.

### Rollback
- Tag `rollback/2026-10-21-20126114` → 20126114 (base anterior, publicada)
- Tag `ao-vivo-83130af`, `ao-vivo-25106e6`, `ao-vivo-2026-10-21` (âncoras antigas) preservadas
- Snapshot de bytes do 25106e6 em `rollback_live_25106e6/` (index.html + bundles)
- Comando: `git checkout rollback/2026-10-21-20126114 && VITE_BASE44_APP_ID=6a74f6e6fbaa381e21a2415b npm run build && BASE44_APP_ID=6a74f6e6fbaa381e21a2415b base44 site deploy --no-build -y`
- Obs: dist de 20126114 não está snapshotted em bytes (rebuild reproduz; fonte íntegro no git + tag no GitHub)

### Validação pós-deploy no domínio real (21/10 ~18h35)
- HOME PT/EN: 2 linhas de produto com leads fiéis + tag "· MIRANDA FARIA" ✓ (0 erros JS)
- WORK PT/EN: bloco de 2 itens, labels PRODUTOS PRÓPRIOS / IN-HOUSE PRODUCTS ✓
- MENU: 16 subitens; hover em produto mostra m-logo-320.webp; abrir→fechar→reabrir sem 404 de assets ✓
- FTG ao vivo: drag 60→42fps, recupera 60 ao soltar ✓
- CONTACT PT: mailto **Eduardo@mirandafaria.com.br** exato ✓, WhatsApp presente (ícone PT) ✓, sem Calendly (correto: Calendly só EN)
- CONTACT EN: mailto exato ✓, Calendly presente ✓
- ATENÇÃO rota: contato PT é **/pt/contact** (não /pt/contato — esse é 404 do SPA com shell 200)
- Links: /pt/apontador 200, /en/eightyfive 200 (títulos corretos)
- Capturas pós-deploy com URLs: ver conversa (home/work/contact PT+EN, menu, FTG drag)

### Não alterado (preservado)
- Copy home/Diagnóstico, hero, tags antigas, claims pendentes (18 sistemas/7 dias seguem em aberto com o Eduardo), copy 2ª seção home (rascunho separado não tocado nesta branch)## FIX SERVIÇOS-DROP 21/10 ~19h (branch fix/servicos-drop, hash 217e9ef, LOCAL/GitHub — NÃO publicado)

Ordem do Eduardo: corrigir SOMENTE o dropdown Serviços a partir de b4ec513. Implementado: SubMediaSlot (SiteNav.jsx, local) — poster do PRIMEIRO FRAME REAL (nv_*_f0.webp, bit-idêntico, 40KB total) sempre pintado por baixo; vídeo overlay transparente (fim do #141414), opacity 0 até loadeddata com frame decodificado; cancelamento de readiness (só seleção atual revela). Fechamento: vídeo desmonta (0 rodando atrás do painel), estágio fica osso. AutoVideo global e painel Trabalhos INTACTOS. Validado local: varredura fria 1→4/130ms = 0 janelas vazias e 0 retângulos #141414 (escuros = conteúdo real dev/design); revelação suave (deltas 4-24 vs 98-476 antes); fechar/reabrir ok; 0 erros JS; 0 overflow 390; build verde. GitHub: branch pushada, PR link disponível. Diff: fix_servicos.diff. PRÓXIMAS ETAPAS (aguardando Eduardo): Sobre/copy/transições/portfólio. Deploy BLOQUEADO até ordem.

## FIX SERVIÇOS-DROP v2 21/10 ~19h (revisão Codex acatada, hash 5b803cc, LOCAL/GitHub — NÃO publicado)

Ponto da revisão: ready=true da seleção anterior era renderizado no <video key=novo> por um commit antes do useEffect zerar (janela de 1 frame). Corrigido: pai remonta o SubMediaSlot INTEIRO por seleção (key no componente) — readiness nasce false por construção, inclusive fechar→reabrir mesmo src; useEffect de reset removido; guarda de eventos antigos mantida (loadeddata só revela se e.currentTarget === vidRef.current). Prefetch dos 4 posters f0 (40KB) ao abrir o painel. Comentário 'bit-idêntico' corrigido. Validado caminho quente: anterior ready=true + troca rápida 1→4 = 0 violações (nenhum vídeo readyState<2 com data-ready=true); reabrir mesmo src nasce false até o próprio loadeddata; varredura fria 0 defeitos (frame plano único = poster real do autom, quase branco); Trabalhos intacto, 0 overflow, 0 erros, build verde. Diff incremental: fix_servicos_v2.diff (217e9ef→5b803cc). Deploy BLOQUEADO.

## DEPLOY SERVIÇOS-DROP 21/10 ~19h10 (hash 5b803cc PUBLICADO no oficial 6a74f6e6fbaa381e21a2415b)

Autorização: revisão Codex aprovou 5b803cc; Eduardo autorizou publicação após conferir. Deploy: build verde com VITE_BASE44_APP_ID oficial + `base44 site deploy --no-build -y`. Rollback preservado: TAG `rollback/2026-10-21-b4ec513` → b4ec513 (base anterior, no GitHub), snapshot de bytes `rollback_live_b4ec513/index.html` (bundle index-CYyV2xk9.js). COMANDO DE RESTAURAÇÃO: `git checkout rollback/2026-10-21-b4ec513 && VITE_BASE44_APP_ID=6a74f6e6fbaa381e21a2415b npm run build && BASE44_APP_ID=6a74f6e6fbaa381e21a2415b base44 site deploy --no-build -y`.

Validação pós-deploy no domínio REAL: bundle novo index-Dj7S2FnG.js no com.br e no base44.app; 4 posters nv_*_f0.webp = 200 no domínio; varredura fria 1→4/130ms = 0 retângulos planos/vazios, 0 janelas #141414; sonda de violação (video readyState<2 com data-ready=true): 1 transient em 1ª rodada (stall de rede em vídeo tocando — pinta último frame sobre poster, benigno), 0 em 6 varreduras seguintes (frio e quente); 0 erros JS. Provas: live_servicos_panel.png, live_sweep_contact.png.

## RESPIRO SOBRE 21/10 ~19h15 (branch fix/sobre-respiro, hash 2aca08e, LOCAL/GitHub — NÃO publicado)

Ordem do Eduardo: apenas respiro de SOBRE. Adicionado padding-top:clamp(3rem,6vw,5.5rem) na section.mf-about (regra nova no bloco de estilos de About.jsx; nada mais tocado). Validado PT/EN x 1440/390/320: acesso direto e navegação interna home→menu ok nos 6 combos; respiro abaixo da navbar 86px@1440 (6vw sob teto 88px) / 83px@390+320 (3rem=48px + 35px pré-existentes); H1 nunca sob a navbar; 0 overflow; grade 5fr/7fr desktop e 1 col mobile intactas; retrato 4:5 presente; 0 erros JS; build verde. Ordem mobile e copy inalteradas. Diff: fix_sobre.diff (5b803cc→2aca08e). Aguardando revisão do Eduardo/Codex; deploy BLOQUEADO.

## DEPLOY RESPIRO SOBRE 21/10 ~19h20 (hash 2aca08e PUBLICADO no oficial 6a74f6e6fbaa381e21a2415b)

Revisão Codex aprovou o diff de 3 linhas. Deploy: build do 2aca08e + `base44 site deploy --no-build -y`. Rollback: tag `rollback/2026-10-21-5b803cc` → 5b803cc (base anterior, no GitHub), snapshot rollback_live_5b803cc/. RESTAURAÇÃO: `git checkout rollback/2026-10-21-5b803cc && VITE_BASE44_APP_ID=6a74f6e6fbaa381e21a2415b npm run build && BASE44_APP_ID=6a74f6e6fbaa381e21a2415b base44 site deploy --no-build -y`. Validado ao vivo (carregamento DIRETO das rotas — medição sintética de sonda; navegação por clique visível fica com o Eduardo): bundle index-DerFPteh.js no com.br e base44.app; /pt/about e /en/about PT+EN: pad 86px@1440 e 48px@390/320, H1 a 122px abaixo da navbar no desktop, 0 overflow, 0 erros JS. Capturas: live_about_pt_1440.png, live_about_pt_390.png (+EN equivalentes).

## TRANSIÇÕES 21/10 ~22h35 (hash 2e286c7 na branch feat/transicoes, base 2aca08e PUBLICADO — NÃO publicar ainda)

Eduardo aprovou "elegante e breve": rodízio determinístico de 2 variantes, gesto ~820-880ms (cover 0.40 + revelação 0.42). A) COBRE: círculo #B5502E abre do centro + M OSSO (m-logo-bone.webp 25KB, alpha ok) assenta por cima, segura 150ms, círculo fecha revelando. B) FILETE: 2 painéis de osso (--bone, NÃO --paper que é branco) fecham com filete de cobre 3px no centro; na revelação os painéis partem horizontalmente e o filete é o último a sair. Alternância: contador módulo-2 em nível de módulo (cobre,filete,cobre…).

FIX CRÍTICO DESCOBERTO: o <Link> do react-router NÃO checa defaultPrevented — preventDefault sozinho não impedia a navegação instantânea, o cover era morto no nascimento nos NavLink (nav+menu mobile); só <a> puro (subitens dropdown) tinha cortina completa. Correção: e.stopImmediatePropagation() na fase de captura. TransitionLink (importado como Link por 11 arquivos) virou Link puro — ViewTransitions API REMOVIDA (não sobrepõe mais). Cada variante renderiza só as próprias camadas via data-v (painéis não ficavam por cima do círculo). Wordmark MIRANDA FARIA saiu (orçamento de tempo "breve" — voltar se o Eduardo pedir).

Anti-stuck: teardown do listener só no unmount real (deps []); clique rápido durante cover redireciona destino pendente; popstate no cover cancela navigate duplo (back ganha revelação); fallback 2s mata cortina em rota lazy lenta; reduced-motion navega seco; unmount (ex. /privacidade fora do casco de idioma) devolve overflow do html — no código ANTIGO esse link deixava o html travado com overflow:hidden.

VALIDADO (build verde, lint 0, cliques visíveis Playwright): 6 combos PT/EN x 1440/390/320 — sequência copper,split,copper determinística, 0 erros JS, 0 overflow, nada travado; timing ~690-980ms; back no meio do cover (556ms revela /pt, sem navigate duplo) + forward limpos; clique duplo rápido aterrissa no 2º alvo; reduced-motion seco; privacidade restaura overflow. Prova de pixel: auge cobre (182,83,50), auge filete (245,240,233). Gravação trans_rodizio.webm + trans_v1_cobre_auge.png + trans_v2_filete_auge.png.

ACHADO PRÉ-EXISTENTE (não mexi, reportado): /privacidade renderiza em BRANCO com erro "useLang precisa estar dentro de <LanguageProvider>" — a página usa useLang fora do casco de idioma; acontece TAMBÉM no live (2aca08e). Fora do escopo desta etapa (SÓ transições).

DIFF: git diff 2aca08e..feat/transicoes (368 linhas; TransitionCurtain.jsx + TransitionLink.jsx). Próximos passos da rodada: revisão Codex → deploy só com ordem; depois portfólio.

## COPY HOME+SOBRE 22/10 ~06h40 (hash 6299d471eb6c1613e59c7b5032d2ce3ff165926f na branch copy/home-sobre, base c3e70f9 PÚBLICA — NÃO publicado, aguarda revisão do Eduardo)

Escopo da etapa: SÓ copy Home+Sobre PT/EN, aplicando o rascunho docs/editorial/2026-10-21-copy-fase2.md (doc167154cf, origin/codex/editorial-refino-fase2). Voz de companhia preservando hero visual/ordem do Claude; Eduardo = fundador responsável; SEM equipe/números/locais inventados.

Aplicado: (1) HERO companhia — "Estruturamos a base que sustenta o seu negócio." / "We build the foundations your business runs on.", rótulo "O que fazemos"/"What we do", CTA "Vamos conversar"/"Let's talk" (links PT WhatsApp / EN Calendly preservados), role EN "Consulting & Technology" (alinhado ao PT). (2) SEÇÃO 2 NOVA: HomeSobre deixou de ler about.lead/body e ganhou campos PRÓPRIOS home.sobrePreview (label/lead/body/cta) — comercial "A tecnologia começa na rotina da sua empresa." / "Technology shaped around the way you work.", 2 parágrafos do rascunho, CTA /servicos "Conheça nossas soluções"/"See our solutions" (link testado: clique leva a /pt/servicos e /en/servicos). (3) SOBRE: "Sobre a Miranda Faria"/"About Miranda Faria", lead "Tecnologia aplicada a negócios reais."/EN mirror, bio 3 parágrafos companhia-primeiro (companhia; Eduardo fundador, "quem conversa com você fala com quem constrói"; método IA com revisão humana), princípios "Como decidimos" nos termos do rascunho; location Piumhi/BH mantida como está (não ampliada). (4) CLAIMS RETIRADOS: "a resposta chega no mesmo dia" (finalCta PT/EN) e "três perguntas/quarenta segundos" (insightsPreview PT/EN, lead vira "Onde sua operação perde tempo?"). home.pitch é copy MORTA (nenhum componente consome) — não mexida. Email Eduardo@mirandafaria.com.br, fórmulas, fluxos, privacidade e mídias intocados.

VALIDADO local (build verde, lint 0): PT/EN x 1440/390 — hero, seção 2, finalCta e diagnóstico renderizando a nova copy; 0 erros JS; 0 overflow em tudo; about 3 parágrafos + rótulos certos; screenshots prev_*.png. CLAIMS PENDENTES (decisão do Eduardo): (a) role EN "Consulting & Technology" (era "Design Engineer & Creative Technologist") — confirmar; (b) EN é adaptação inicial, revisar contexto UK/IE; (c) contact.response "Respondo no mesmo dia." na página de contato NÃO foi tocado (fora do escopo Home+Sobre) — pendente p/ etapa de contato; (d) menção escritório BH mantida como estava (confirmar antes de ampliar); (e) "quatorze trabalhos" da trajetória mantido (fato existente); (f) empty state do portfólio e microcopy de navegação ficam para etapa própria. PRÓXIMA: revisão do Eduardo → deploy do 6299d47 sob ordem.

## PILOTO PROPORCAO NATURAL 3 CASES 22/10 ~06h50 (branch piloto/natural-3-cases, base fa89763 PUBLICADO — NAO publicado, aguarda revisao)

Escopo EXATO: rota-forte, roda-agro-marca, advogados-lco (PT+EN, 6 linhas media com natural:true). Demais cases: 16:9 cover inalterado. NAO trocado arquivo/midia/poster; videos e mascaras intocados; sem galeria/zoom. IMPLEMENTACAO: CaseMedia ganha modo natural (shots sem cover, sem srcset descritor mentiroso — arquivo original direto; aspect-ratio inline por arquivo = reserva exata antes da carga = zero CLS; contain; max-height 85vh; fundo --bone; quadro/borda preservado). Roda03 (512x917 Drive): max-width 512px centrada, sem upscale. FIXES da rodada: (1) srcset tinha descritores falsos (todo full rotulado 1600w com larguras reais 512-1600) — modo natural nao usa srcset; demais cases seguem com srcset antigo (preexistente, fora do escopo); (2) aspect-ratio:auto nao reservava altura (box 2px→salto); inline ratio resolveu. VALIDADO (build local): reservado==final (636/796/etc), CLS paginas piloto 0.27-0.35 == baseline 0.3315 do caso fora do piloto (animacoes existentes, nao imagens); naturalWidth agora = bitmap real; ovX 0 em 1440/390 PT+EN; 0 erros; cliques cards Work ok. Composites antes/depois: piloto_antesdepois_*.jpg. Apos aprovacao: merge + deploy do hash desta branch.


