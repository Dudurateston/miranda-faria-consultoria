const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.join(__dirname, 'public', 'work');
const slugs = ['uaiso-travel', 'advogados-lco', 'sevalho-controladoria', 'vaf-global'];

async function processImages() {
  for (const slug of slugs) {
    const folder = path.join(baseDir, slug);
    console.log(`Processing images in ${folder}...`);

    for (const num of ['01', '02', '03']) {
      const origPng = path.join(folder, `${num}.png`);
      const resizedPng = path.join(folder, `${num}@800.png`);
      const origWebp = path.join(folder, `${num}.webp`);
      const resizedWebp = path.join(folder, `${num}@800.webp`);

      if (!fs.existsSync(origPng)) {
        console.error(`Error: Original PNG ${origPng} not found!`);
        continue;
      }

      // 1. Create resized @800 PNG
      await sharp(origPng)
        .resize({ width: 800 })
        .toFile(resizedPng);
      console.log(`  Created ${resizedPng}`);

      // 2. Convert original PNG to WebP (quality 82)
      await sharp(origPng)
        .webp({ quality: 82 })
        .toFile(origWebp);
      console.log(`  Created ${origWebp}`);

      // 3. Convert @800 PNG to WebP (quality 82)
      await sharp(resizedPng)
        .webp({ quality: 82 })
        .toFile(resizedWebp);
      console.log(`  Created ${resizedWebp}`);
    }
  }
  console.log('Image processing completed successfully!');
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
