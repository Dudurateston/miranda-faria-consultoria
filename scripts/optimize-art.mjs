/**
 * Pipeline de arte: recorta o fundo claro, redimensiona e converte.
 *
 * A Lovart exportou tudo com fundo chapado, apesar de "transparente" no
 * nome — nenhum arquivo veio com canal alfa. Como a pagina desce de
 * branco-osso para uma camada funda, uma peca com fundo solido viraria
 * um retangulo claro assim que o fundo escurecesse.
 *
 * O recorte mede a cor de fundo nos cantos e apaga por distancia de cor
 * ate ela, com faixa de transicao para nao serrilhar. Funciona porque a
 * arte e sempre marca escura (grafite, pedra, cobre) sobre fundo claro.
 *
 * Uso:  node scripts/optimize-art.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-source";

// Faixa de transicao, em distancia de cor ate o fundo detectado.
// Dentro de NEAR o pixel e fundo puro; passando FAR ja e arte opaca.
const NEAR = 10;
const FAR = 34;

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Recorta o fundo devolvendo um buffer PNG com alfa.
 *
 * A cor de fundo e MEDIDA nos cantos, nao assumida: a Lovart entregou
 * duas familias diferentes — umas em branco puro (254,254,254) e outras
 * no branco-osso da marca (~244,239,234). Um limiar absoluto acertava
 * uma familia e deixava a outra com um retangulo visivel contra a
 * pagina.
 */
async function keyOut(file) {
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  const { width: w, height: h } = info;

  const at = (x, y) => {
    const i = (y * w + x) * 4;
    return [out[i], out[i + 1], out[i + 2]];
  };
  // Mediana dos cantos: robusta a um canto que caia sobre arte.
  const corners = [
    at(2, 2), at(w - 3, 2), at(2, h - 3), at(w - 3, h - 3),
    at(w >> 1, 2), at(w >> 1, h - 3),
  ];
  const bg = [0, 1, 2].map((c) => {
    const vals = corners.map((p) => p[c]).sort((a, b) => a - b);
    return vals[vals.length >> 1];
  });

  for (let i = 0; i < out.length; i += 4) {
    const dr = out[i] - bg[0], dg = out[i + 1] - bg[1], db = out[i + 2] - bg[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    // Pixels mais escuros que o fundo sao arte; mais claros sao ruido
    // de compressao e tambem saem.
    const darker = lum(out[i], out[i + 1], out[i + 2]) < lum(bg[0], bg[1], bg[2]);
    const d = darker ? dist : Math.min(dist, NEAR);

    if (d <= NEAR) out[i + 3] = 0;
    else if (d < FAR) out[i + 3] = Math.round(255 * ((d - NEAR) / (FAR - NEAR)));
  }

  return sharp(out, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toBuffer();
}

/** Peca transparente, em WebP, em duas larguras. */
async function art(file, name, widths = [1600, 800]) {
  const keyed = await keyOut(path.join(SRC, file));
  for (const w of widths) {
    const suffix = w === widths[0] ? "" : `@${w}`;
    await sharp(keyed)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(`public/art/${name}${suffix}.webp`);
  }
  return name;
}

/** Marca: mesma coisa, mas em public/brand. */
async function brand(file, name, widths = [1024, 512]) {
  const keyed = await keyOut(path.join(SRC, file));
  for (const w of widths) {
    const suffix = w === widths[0] ? "" : `@${w}`;
    await sharp(keyed)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toFile(`public/brand/${name}${suffix}.webp`);
  }
  return name;
}

async function main() {
  await mkdir("public/art", { recursive: true });
  await mkdir("public/brand", { recursive: true });

  const files = await readdir(SRC);
  const find = (frag) => {
    const hit = files.find((f) => f.toLowerCase().includes(frag.toLowerCase()));
    if (!hit) throw new Error(`nao achei arquivo contendo "${frag}"`);
    return hit;
  };

  const jobs = [
    // Assinaturas das tres verticais — o ArtSlot procura por estes nomes
    [art, "Assinatura systems", "systems"],
    [art, "Assinatura design", "design"],
    [art, "Assinatura business", "business"],
    // Abertura e molduras
    [art, "Hero transicao blueprint", "hero"],
    [art, "Cases moldura screenshot", "case-frame"],
    [art, "Moldura case mobile", "case-frame-mobile"],
    // Apoio
    [art, "Marcadores 4 camadas", "layers"],
    [art, "Metodologia coluna geologica", "methodology"],
    [art, "Processo sete planos", "process"],
    // Marca
    [brand, "M camadas isolado", "m-layers"],
    [brand, "M simplificado", "m-solid"],
    [brand, "Lockup horizontal", "lockup"],
  ];

  for (const [fn, frag, name] of jobs) {
    await fn(find(frag), name);
    console.log("  ok", name);
  }

  // Textura repetivel: sem recorte, ela e o fundo.
  await sharp(path.join(SRC, find("Textura estratos repetivel")))
    .resize({ width: 720 })
    .webp({ quality: 72, effort: 5 })
    .toFile("public/art/strata-tile.webp");
  console.log("  ok strata-tile");

  // OG card: as redes renderizam sobre fundo imprevisivel, entao aqui
  // o fundo fica solido, no branco-osso da marca. PNG porque alguns
  // scrapers ainda nao leem WebP.
  await sharp(path.join(SRC, find("OG card exato")))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .flatten({ background: "#F5F1EA" })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile("public/og.png");
  console.log("  ok og.png");

  // Favicons a partir do M solido.
  const solid = await keyOut(path.join(SRC, find("M simplificado")));
  for (const size of [32, 180, 512]) {
    await sharp(solid)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(`public/favicon-${size}.png`);
  }
  console.log("  ok favicons 32/180/512");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
