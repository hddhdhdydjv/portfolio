#!/usr/bin/env node

// Shrinks the images downloaded from Framer in place (same path, same format).
//
// Framer's CDN normally serves resized variants (?scale-down-to=…), but the sync
// strips those query params, so every page loads the original upload — some are
// 9600px wide PNGs or 2400px lossless WebPs shown at ~300px. We cap the width
// and re-encode with high-quality settings; filenames stay the same so no HTML
// or JS needs to change.

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = join(import.meta.dirname, 'assets', 'framerusercontent.com', 'images');
// Remembers which files were already optimized so re-running never re-encodes
// (and degrades) the same image twice. Wiped along with assets/ on every sync.
const MANIFEST = join(IMAGES_DIR, '.optimized.json');

// Largest size actually rendered on the site is ~1400 device px (1920px
// screen @2x); capping the longest side at 2400 leaves headroom for
// bigger/denser screens.
const MAX_SIDE = 2400;
// Images that are already this small are left untouched.
const MIN_BYTES = 300 * 1024;
const WEBP_QUALITY = 82;
const JPEG_QUALITY = 86;

export async function optimizeImages({ log = console.log } = {}) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    log('⚠️  sharp not installed — skipping image optimization (run `npm install`)');
    return;
  }

  let done = {};
  try { done = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch {}

  let before = 0, after = 0, count = 0;
  for (const name of await readdir(IMAGES_DIR)) {
    const ext = name.split('.').pop().toLowerCase();
    if (!['webp', 'png', 'jpg', 'jpeg'].includes(ext)) continue;

    const file = join(IMAGES_DIR, name);
    const { size } = await stat(file);
    if (size < MIN_BYTES || done[name] === size) continue;

    const input = await readFile(file);
    const meta = await sharp(input).metadata();
    if (meta.pages > 1) continue; // animated, leave as is

    let img = sharp(input).rotate();
    if (Math.max(meta.width, meta.height) > MAX_SIDE) {
      img = img.resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true });
    }

    if (ext === 'webp') img = img.webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true });
    // Only re-quantize PNGs that were already palette-based (no new banding).
    else if (ext === 'png') img = img.png({ compressionLevel: 9, palette: !!meta.paletteBitDepth, quality: 100, effort: 10 });
    else img = img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

    const output = await img.toBuffer();
    if (output.length >= size) { done[name] = size; continue; } // never make a file bigger

    await writeFile(file, output);
    done[name] = output.length;
    before += size; after += output.length; count++;
  }
  await writeFile(MANIFEST, JSON.stringify(done, null, 2) + '\n');

  if (count) log(`🖼️  Optimized ${count} images: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`);
  else log('🖼️  Images already optimized');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages().catch(e => { console.error('❌', e.message); process.exit(1); });
}
