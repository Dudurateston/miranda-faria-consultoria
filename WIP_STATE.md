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

## DEPLOY TRANSIÇÕES 21/10 ~19h50 — PUBLICADO (hash c3e70f9cd434811fb72c2bda609ab2ab31f2c8dd no oficial 6a74f6e6fbaa381e21a2415b, mirandafaria.com.br)

Autorização do Eduardo (persistente "ao conferir publique"): revisou c3e70f9 vs 2aca08e no GitHub, 3 fixes + WIP_STATE documental aprovados. Árvore restaurada ao exato c3e70f9 (src/ idêntico; sitemap lastmod sujo revertido), tag rollback/2026-10-21-2aca08e criada no 2aca08e e enviada ao GitHub.

ROLLBACK (se precisar): git checkout rollback/2026-10-21-2aca08e && rm -rf dist && VITE_BASE44_APP_ID=6a74f6e6fbaa381e21a2415b npm run build && BASE44_APP_ID=6a74f6e6fbaa381e21a2415b base44 site deploy --no-build -y

Bundle no ar: index-6pW_d8V0.js (confirmado por curl no domínio e no HTML). CHECK DIRIGIDO AO VIVO (21/10): variantes cobre/filete/cobre em sequência real de cliques — 904/1011/976ms; submenu Serviços→desenvolvimento 950ms e Trabalhos→case queijos-serra 1019ms com painéis fechando e nada preso; rolagem normal (scrollY 1498, overflowX 0); reduced-motion navega seco sem cortina; mobile 390: 930ms, overflowX 0; 0 erros JS em tudo. TIMING OBSERVADO AO VIVO: ~900-1020ms (registrar com honestidade — NÃO é teto de 900ms garantido; a rede/route lazy da produção adiciona sobre os ~800-950ms locais). COPY/MÍDIAS/PRIVACIDADE intocados (etapa separada). Próxima etapa do arco: portfólio.

## TRANSIÇÕES 21/10 ~19h45 — FIXES DA REVISÃO (hash c3e70f9 na feat/transicoes, em cima do 2e286c7; NÃO publicado)

Eduardo revisou 2e286c7 + capturas: direção visual APROVADA. 3 fixes do diff aplicados e testados dirigidos: (1) drops do SiteNav: stopImmediatePropagation suprimia os onClick de setDrop/setTDrop/setXDrop — agora TODOS os painéis fecham por effect [location.pathname] (mesmo mecanismo do menuOpen); testado clique visível com cursor parado no painel (magnet do CopperCursor deixa o item em movimento contínuo — clique por coordenada): Serviços→/pt/desenvolvimento e Trabalhos→/pt/work/queijos-serra navegam com painel fechado, nada travado. (2) mesma pathname com ?query/#hash (ex. /pt/work#equipe) atravessa NATIVA — comparação agora por pathname puro (href.split(/[?#]/)[0]); sem cortina (o effect [loc.pathname] nunca rodaria → cortina viveria até o fallback 2s); hash nativo intocado, onClick do Link preservado. (3) effect de rota com reduced-motion usa hardCleanup completo (mata timeline, limpa fallback, devolve overflow do html) — teste com reduced ligado NO MEIO do gesto: reset em 225ms. Regressão 6 combos PT/EN 1440/390/320: sequência cobre,filete,cobre, ~800-950ms, 0 erros/overflow/travamentos. Próximo: deploy do c3e70f9 sob ordem explícita; depois portfólio.

## TRANSIÇÕES 21/10 ~22h35 (hash 2e286c7 na branch feat/transicoes, base 2aca08e PUBLICADO — NÃO publicar ainda)

Eduardo aprovou "elegante e breve": rodízio determinístico de 2 variantes, gesto ~820-880ms (cover 0.40 + revelação 0.42). A) COBRE: círculo #B5502E abre do centro + M OSSO (m-logo-bone.webp 25KB, alpha ok) assenta por cima, segura 150ms, círculo fecha revelando. B) FILETE: 2 painéis de osso (--bone, NÃO --paper que é branco) fecham com filete de cobre 3px no centro; na revelação os painéis partem horizontalmente e o filete é o último a sair. Alternância: contador módulo-2 em nível de módulo (cobre,filete,cobre…).

FIX CRÍTICO DESCOBERTO: o <Link> do react-router NÃO checa defaultPrevented — preventDefault sozinho não impedia a navegação instantânea, o cover era morto no nascimento nos NavLink (nav+menu mobile); só <a> puro (subitens dropdown) tinha cortina completa. Correção: e.stopImmediatePropagation() na fase de captura. TransitionLink (importado como Link por 11 arquivos) virou Link puro — ViewTransitions API REMOVIDA (não sobrepõe mais). Cada variante renderiza só as próprias camadas via data-v (painéis não ficavam por cima do círculo). Wordmark MIRANDA FARIA saiu (orçamento de tempo "breve" — voltar se o Eduardo pedir).

Anti-stuck: teardown do listener só no unmount real (deps []); clique rápido durante cover redireciona destino pendente; popstate no cover cancela navigate duplo (back ganha revelação); fallback 2s mata cortina em rota lazy lenta; reduced-motion navega seco; unmount (ex. /privacidade fora do casco de idioma) devolve overflow do html — no código ANTIGO esse link deixava o html travado com overflow:hidden.

VALIDADO (build verde, lint 0, cliques visíveis Playwright): 6 combos PT/EN x 1440/390/320 — sequência copper,split,copper determinística, 0 erros JS, 0 overflow, nada travado; timing ~690-980ms; back no meio do cover (556ms revela /pt, sem navigate duplo) + forward limpos; clique duplo rápido aterrissa no 2º alvo; reduced-motion seco; privacidade restaura overflow. Prova de pixel: auge cobre (182,83,50), auge filete (245,240,233). Gravação trans_rodizio.webm + trans_v1_cobre_auge.png + trans_v2_filete_auge.png.

ACHADO PRÉ-EXISTENTE (não mexi, reportado): /privacidade renderiza em BRANCO com erro "useLang precisa estar dentro de <LanguageProvider>" — a página usa useLang fora do casco de idioma; acontece TAMBÉM no live (2aca08e). Fora do escopo desta etapa (SÓ transições).

DIFF: git diff 2aca08e..feat/transicoes (368 linhas; TransitionCurtain.jsx + TransitionLink.jsx). Próximos passos da rodada: revisão Codex → deploy só com ordem; depois portfólio.


