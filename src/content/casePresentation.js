// Presentation only. Original case facts, credits and media files stay in copy.js/public.
const shot = (id, src, width, height, pt, en, displayWidth) => ({
  id, type: 'image', src, width, height, displayWidth,
  text: { pt: { alt: pt, caption: pt }, en: { alt: en, caption: en } },
});

const presentations = {
  'rota-forte': {
    leadMedia: 'rota-home',
    leadMode: 'wide',
    media: [
      shot('rota-home', '/work/rota-forte/01.webp', 1440, 900,
        'Abertura do site e acesso à frota.', 'Website opening and access to the fleet.'),
      shot('rota-catalogue', '/work/rota-forte/02.webp', 1440, 900,
        'Catálogo com capacidades e solicitação de orçamento.', 'Equipment catalogue with specifications and a quote enquiry.'),
      { id: 'rota-video', type: 'video', src: '/work/rota-forte/video.mp4',
        poster: '/work/rota-forte/poster.webp', width: 1440, height: 900,
        text: {
          pt: { alt: 'Navegação pelo site Rota Forte.', caption: 'Percurso pelas páginas do site.' },
          en: { alt: 'Browsing the Rota Forte website.', caption: 'A walkthrough of the website.' },
        } },
      shot('rota-operations', '/work/rota-forte/03.webp', 1440, 900,
        'Apresentação de operações e informações técnicas.', 'Operations and technical information presented on the website.'),
    ],
    chapters: [
      { id: 'catalogue', sections: ['process'], media: ['rota-catalogue'], layout: 'split' },
      { id: 'walkthrough', sections: [], media: ['rota-video'], layout: 'wide' },
      { id: 'decisions', sections: ['decisions'], media: ['rota-operations'], layout: 'wide' },
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
  const p = presentations[slug];
  if (!p) return null;
  const locale = lang === 'en' ? 'en' : 'pt';
  return {
    ...p,
    media: p.media.map(({ text, ...m }) => ({ ...m, ...text[locale] })),
    social: p.social ? { href: p.social.href, ...p.social[locale] } : null,
  };
}
