/**
 * Pipeline da midia dos cases: prints e capturas de tela dos sistemas.
 *
 * Diferente da arte (scripts/optimize-art.mjs), aqui NAO se recorta
 * fundo: sao capturas reais de tela e o enquadramento e o conteudo. O
 * trabalho e so redimensionar, converter e comprimir.
 *
 * Os originais ficam em assets-source/work/ e nao sao servidos.
 *
 * Uso:  node scripts/optimize-work.mjs
 */
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";
import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const SRC = "assets-source/work";

/** Print de sistema: duas larguras em WebP. */
async function shot(file, out, widths = [1600, 800]) {
  for (const w of widths) {
    const suffix = w === widths[0] ? "" : `@${w}`;
    await sharp(path.join(SRC, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(`public/work/${out}${suffix}.webp`);
  }
}

/**
 * Captura em movimento. As gravacoes chegam em 1080p com bitrate alto
 * (16 a 17 MB) — impublicavel. Reduz para 1280 de largura, CRF alto e
 * SEM audio: a trilha original e praticamente silencio (2 kb/s) e o
 * video toca em loop mudo na pagina.
 */
async function clip(file, out) {
  const src = path.join(SRC, file);
  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", src,
    "-vf", "scale=1280:-2",
    "-c:v", "libx264", "-crf", "30", "-preset", "slow",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", // metadados no inicio: comeca a tocar antes de baixar tudo
    "-an",
    `public/work/${out}.mp4`,
  ]);
}

/** Quadro de poster: o que aparece antes de o video comecar a tocar. */
async function poster(file, out, frame = 60) {
  const src = path.join(SRC, file);
  const tmp = `/tmp/poster-${out.replace(/\//g, "-")}.png`;
  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", src, "-vf", `select=eq(n\\,${frame})`, "-vframes", "1", tmp,
  ]);
  await sharp(tmp).resize({ width: 1600 }).webp({ quality: 78 }).toFile(`public/work/${out}.webp`);
  await sharp(tmp).resize({ width: 800 }).webp({ quality: 78 }).toFile(`public/work/${out}@800.webp`);
}

async function main() {
  for (const d of ["roda-agro", "paulo-henrique", "queijos-santana"]) {
    await mkdir(`public/work/${d}`, { recursive: true });
  }

  // Roda de Agronegocios — feira: abertura, cotas, mapa de estandes
  await shot("Captura de tela 2026-08-30 194325.png", "roda-agro/01");
  await shot("Captura de tela 2026-08-30 194406.png", "roda-agro/02");
  await shot("Captura de tela 2026-08-30 194416.png", "roda-agro/03");
  console.log("  ok roda-agro (3 prints)");

  // Paulo Henrique — abertura, frentes, laboratorio de performance
  await shot("Captura de tela 2026-08-30 194745.png", "paulo-henrique/01");
  await shot("Captura de tela 2026-08-30 194720.png", "paulo-henrique/02");
  await shot("Captura de tela 2026-08-30 194817.png", "paulo-henrique/03");
  await clip("video site Paulo.mp4", "paulo-henrique/video");
  await poster("video site Paulo.mp4", "paulo-henrique/poster", 40);
  console.log("  ok paulo-henrique (3 prints + video)");

  // Queijos Santana — so gravacao; os stills saem de quadros dela
  await clip("video sistema santana.mp4", "queijos-santana/video");
  await poster("video sistema santana.mp4", "queijos-santana/poster", 30);
  for (const [frame, out] of [[30, "01"], [200, "02"], [420, "03"]]) {
    await poster("video sistema santana.mp4", `queijos-santana/${out}`, frame);
  }
  console.log("  ok queijos-santana (video + 3 quadros)");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
