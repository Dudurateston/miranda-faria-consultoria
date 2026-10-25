import { remainingPresentations } from './remainingCasePresentation.js';
// Presentation metadata. New captures use distinct filenames; original media is retained.
const shot = (id, src, width, height, pt, en, displayWidth) => ({
  id, type: 'image', src, width, height, displayWidth,
  text: { pt: { alt: pt, caption: pt }, en: { alt: en, caption: en } },
});

const presentations = {
  'rota-forte': {
    leadMedia: 'rota-home',
    leadMode: 'wide',
    editorial: true,
    delivery: { pt: 'Site institucional e catálogo', en: 'Company website and catalogue' },
    headings: {
      pt: { problem: 'O ponto de partida', process: 'A frota orienta a escolha', decisions: 'Informação com lugar e propósito', impact: 'O que foi entregue' },
      en: { problem: 'The starting point', process: 'The fleet guides the choice', decisions: 'Information with a purpose', impact: 'What was delivered' },
    },
    media: [
      shot('rota-home', '/work/rota-forte/current-home.webp', 1440, 900,
        'Abertura do site e acesso à frota.', 'Website opening and access to the fleet.'),
      { id: 'rota-video', type: 'video', src: '/work/rota-forte/current-walkthrough.mp4',
        poster: '/work/rota-forte/current-home.webp', width: 1440, height: 900,
        text: {
          pt: { alt: 'Navegação real no site atual da Rota Forte.', caption: 'Da apresentação da frota às informações de atuação.' },
          en: { alt: 'A real walkthrough of the current Rota Forte website.', caption: 'From the fleet presentation to information about the operation.' },
        } },
      shot('rota-operations', '/work/rota-forte/current-operations.webp', 1440, 793,
        'Apresentação de operações e informações técnicas.', 'Operations and technical information presented on the website.'),
    ],
    chapters: [
      { id: 'decisions', sections: ['process', 'decisions'], media: ['rota-operations'], layout: 'wide' },
      { id: 'walkthrough', title: { pt: 'O projeto em uso', en: 'The project in use' }, sections: [], media: ['rota-video'], layout: 'wide' },
      { id: 'outcome', sections: ['impact'], media: [], layout: 'text' },
    ],
  },
  'motormoura': {
    leadMedia: 'moura-home', leadMode: 'wide', editorial: true,
    delivery: { pt: 'Site institucional e catálogo B2B', en: 'Company website and B2B catalogue' },
    headings: {
      pt: { problem: 'Uma presença própria para a distribuidora', process: 'Organizar a procura por peças', decisions: 'A mesma identidade no celular', impact: 'O que foi entregue' },
      en: { problem: 'A distinct presence for the distributor', process: 'Organising the search for parts', decisions: 'The same identity on mobile', impact: 'What was delivered' },
    },
    media: [
      shot('moura-home', '/work/motormoura/current-home.webp', 1440, 900,
        'Abertura com a identidade da distribuidora, marcas e canais de atendimento.', 'Opening with the distributor’s identity, brands and contact channels.'),
      shot('moura-mobile', '/work/motormoura/current-mobile.webp', 780, 1688,
        'Hierarquia e navegação adaptadas às telas menores.', 'Hierarchy and navigation adapted to smaller screens.', 390),
      { id: 'moura-video', type: 'video', src: '/work/motormoura/current-walkthrough.mp4', poster: '/work/motormoura/current-home.webp', width: 1440, height: 900,
        text: { pt: { alt: 'Navegação real no site atual da MotorMoura.', caption: 'Apresentação da distribuidora, linhas de produto e atendimento.' }, en: { alt: 'A real walkthrough of the current MotorMoura website.', caption: 'The distributor, product ranges and contact information.' } } },
    ],
    chapters: [
      { id: 'mobile', sections: ['process', 'decisions'], media: ['moura-mobile'], layout: 'mobile' },
      { id: 'walkthrough', title: { pt: 'O projeto em uso', en: 'The project in use' }, sections: [], media: ['moura-video'], layout: 'wide' },
      { id: 'outcome', sections: ['impact'], media: [], layout: 'text' },
    ],
  },
  '1000-pecas': {
    leadMedia: 'pecas-home', leadMode: 'wide', editorial: true,
    delivery: { pt: 'Site institucional e catálogo de peças', en: 'Company website and parts catalogue' },
    headings: {
      pt: { problem: 'Da apresentação à procura pela peça', process: 'A busca ganha uma estrutura', decisions: 'Identidade que acompanha a navegação', impact: 'O que foi entregue' },
      en: { problem: 'From the introduction to finding a part', process: 'A structured search', decisions: 'Identity throughout the journey', impact: 'What was delivered' },
    },
    media: [
      shot('pecas-home', '/work/1000-pecas/current-home.webp', 1440, 900,
        'Abertura com a identidade da operação de peças para veículos pesados.', 'Opening with the heavy vehicle parts business’s identity.'),
      shot('pecas-mobile', '/work/1000-pecas/current-mobile.webp', 780, 1688,
        'Apresentação da empresa e acesso ao atendimento no celular.', 'The business introduction and contact access on mobile.', 390),
      { id: 'pecas-video', type: 'video', src: '/work/1000-pecas/current-walkthrough.mp4', poster: '/work/1000-pecas/current-home.webp', width: 1440, height: 900,
        text: { pt: { alt: 'Navegação real no site e catálogo atuais da 1000 Peças.', caption: 'Da abertura ao catálogo público, com identificação e filtros de peças.' }, en: { alt: 'A real walkthrough of the current 1000 Peças website and catalogue.', caption: 'From the opening to the public catalogue, with part information and filters.' } } },
    ],
    chapters: [
      { id: 'mobile', sections: ['process', 'decisions'], media: ['pecas-mobile'], layout: 'mobile-left' },
      { id: 'walkthrough', title: { pt: 'O projeto em uso', en: 'The project in use' }, sections: [], media: ['pecas-video'], layout: 'wide' },
      { id: 'outcome', sections: ['impact'], media: [], layout: 'text' },
    ],
  },
  'roda-agro-marca': {
    leadMedia: 'roda-seal',
    leadMode: 'identity',
    social: {
      href: 'https://www.instagram.com/rodaagropiumhi/',
      pt: { label: 'Conhecer o Instagram da Roda', credit: 'Gestão do perfil durante o projeto: Miranda Faria.' },
      en: { label: 'Visit Roda’s Instagram', credit: 'Profile management during the project: Miranda Faria.' },
    },
    media: [
      shot('roda-seal', '/work/roda-agro-marca/04.webp', 1600, 1600,
        'Selo da 22ª edição.', 'Seal for the 22nd edition.', 640),
      shot('roda-panel', '/work/roda-agro-marca/01.webp', 1600, 893,
        'Aplicação da identidade no painel da feira.', 'The visual identity applied to the event backdrop.'),
      shot('roda-invitation', '/work/roda-agro-marca/02.webp', 892, 1600,
        'Convite com programação e informações do evento.', 'Invitation with the programme and event information.', 440),
      shot('roda-notice', '/work/roda-agro-marca/03.webp', 512, 917,
        'Comunicado de reservas no formato vertical.', 'A reservation notice in a portrait format.', 340),
    ],
    chapters: [
      { id: 'identity', sections: ['process'], media: ['roda-panel'], layout: 'wide' },
      { id: 'applications', sections: ['decisions'], media: ['roda-invitation', 'roda-notice'], layout: 'portraits' },
      { id: 'outcome', sections: ['impact'], media: [], layout: 'text' },
    ],
  },
  'advogados-lco': {
    leadMedia: 'lco-home',
    leadMode: 'wide',
    media: [
      shot('lco-home', '/work/advogados-lco/01.webp', 1440, 800,
        'Página inicial do escritório e acesso ao contato.', 'The firm’s homepage and contact entry point.'),
      shot('lco-office', '/work/advogados-lco/02.webp', 1440, 800,
        'O escritório e sua forma de atuação.', 'The firm and its approach.'),
      shot('lco-mobile', '/work/advogados-lco/03.webp', 1600, 900,
        'Página inicial na apresentação para celular.', 'The homepage presented for mobile.'),
    ],
    chapters: [
      { id: 'office', sections: ['process', 'decisions'], media: ['lco-office'], layout: 'wide' },
      { id: 'mobile', sections: ['impact'], media: ['lco-mobile'], layout: 'split' },
    ],
  },
};

export function getCasePresentation(slug, lang = 'pt') {
  const p = presentations[slug] || remainingPresentations[slug];
  if (!p) return null;
  const locale = lang === 'en' ? 'en' : 'pt';
  return {
    ...p,
    delivery: p.delivery?.[locale] || null,
    headings: p.headings?.[locale] || null,
    chapters: p.chapters.map(chapter => ({ ...chapter, title: chapter.title?.[locale] || null })),
    media: p.media.map(({ text, ...m }) => ({ ...m, ...text[locale] })),
    social: p.social ? { href: p.social.href, ...p.social[locale] } : null,
  };
}

// The menu previews the same assets as the case, including current captures.
export function getCasePreviewMedia(slug) {
  const p = getCasePresentation(slug);
  if (!p) return null;
  return p.media.find(m => m.type === 'video') || p.media.find(m => m.id === p.leadMedia) || null;
}
