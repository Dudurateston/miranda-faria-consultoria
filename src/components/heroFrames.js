/**
 * heroFrames.js — os 65 quadros da animação da marca, em ordem.
 *
 * Estes arquivos vivem na storage pública do Base44. Os nomes têm um
 * prefixo de hash gerado no upload, por isso não formam um padrão
 * previsível e precisam ser listados explicitamente.
 *
 * ATENÇÃO: os arquivos estão hospedados sob o app 69d13abf1923f13a0fcdbf60.
 * Não apague esse app — a hero deixa de carregar.
 */

const BASE =
  "https://base44.app/api/apps/69d13abf1923f13a0fcdbf60/files/mp/public/69d13abf1923f13a0fcdbf60/";

const FILES = [
  "851b3c112_frame_001.jpg",
  "bee37fc40_frame_002.jpg",
  "1f95fce27_frame_003.jpg",
  "e88b56401_frame_004.jpg",
  "b52de3e19_frame_005.jpg",
  "152ea2d68_frame_006.jpg",
  "97f5ecbdb_frame_007.jpg",
  "5486c91ef_frame_008.jpg",
  "d40e9b094_frame_009.jpg",
  "fff06f941_frame_010.jpg",
  "50420b476_frame_011.jpg",
  "39596bfe0_frame_012.jpg",
  "00ab7beff_frame_013.jpg",
  "9de3688c6_frame_014.jpg",
  "db29bff73_frame_015.jpg",
  "3e48c9899_frame_016.jpg",
  "3380b8af6_frame_017.jpg",
  "42231febe_frame_018.jpg",
  "a9bf01490_frame_019.jpg",
  "aba304023_frame_020.jpg",
  "6ec46a5fd_frame_021.jpg",
  "00aa6a5c3_frame_022.jpg",
  "8631401f6_frame_023.jpg",
  "24270a195_frame_024.jpg",
  "fdf1283a7_frame_025.jpg",
  "c3223f757_frame_026.jpg",
  "bced97ae5_frame_027.jpg",
  "92415e1b0_frame_028.jpg",
  "eed520137_frame_029.jpg",
  "043aa664f_frame_030.jpg",
  "f2e193c10_frame_031.jpg",
  "1b1e812a6_frame_032.jpg",
  "3c9c45f3f_frame_033.jpg",
  "1559660ed_frame_034.jpg",
  "307cd644f_frame_035.jpg",
  "0b280071d_frame_036.jpg",
  "911e9a2a0_frame_037.jpg",
  "ccc96cf2e_frame_038.jpg",
  "dfe5a3991_frame_039.jpg",
  "f7179bf0e_frame_040.jpg",
  "85a69251c_frame_041.jpg",
  "83ba4e8ef_frame_042.jpg",
  "a0859c3e8_frame_043.jpg",
  "1daa58e43_frame_044.jpg",
  "032b41f16_frame_045.jpg",
  "b3e3b8423_frame_046.jpg",
  "55696e402_frame_047.jpg",
  "c1f3e6c05_frame_048.jpg",
  "93714ea82_frame_049.jpg",
  "a92fdb178_frame_050.jpg",
  "318a4cbe8_frame_051.jpg",
  "c4eadd576_frame_052.jpg",
  "e0600d049_frame_053.jpg",
  "18aa02242_frame_054.jpg",
  "d40d90554_frame_055.jpg",
  "0ef47c933_frame_056.jpg",
  "cacd48790_frame_057.jpg",
  "31d9e4f27_frame_058.jpg",
  "00051a29f_frame_059.jpg",
  "52a9a87ee_frame_060.jpg",
  "3b1eab5b9_frame_061.jpg",
  "6704987f1_frame_062.jpg",
  "51c6b2849_frame_063.jpg",
  "6d6f1b6d7_frame_064.jpg",
  "cfbb18782_frame_065.jpg",
];

/** Ordena pelo número do frame, independente da ordem da lista acima. */
const HERO_FRAMES = FILES.slice()
  .sort((a, b) => {
    const na = parseInt(a.match(/frame_(\d+)/)[1], 10);
    const nb = parseInt(b.match(/frame_(\d+)/)[1], 10);
    return na - nb;
  })
  .map((name) => BASE + name);

export default HERO_FRAMES;
