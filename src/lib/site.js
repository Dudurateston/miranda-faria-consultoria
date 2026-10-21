export const WHATSAPP_URL =
  "https://wa.me/5531997731250?text=Olá%20Eduardo,%20gostaria%20de%20agendar%20uma%20reunião";

// CTAs WhatsApp — variam só pela mensagem pré-preenchida.
export const WHATSAPP_URL_BARE = "https://wa.me/5531997731250";
export const WHATSAPP_URL_SITE =
  "https://wa.me/5531997731250?text=Olá%20Eduardo,%20vi%20seu%20site%20e%20gostaria%20de%20conversar";
export const WHATSAPP_URL_SELLER =
  "https://wa.me/5531997731250?text=Olá%20Eduardo,%20quero%20ser%20vendedor%20e%20fazer%20parte%20do%20time";

/* Prefill EN (21/10): mesmo canal e mesmo numero; a mensagem abre no idioma
   do visitante. Usado so nos CTAs EN que anunciam "Message on WhatsApp" -
   os CTAs de agendamento seguem no Calendly (regra PT=WhatsApp / EN=Calendly). */
export const WHATSAPP_URL_EN =
  "https://wa.me/5531997731250?text=Hi%20Eduardo,%20I%27d%20like%20to%20schedule%20a%20meeting";
export const WHATSAPP_URL_SITE_EN =
  "https://wa.me/5531997731250?text=Hi%20Eduardo,%20I%20saw%20your%20site%20and%20would%20like%20to%20talk";
export const WHATSAPP_URL_SELLER_EN =
  "https://wa.me/5531997731250?text=Hi%20Eduardo,%20I%27d%20like%20to%20join%20the%20sales%20team";
/* 15/10 (site-seo): o app dos vendedores ainda era o "Hub de Vendas U.AI",
   marca encerrada. Vazio = os links somem (Footer, About, Contact).
   Antigo: "https://vendas-uai-hub.base44.app". */
export const SELLERS_APP_URL = "";

/* Paginas de produto (15/10). WhatsApp de vendas do Apontador = o da
   assinatura dos e-mails do Brasil. Os demais CTAs seguem no numero
   do site ate o dono decidir unificar. */
export const WHATSAPP_APONTADOR_URL =
  "https://wa.me/5531997731250?text=Ol%C3%A1%20Eduardo%2C%20quero%20o%20diagn%C3%B3stico%20gr%C3%A1tis%20do%20AFD%20da%20minha%20f%C3%A1brica";
export const WHATSAPP_APONTADOR_DISPLAY = "+55 31 99773-1250";
export const APONTADOR_DEMO_URL = "https://apontador-demo.base44.app";
export const EIGHTYFIVE_DEMO_URL = "https://eightyfive.base44.app";

// Assets oficiais — logo principal transparente, hero em MP4 e mídias de seção.
export const M_LOGO = "/art/m-logo-320.webp";
export const M_LOGO_DARK = "/art/m-logo-320-dark.webp";
/* M da CORTINA: branco-prata SOLIDO 100% opaco — recolorido do ramp do
   SVG oficial (#fff -> #f0f2f2 -> #a8abad). Eduardo 17/09: "meu logo tem
   um tom mais branco" — acabou o osso-cinza. Sobre fundos claros (nav/hero
   na skin clara) o CSS da um filtro de prata pra manter visibilidade. */
/* M da CORTINA: osso CHAPADO sobre o círculo de cobre. O prata metálico
   (gradiente 61→215) tinha traços escuros que sumiam no cobre (18/09). */
export const M_LOGO_CURTAIN = "/art/m-logo-curtain-deboss.webp"  /* 19/09 v3 (Eduardo: contraste estranho, "parece um erro") — M "stamp" espresso-cobre escuro (3,1:1) no lugar do branco chapado (7,9:1) sobre o cobre */
export const M_LOGO_INK = "/art/m-logo-ink.webp";
/* M em OSSO PURO para fundos escuros/cobre (Eduardo 17/09: o prata
   oficial lavado sobre grafite/cobre dava erro de contraste). */
export const M_LOGO_BONE = "/art/m-logo-bone.webp";
export const M_LOGO_HERO = "/art/m-logo-hero.webp";
// Servidos do bucket publico miranda-faria no Supabase: qualidade original
// (fonte 4K) sem pesar no bundle do app. Hero continua local (LCP).
/* A3 (relatório): mídia servida do PRÓPRIO domínio — sem dependência de terceiro */
export const REELS_URL = "/art/design/hq_reels.mp4";
export const CORTE_GIF = "/art/corte.mp4";
export const WATERMARK_GIF = "/art/watermark.webp";
export const PARTICLES_VIDEO = "/art/cta_particles.mp4";
export const HERO_LOOP = "/art/hero_loop.mp4";
export const LEAD_VIDEO = "/art/lead_loop.mp4";
export const AUTOM_VIDEO = "/art/automacao_loop.mp4";
export const LOGO_ANIM_GIF = "/art/watermark_logo.webp";
export const GEO_GIF = "/art/geo.mp4";
export const CELESTE_GIF = "/art/celeste.mp4";
export const WHATSAPP_DISPLAY = "(31) 99773-1250";
/* 15/10 (site-seo): mesmo endereco dos e-mails de prospeccao, para quem
   recebeu o e-mail reconhecer o dominio. Antigo: edumirandamf@gmail.com */
export const EMAIL = "Eduardo@mirandafaria.com.br";
export const MARCA = "Miranda Faria";

// CTA internacional: agendamento em vez de WhatsApp (DECISIONS.md).
export const CALENDLY_URL = "https://calendly.com/edumirandamf";

// TODO(pendencia): colocar a URL real do perfil quando o dono criar.
// 15/10 (site-seo): vazio = o link some do rodape. Antes apontava para a
// home generica do LinkedIn (link quebrado para quem clicava).
export const LINKEDIN_URL = "";

/* ---- Arte generativa (Drive "superagente base44", otimizada de 4K) ----
   Particulas de cobre e placa Miranda Faria: geradas por IA, usadas como
   arte de marca — nunca como prova de escritorio fisico. */
export const DESIGN_PARTICLES = "/art/design/hq_particles2.mp4";
export const DESIGN_SIGN = "/art/design/hq_sign.mp4";
export const DESIGN_POSTER = "/art/design_open_poster.jpg";

/* Duas peças novas (Drive 05/09), as mais fortes do conjunto — as duas
   terminam revelando o M, o que as torna assinatura e não enfeite:
   CAMADAS: lajes de concreto em desordem que se organizam em estratos
   limpos até o M aparecer na parede. É a tese da página em imagem —
   caos que vira ordem. Loop costurado com dissolve de 0,8s.
   VEIO: dolly por um cânion de estratos com um veio incandescente de
   cobre no eixo. Fecha a página. Loop em vai-e-volta, sem corte. */
export const DESIGN_LAYERS = "/art/design/hq_camadas.mp4";
export const DESIGN_SEAM = "/art/design/hq_veio.mp4";

const SUPA_PUB = "https://neyrifcfmpwqvadppihu.supabase.co/storage/v1/object/public/miranda-faria";
export const BRAND_FACADE = "/art/brand-facade.webp";
export const BRAND_FACADE_800 = "/art/brand-facade@800.webp";
export const TEXTURE_MACRO = "/art/texture-macro.webp";
export const FLOW_CREATIVE = "/art/flow-creative.webp";

/* ==========================================================================
   POOL DE VÍDEOS & REGISTRO DE LIMITES DE USO (16/09, pedido do Eduardo)
   Nenhum vídeo pode se repetir à exaustão: limite global por arquivo e
   exclusividade total dentro da NavBar. O script scripts/check-video-usage.mjs
   roda antes de cada build (prebuild) e aborta o deploy se estourar.
   Os 7 "nv_*" nasceram de fontes 4K inéditas do Drive — um por slot da nav.
   ========================================================================== */
export const NAV_MEDIA = {
  solutions: {
    gestao: "/art/nv_sistemas.mp4",
    desenvolvimento: "/art/nv_dev.mp4",  /* sistema digital — placa da marca era conteudo de design, nao de dev */
    design: "/art/nv_design.mp4",
    automacao: "/art/nv_autom.mp4",
  },
  about: "/art/nv_sobre.mp4",
  how: "/art/nv_tech_yoyo.mp4",
  diag: "/art/nv_diag.mp4",
};

/* Mídias de SEÇÃO — os nv_* reocupados fora da NavBar, cada um no seu tema
   (Eduardo, 17/09: cards da home voltam aos vídeos originais; os novos
   vão pras páginas/temas a que pertencem). */
export const SECTION_MEDIA = {
  hiwStack: NAV_MEDIA.how,
  /* Eduardo 18/09: a faixa usa o MESMO video da HOME, secao Solucoes,
     linha "Sistemas & Gestao" (corte.mp4) — o video de camadas. */
  servicosFaixa: CORTE_GIF,
  insightsPreview: NAV_MEDIA.diag,
  aboutBand: "/art/nv_placa.mp4",
  sobreReel: "/art/sobre_reel.mp4",
};

export const VIDEO_USE_LIMIT = {
  "art/corte.mp4": 2,
  /* A3: design removido do Supabase — mídia local agora (relatório B1/A3) */
  "art/design/hq_reels.mp4": 1,
  "art/design/hq_particles2.mp4": 1,
  "art/design/hq_sign.mp4": 1,
  "art/design/hq_camadas.mp4": 1,
  "art/design/hq_veio.mp4": 1,
  "art/lead_loop.mp4": 1,
  "art/automacao_loop.mp4": 1,
  "art/celeste.mp4": 1,
  "art/cta_particles.mp4": 1,
  "art/hero_loop.mp4": 1,
  "art/geo.mp4": 1,
  "art/nv_sistemas.mp4": 2,
  "art/nv_camadas.mp4": 1,
  "art/nv_tech_yoyo.mp4": 2,
  "art/nv_placa.mp4": 2,
  "art/nv_dev.mp4": 1,
  "art/nv_design.mp4": 1,
  "art/nv_autom.mp4": 1,
  "art/nv_sobre.mp4": 1,
  "art/sobre_reel.mp4": 1,
  "art/nv_tech.mp4": 2,
  "art/nv_diag.mp4": 2,
  "hq_reels.mp4": 1,
  "hq_camadas.mp4": 1,
  "hq_sign.mp4": 1,
  "hq_veio.mp4": 1,
  "work/1000-pecas/video.mp4": 2,
  "work/dj-jotave/video.mp4": 2,
  "work/miranda-faria/video.mp4": 2,
  "work/paulo-henrique/video.mp4": 2,
  "work/queijos-serra/video.mp4": 2,
  "work/rota-forte/video.mp4": 2,
};
