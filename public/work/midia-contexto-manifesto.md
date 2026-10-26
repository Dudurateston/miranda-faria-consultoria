# Mídia contextual dos cases — captura 25/10/2026

Branch codex/cases-contexto-midia-2026-10-25 (base 7548cadb). Captura em browser real (Chromium headless, viewport 1440x900, gestos reais de rolagem/clique/hover), sites públicos atuais. Sem áudio; H264 yuv420p 1280x800; CRF 21 com teto 1.5 Mbps; faststart; GOP ~1s; fps = o que a fonte real sustenta (30 nos sites fluidos, 12 no MotorMoura).

## public/work/rota-forte/context-frota.mp4
- Fonte: https://rota-forte.base44.app/
- Ação capturada: Rolagem do hero até a seção de equipamentos (frota) com hover em card
- Dimensões: 1280x800 | Duração: 6.53s | fps: 30 | quadros: 196
- faststart: True | SHA256 (mp4): eb728f921e0a16d21956ea23520e159a8908985d355bdeda309558ddc09a77da
- Poster: public/work/rota-forte/context-frota-poster.webp (SHA256 01399546d022032a…) | Print: public/work/rota-forte/context-frota.webp (SHA256 72b23622fb893c08…)
- Legenda PT: Site Rota Forte: seção de equipamentos — frota de munck e carretas para qualquer operação.
- Legenda EN: Rota Forte site: the equipment section — munck fleet and trailers for any operation.

## public/work/rota-forte/context-atendimento.mp4
- Fonte: https://rota-forte.base44.app/
- Ação capturada: Do mapa de atuação até o cadastro de frota e o bloco de orçamento
- Dimensões: 1280x800 | Duração: 7.67s | fps: 30 | quadros: 230
- faststart: True | SHA256 (mp4): 6df1a38d7343e0de9b9bb7809654d51de6991edaac82ed922b13863f7ca1c95d
- Poster: public/work/rota-forte/context-atendimento-poster.webp (SHA256 0bafa8d1bf6c0feb…) | Print: public/work/rota-forte/context-atendimento.webp (SHA256 a77934702490b702…)
- Legenda PT: Site Rota Forte: do mapa de atuação ao cadastro de frota e orçamento direto.
- Legenda EN: Rota Forte site: from the coverage map to fleet signup and a direct quote.

## public/work/motormoura/context-categorias.mp4
- Fonte: https://motormouraequipamentos.com.br/
- Ação capturada: Rolagem até "O que você procura?" com hover em categoria
- Dimensões: 1280x800 | Duração: 6.83s | fps: 12 | quadros: 82
- faststart: True | SHA256 (mp4): d7cfa422655a679e00e18da773f6fd8a719ada116c5612e98d22073331ebc276
- Poster: public/work/motormoura/context-categorias-poster.webp (SHA256 a8f1aa4959b61a9d…) | Print: public/work/motormoura/context-categorias.webp (SHA256 440acf604b7da363…)
- Legenda PT: Site MotorMoura: home com categorias e linhas de produto ("O que você procura?").
- Legenda EN: MotorMoura site: home with categories and product lines ("What are you looking for?").

## public/work/motormoura/context-atendimento.mp4
- Fonte: https://motormouraequipamentos.com.br/
- Ação capturada: Rolagem pelas vantagens até "Como fazer uma cotação"
- Dimensões: 1280x800 | Duração: 6.25s | fps: 12 | quadros: 75
- faststart: True | SHA256 (mp4): 52c5940ddb2f38bd95df156504414617be65c2c9deb54998e51102537b8885cb
- Poster: public/work/motormoura/context-atendimento-poster.webp (SHA256 e03c2c8931ee3f39…) | Print: public/work/motormoura/context-atendimento.webp (SHA256 afe4bb745fd3a597…)
- Legenda PT: Site MotorMoura: vantagens e o passo a passo de cotação.
- Legenda EN: MotorMoura site: advantages and the step-by-step quote request.

## public/work/1000-pecas/context-categorias.mp4
- Fonte: https://100pecas.base44.app/
- Ação capturada: Rolagem do hero até as categorias de peças com hover
- Dimensões: 1280x800 | Duração: 7.03s | fps: 30 | quadros: 211
- faststart: True | SHA256 (mp4): 62b7f4fc0e4bf46478b5409c957cf3370bcd060ed1c61ee469b642ea6acc091e
- Poster: public/work/1000-pecas/context-categorias-poster.webp (SHA256 2822d9d7736dbcc4…) | Print: public/work/1000-pecas/context-categorias.webp (SHA256 55dcacd98ee74514…)
- Legenda PT: Site 1000 Peças: categorias de peças para caminhões e pickups.
- Legenda EN: 1000 Peças site: parts categories for trucks and pickups.

## public/work/1000-pecas/context-pecas.mp4
- Fonte: https://100pecas.base44.app/
- Ação capturada: Rolagem até "Encontre a peça certa" navegando os cards de peças
- Dimensões: 1280x800 | Duração: 7.27s | fps: 30 | quadros: 218
- faststart: True | SHA256 (mp4): 3b5b2485ef3ad516cc7e3ba5b04da1a930487844cc5f9e02f86d10f542ce9cfa
- Poster: public/work/1000-pecas/context-pecas-poster.webp (SHA256 45b513aa2660863d…) | Print: public/work/1000-pecas/context-pecas.webp (SHA256 73e379827d5839dd…)
- Legenda PT: Site 1000 Peças: "Encontre a peça certa" — navegação dos cards de peças.
- Legenda EN: 1000 Peças site: "Find the right part" — browsing the parts cards.

## Notas honestas e limitações

- MotorMoura sustenta ~12fps reais de render em headless (raster menor não muda; é custo da página). Clipes MM codificados a 12fps com rolagem lenta (passo ~12px/quadro) — sem duplicar quadros para fingir 30fps.
- A página /Catalogo da MotorMoura rende ~2.4fps em screencast headless (grade B2B pesada); clipe de vídeo do catálogo não é viável nesta etapa. Estado atual do catálogo (verificado): FUNCIONAL, com abas CATÁLOGO/FAVORITOS/COMPARATIVO/CATÁLOGO TÉCNICO B2B, "Todas as Peças de Reposição" e LINHAS DE PRODUTO (Cortadora de Piso, Ferramentas a Bateria, Marteletes e Demolidores, Ferramentas Elétricas, Vibrador…) — sem aviso "em atualização" visível. Print do catálogo capturado para revisão (não commitado: fora do escopo 2+2).
- Rota Forte: o raster congela após o primeiro screenshot na mesma sessão (site com motion pesado); cada print saiu de uma sessão própria, clips a ~57-58fps reais.
- Congelamentos: maior sequência de quadros idênticos em qualquer clipe = 0.18s (hover curto); sem spinner/paradas longas.
- Vídeos originais/current/poster existentes e materiais do Thales: intocados. Nenhum arquivo alterado — apenas adição de context-* novos.