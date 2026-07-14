#!/usr/bin/env node
// Optimiza imágenes bajadas de Framer: limita dimensiones y recomprime,
// SIN cambiar formato ni nombre de archivo (no rompe referencias del HTML).
// Se puede correr solo (`npm run optimize`) o desde sync-framer.mjs.

import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, extname } from 'path';

const IMAGES_DIR = join(import.meta.dirname, 'assets', 'framerusercontent.com', 'images');
const MAX_DIM = 2400;   // lado más largo (suficiente para retina/full-bleed)
const JPEG_Q = 80;
const WEBP_Q = 80;

function fmt(bytes) { return (bytes / 1024 / 1024).toFixed(2) + ' MB'; }

async function walk(dir) {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

export async function optimizeImages() {
  const files = await walk(IMAGES_DIR);
  let before = 0, after = 0, changed = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

    const input = await readFile(file);
    before += input.length;

    let img;
    try {
      img = sharp(input, { failOn: 'none' });
      const meta = await img.metadata();
      if (!meta.width || !meta.height) { after += input.length; continue; }

      // Solo achicar si supera el máximo (nunca agrandar).
      if (Math.max(meta.width, meta.height) > MAX_DIM) {
        img = img.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
      }

      // Recomprimir preservando formato original.
      const outFmt = meta.format === 'jpeg' ? 'jpeg' : meta.format === 'png' ? 'png' : meta.format;
      if (outFmt === 'jpeg') img = img.jpeg({ quality: JPEG_Q, mozjpeg: true });
      else if (outFmt === 'png') img = img.png({ compressionLevel: 9, palette: true, effort: 8 });
      else if (outFmt === 'webp') img = img.webp({ quality: WEBP_Q, effort: 5 });

      const output = await img.toBuffer();

      // Solo escribir si realmente ahorramos algo.
      if (output.length < input.length) {
        await writeFile(file, output);
        after += output.length;
        changed++;
        console.log(`  ✔ ${file.split('/').pop().padEnd(34)} ${fmt(input.length).padStart(9)} → ${fmt(output.length)}`);
      } else {
        after += input.length;
      }
    } catch (e) {
      after += input.length;
      console.log(`  ⚠ ${file.split('/').pop()} (${e.message})`);
    }
  }

  console.log(`\n🖼️  ${changed} imágenes optimizadas · ${fmt(before)} → ${fmt(after)} (ahorro ${fmt(before - after)})`);
  return { before, after, changed };
}

// Ejecutable directo
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages().catch(e => { console.error('❌', e); process.exit(1); });
}
