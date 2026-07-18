const sharp = require('sharp');
const path = require('path');

const files = [
  {
    src: path.join(__dirname, '..', 'assets', 'cybrain-logo.png'),
    outputs: [
      { ext: 'webp', options: { quality: 90 } },
      { ext: 'avif', options: { quality: 50 } }
    ]
  }
];

async function convert() {
  for (const file of files) {
    for (const out of file.outputs) {
      const outPath = path.join(path.dirname(file.src), path.basename(file.src, path.extname(file.src)) + '.' + out.ext);
      try {
        console.log(`Converting ${file.src} -> ${outPath}`);
        // Disable the input pixel limit for very large PNGs (use with caution)
        await sharp(file.src, { limitInputPixels: false })
          // Avoid extreme pixel counts by limiting the width while preserving aspect
          .resize({ width: 1600, withoutEnlargement: true })
          [out.ext](out.options)
          .toFile(outPath);
        console.log(`Wrote ${outPath}`);
      } catch (err) {
        console.error('Error converting', file.src, 'to', out.ext, err);
      }
    }
  }
}

convert();
