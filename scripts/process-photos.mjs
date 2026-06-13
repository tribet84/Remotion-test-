// Procesa las fotos subidas: auto-orienta (EXIF), redimensiona y optimiza.
// Uso: node scripts/process-photos.mjs
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const SRC = '/root/.claude/uploads/abb4080d-0460-5f07-aa8b-de10896010a5';
const OUT = path.resolve('public/photos');

// origen → nombre de salida (+ rotación manual extra si EXIF no basta)
const MAP = [
  ['ea6e3a38-1000072084.jpg', 'brindis-coral.jpg'],
  ['6e99f900-1000072197.jpg', 'levada-bosque.jpg'],
  ['c4428170-1000072227.jpg', 'costa-mar.jpg'],
  ['ba03f926-1000072255.jpg', 'costa-norte.jpg'],
  ['d90d65b2-1000072358.jpg', 'pueblo.jpg'],
  ['e34a93a1-1000072730.jpg', 'mural-flores.jpg'],
  ['c2da7c8f-1000072898.jpg', 'ponta-sao-lourenco.jpg'],
  ['9d17e259-1000073909.jpg', 'pico-arieiro.jpg'],
  ['89618833-1000074048.jpg', 'atardecer.jpg'],
  ['466d77df-1000074540.jpg', 'espetada.jpg'],
  ['13ed0636-1000074775.jpg', 'plaza-palmeras.jpg'],
  ['b8c8e663-1000075343.jpg', 'cocteles-mar.jpg'],
];

await mkdir(OUT, {recursive: true});

for (const [src, dst] of MAP) {
  const srcPath = path.join(SRC, src);
  const meta = await sharp(srcPath).metadata();
  await sharp(srcPath)
    .rotate() // auto-orienta según EXIF
    .resize({
      width: 2160,
      height: 2160,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({quality: 84, mozjpeg: true})
    .toFile(path.join(OUT, dst));
  const outMeta = await sharp(path.join(OUT, dst)).metadata();
  console.log(
    `${dst.padEnd(26)} exif-orient=${String(meta.orientation ?? '-').padEnd(2)} ` +
      `src=${meta.width}x${meta.height} -> out=${outMeta.width}x${outMeta.height}`,
  );
}
console.log('OK');
