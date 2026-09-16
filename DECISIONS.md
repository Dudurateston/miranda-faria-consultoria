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
