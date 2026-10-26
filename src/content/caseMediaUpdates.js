// Short, traceable excerpts. Original files remain available unchanged.
const excerpts = {
  'queijos-serra': {
    id: 'queijos-serra-video',
    src: '/work/queijos-serra/context-stock.mp4',
    poster: '/work/queijos-serra/context-stock-poster.webp',
    width: 1280, height: 720, duration: 7,
    text: {
      pt: { alt: 'Consulta de produtos, lotes e validades no sistema.', caption: 'Produtos, lotes e validades. Trecho da gravação original do projeto.' },
      en: { alt: 'Products, batches and expiry dates in the system.', caption: 'Products, batches and expiry dates. An excerpt from the original project recording.' },
    },
  },
  'paulo-henrique': {
    id: 'paulo-henrique-video',
    src: '/work/paulo-henrique/context-tools.mp4',
    poster: '/work/paulo-henrique/context-tools-poster.webp',
    width: 1280, height: 720, duration: 7,
    text: {
      pt: { alt: 'Navegação pelo conteúdo e ferramentas do site Paulo Henrique.', caption: 'Conteúdo e ferramentas do site. Trecho da gravação original do projeto.' },
      en: { alt: 'Content and tools on the Paulo Henrique website.', caption: 'Website content and tools. An excerpt from the original project recording.' },
    },
  },
};

const labels = (pt, en) => ({ text: { pt: { alt: pt, caption: pt }, en: { alt: en, caption: en } } });
const captionUpdates = {
  'uaiso-travel-2': labels('Página Sobre nós, com a história da agência e a apresentação da fundadora.', 'The About page, with the agency’s story and its founder.'),
  'sevalho-controladoria-2': labels('Apresentação da consultoria e acesso ao diagnóstico.', 'The consultancy introduction and access to its diagnostic service.'),
  'vaf-global-2': labels('Posicionamento da consultoria e apresentação da fundadora.', 'The consultancy’s positioning and introduction to its founder.'),
};
// These four original 1600×900 boards contain a complete mobile viewport
// at this exact rectangle. Show that viewport legibly with CSS; the modal
// still opens the entire, byte-identical original board.
const mobileBoards = new Set(['uaiso-travel-3', 'sevalho-controladoria-3', 'vaf-global-3', 'lco-mobile']);

const image = (id, slug, file, pt, en, width = 1440, height = 900) => ({ id, type: 'image', src: `/work/${slug}/${file}`, width, height, ...labels(pt, en) });
const video = (id, slug, name, duration, pt, en) => ({ id, type: 'video', src: `/work/${slug}/${name}.mp4`, poster: `/work/${slug}/${name}-poster.webp`, width: 1280, height: 800, duration, ...labels(pt, en) });
const row = (id, section, media) => ({ id, sections: Array.isArray(section) ? section : [section], media: [media], layout: 'wide' });

function freshPresentation(slug, p) {
  const old = id => p.media.find(m => m.id === id);
  if (slug === 'rota-forte') return { ...p, media: [old('rota-home'), old('rota-operations'),
    image('rota-fleet', slug, 'context-frota.webp', 'Frota, equipamento selecionado e informações técnicas.', 'Fleet, selected equipment and technical information.'),
    video('rota-video', slug, 'context-frota', 6.533333, 'Navegação pela frota, documentação e área de atuação.', 'A walkthrough of the fleet, documentation and operating area.'),
    image('rota-location', slug, 'context-atendimento.webp', 'Localização da base e mapa da área de atuação.', 'The base location and operating area map.'),
  ], contextRows: [row('starting-point', 'problem', 'rota-operations'), row('fleet', 'process', 'rota-fleet'), row('navigation', 'decisions', 'rota-video'), row('location', 'impact', 'rota-location')] };
  if (slug === 'motormoura') return { ...p, media: [old('moura-home'), old('moura-mobile'),
    image('moura-quotation', slug, 'context-atendimento.webp', 'Orientações para cotação e acesso ao atendimento.', 'Quotation instructions and access to customer service.'),
    video('moura-video', slug, 'context-quotation', 3.75, 'Trecho da navegação pelas orientações de cotação e atendimento.', 'An excerpt of the quotation instructions and customer service journey.'),
  ], contextRows: [row('starting-point', ['problem', 'process'], 'moura-quotation'), row('mobile', 'decisions', 'moura-mobile'), row('quotation', 'impact', 'moura-video')] };
  if (slug === '1000-pecas') return { ...p, media: [old('pecas-home'), old('pecas-mobile'),
    image('pecas-categories', slug, 'context-categorias.webp', 'Categorias de peças organizadas em uma faixa de navegação.', 'Part categories arranged in a navigation strip.'),
    image('pecas-contact', slug, 'context-pecas.webp', 'Chamada para encontrar a peça e acessar o atendimento.', 'A prompt to find a part and contact the business.'),
    video('pecas-video', slug, 'context-categorias', 7.033333, 'Navegação pelas categorias, informações de compra e marcas.', 'A walkthrough of categories, purchase information and brands.'),
  ], contextRows: [row('starting-point', 'problem', 'pecas-contact'), row('categories', 'process', 'pecas-categories'), row('mobile', 'decisions', 'pecas-mobile'), row('navigation', 'impact', 'pecas-video')] };
  return p;
}

export function updateCaseMedia(slug, original) {
  original = freshPresentation(slug, original);
  const excerpt = excerpts[slug];
  return { ...original, media: original.media.map(m => ({
    ...m,
    ...(m.id === excerpt?.id ? excerpt : {}),
    ...(captionUpdates[m.id] || {}),
    ...(mobileBoards.has(m.id) ? { frame: { x: 610, y: 40, width: 378, height: 820 } } : {}),
  })) };
}
